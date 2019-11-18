/**
 * 搜索组件
 */
import React from 'react'
import PropTypes from 'prop-types'
import {withRouter, Link} from 'react-router-dom'
import {SEARCH_TYPE} from 'constants'
import KEY_CODE from 'constants/keyCode'
import {click, getLocalStorage, getUrlParameter, setLocalStorage} from 'utils'
import {getArtists, getRenderKeyword} from 'utils/song'
import {requestSearchSuggest} from 'services/search'

import './index.scss'

@withRouter
export default class Search extends React.Component {

    static propTypes = {
        wrapperId: PropTypes.string.isRequired,
        inputWrapper: PropTypes.node.isRequired,
        input: PropTypes.node.isRequired,
        resultWrapper: PropTypes.node.isRequired,
        showSearchTip: PropTypes.bool,
        extractLinkParameters: PropTypes.bool,
        defaultValue: PropTypes.string,
        onPressEnter: PropTypes.func,
    }

    static defaultProps = {
        showSearchTip: false,
        extractLinkParameters: false,
        onPressEnter(){}
    }

    constructor(props) {
        super(props)
        this.state = {
            keyword: this.props.defaultValue,
            result: {},
            resultVisible: false,
            activeUrl: '',
            urls: [],
            mvSupportVisible: false
        }
    }

    componentDidMount() {
        document.addEventListener('click', this.handleDocumentClick)
        if (this.props.showSearchTip) {
            this.mvSupport()
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleDocumentClick)
        document.removeEventListener('keydown', this.keyDownListener)
    }

    handleDocumentClick = (e) => {
        click(e, this.props.wrapperId, () => {
            this.hideResult()
        })
    }

    mvSupport = () => {
        const localFlag = getLocalStorage('local-flag')
        if (!localFlag || (localFlag && !localFlag.newMvSearch)) {
            this.setState({mvSupportVisible: true})
            setLocalStorage('local-flag', {
                ...localFlag,
                newMvSearch: true
            })
            window.setTimeout(() => {
                this.setState({mvSupportVisible: false})
            }, 5000)
        }
    }

    keyDownListener = (e) => {
        const {keyCode} = e
        const {activeUrl, urls} = this.state
        const index = urls.findIndex((v) => activeUrl === v)

        if (keyCode === KEY_CODE.UP || keyCode === KEY_CODE.DOWN) {
            let nextIndex = 0
            if (keyCode === KEY_CODE.UP) { // 上
                if (index === -1 || index === 0) {
                    nextIndex = urls.length - 1
                } else {
                    nextIndex = index - 1
                }
            } else if (keyCode === KEY_CODE.DOWN) { // 下
                if (index === urls.length - 1) {
                    nextIndex = 0
                } else {
                    nextIndex = index + 1
                }
            }
            this.setState({
                activeUrl: urls[nextIndex]
            })
            return
        }
        // 回车选中
        if (keyCode === KEY_CODE.ENTER && activeUrl) {
            e.preventDefault()
            this.hideResult()
            this.props.history.push(activeUrl)
        }
    }

    handleEnterKey = (e) => {
        const keyCode = e.nativeEvent.which || e.nativeEvent.which
        const {keyword} = this.state
        if (keyCode === KEY_CODE.ENTER && keyword && keyword.trim()) {
            this.hideResult()
            const type = getUrlParameter('type') || SEARCH_TYPE.SONG.TYPE
            this.props.history.push(`/search?s=${keyword}&type=${type}`)
            this.props.onPressEnter()
        }
    }

    handleFocus = () => {
        const {keyword} = this.state
        if (keyword && keyword.trim()) {
            this.showResult()
            this.fetchSearchSuggest(keyword)
        }
    }

    handleChange = (e) => {
        const {value} = e.target
        this.setState({keyword: value})
        if (value.trim()) {
            if (!this.state.resultVisible) {
                this.showResult()
            }
            this.fetchSearchSuggest(value)
        } else {
            this.hideResult()
        }
    }

    getSearchUrl = () => {
        return `/search?s=${this.state.keyword}&type=${SEARCH_TYPE.USER.TYPE}`
    }

    fetchSearchSuggest = (value) => {
        const params = {keywords: value}
        requestSearchSuggest(params)
            .then((res) => {
                const {result: data = {}} = res
                let result = {}
                let urls = [this.getSearchUrl()]
                Array.isArray(data.order) && data.order.forEach((key) => {
                    const list = data[key] || []
                    result[key] = list
                    urls = urls.concat(list.map((v) => {
                        return `/${key.substr(0, key.length - 1)}/${v.id}`
                    }))
                })
                this.setState({
                    result,
                    urls,
                    resultVisible: !!Object.keys(result).length
                })
            })
    }

    showResult = () => {
        this.setState({
            resultVisible: true
        })
        document.addEventListener('keydown', this.keyDownListener)
    }

    hideResult = () => {
        this.setState({
            resultVisible: false,
            activeUrl: ''
        })
        document.removeEventListener('keydown', this.keyDownListener)
    }

    getTypeText = (type) => {
        switch (type) {
            case 'songs':
                return '单曲'
            case 'artists':
                return '歌手'
            case 'albums':
                return '专辑'
            case 'mvs':
                return '视频'
            case 'playlists':
                return '歌单'
            default:
        }
    }

    getRenderKeyword = (text) => {
        const {keyword} = this.state
        return getRenderKeyword(text, keyword)
    }

    getClass = (type, item) => {
        return `/${type.substr(0, type.length - 1)}/${item.id}` === this.state.activeUrl ? 'active' : ''
    }

    getRenderSongItem = (item) => {
        return  <Link to={`/song/${item.id}`}>{this.getRenderKeyword(`${item.name}-${getArtists(item.artists)}`)}</Link>
    }

    getRenderArtistItem = (item) => {
        return  <Link to={`/artist/${item.id}`}>{this.getRenderKeyword(item.name)}</Link>
    }

    getRenderAlbumItem = (item) => {
        return <Link to={`/album/${item.id}`}>{this.getRenderKeyword(`${item.name}-${item.artist?.name}`)}</Link>
    }

    getRenderMVItem = (item) => {
        return <Link to={`/mv/${item.id}`}>MV:{this.getRenderKeyword(`${item.name}-${item.artistName}`)}</Link>
    }

    getRenderPlaylistItem = (item) => {
        return  <Link to={`/playlist/${item.id}`}>{this.getRenderKeyword(item.name)}</Link>
    }

    getRenderItem = (type, item) => {
        switch (type) {
            case 'songs':
                return this.getRenderSongItem(item)
            case 'artists':
                return this.getRenderArtistItem(item)
            case 'albums':
                return this.getRenderAlbumItem(item)
            case 'mvs':
                return this.getRenderMVItem(item)
            case 'playlists':
                return this.getRenderPlaylistItem(item)
            default:
        }
    }

    render() {
        let {wrapperId, inputWrapper, input: Input, defaultValue, resultWrapper} = this.props
        const {keyword, result, resultVisible, activeUrl, mvSupportVisible} = this.state

        const searchUrl = this.getSearchUrl()

        return (
            <div id={wrapperId} styleName="wrapper">
                <div styleName="mv-support" style={{display: !keyword && mvSupportVisible ? 'block' : 'none'}}>
                    <p>现在支持搜索MV啦</p>
                </div>
                {
                    React.cloneElement(inputWrapper, {
                        children: React.cloneElement(Input, {
                            defaultValue: defaultValue,
                            onChange: this.handleChange,
                            onKeyPress: this.handleEnterKey,
                            onFocus: this.handleFocus,
                        })
                    })
                }
                {
                    React.cloneElement(resultWrapper, {
                        style: {display: resultVisible ? 'block' : 'none'},
                        children: <div styleName="layout">
                            <div styleName="list">
                                <p styleName="note">
                                    <Link to={searchUrl} styleName={searchUrl === activeUrl ? 'active' : ''}>搜 "{keyword}" 相关用户</Link> >
                                </p>
                                {
                                    result && Object.keys(result).length ? <div>
                                        {
                                            Object.keys(result).map((type, index) => {
                                                const typeText = this.getTypeText(type)
                                                const values = result[type]
                                                return <div key={type} styleName="item">
                                                    <div styleName="label">
                                                        <span styleName={`icon icon-${type}`}/>
                                                        <span>{typeText}</span>
                                                    </div>
                                                    <ul styleName={`result${index % 2 ? ' odd' : ''}`}
                                                        onClick={this.hideResult}>
                                                        {
                                                            values.map((v) => {
                                                                return <li key={v.id} styleName={this.getClass(type, v)}>
                                                                    {this.getRenderItem(type, v)}
                                                                </li>
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            })
                                        }
                                    </div> : null
                                }
                            </div></div>
                    })
                }
            </div>
        )
    }
}

