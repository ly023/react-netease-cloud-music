/**
 * 搜索组件
 */
import {Component, createRef} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import withRouter from 'hoc/withRouter'
import {SEARCH_TYPE} from 'constants'
import KEY from 'constants/keyboardEventKey'
import {click, generateRandomString, getLocalStorage, getUrlParameter, setLocalStorage} from 'utils'
import {getArtists, getRenderKeyword} from 'utils/song'
import {getVideoPathname} from 'utils/video'
import {requestSearchSuggest} from 'services/search'

import './index.scss'

@withRouter
export default class Search extends Component {

    static propTypes = {
        type: PropTypes.oneOf(['navSearch', 'pageSearch']).isRequired,
        showSearchTip: PropTypes.bool,
        value: PropTypes.string,
        onChange: PropTypes.func,
        onPressEnter: PropTypes.func,
    }

    static defaultProps = {
        showSearchTip: false,
        onChange(){},
        onPressEnter(){}
    }

    constructor(props) {
        super(props)
        const {value} = props
        this.state = {
            wrapperId: generateRandomString(),
            keyword: value,
            result: {},
            resultVisible: false,
            activeUrl: '',
            urls: [],
            mvSupportVisible: false
        }

        this.inputRef = createRef()
        this.focus = false
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
        click(e, this.state.wrapperId, () => {
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

        if (keyCode === KEY.ARROW_UP || keyCode === KEY.ARROW_DOWN) {
            let nextIndex = 0
            if (keyCode === KEY.ARROW_UP) { // 上
                if (index === -1 || index === 0) {
                    nextIndex = urls.length - 1
                } else {
                    nextIndex = index - 1
                }
            } else if (keyCode === KEY.ARROW_DOWN) { // 下
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
        if (keyCode === KEY.ENTER && activeUrl) {
            e.preventDefault()
            this.hideResult()
            this.props.navigate(activeUrl)
        }
    }

    handleEnterKey = (e) => {
        if (e.key === KEY.ENTER) {
            this.handleSearch()
        }
    }

    handleSearch = () => {
        const {keyword} = this.state
        const searchValue = window.decodeURIComponent(getUrlParameter('s'))
        this.hideResult()
        if (keyword !== searchValue && keyword && keyword.trim()) {
            const type = getUrlParameter('type') || SEARCH_TYPE.SONG.TYPE
            this.props.navigate(`/search?s=${window.encodeURIComponent(keyword)}&type=${type}`)
            this.props.onPressEnter()
            this.inputRef.current.blur()
        }
    }

    handleFocus = () => {
        this.focus = true

        const {keyword, mvSupportVisible} = this.state
        if(mvSupportVisible) {
            this.setState({mvSupportVisible: false})
        }
        if (keyword && keyword.trim()) {
            this.fetchSearchSuggest(keyword)
        }
    }

    handleBlur = () => {
        this.focus = false
    }

    handleChange = (e) => {
        const {value} = e.target
        this.setState({keyword: value})
        if (value.trim()) {
            this.fetchSearchSuggest(value)
        } else {
            this.hideResult()
        }
        this.props.onChange(value)
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
                const resultVisible = this.focus && Object.keys(result).length
                if (resultVisible) {
                    if (!this.state.resultVisible) {
                        document.addEventListener('keydown', this.keyDownListener)
                    }
                } else {
                    document.removeEventListener('keydown', this.keyDownListener)
                }
                this.setState({
                    result,
                    urls,
                    resultVisible
                })
            })
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
        const pathname = getVideoPathname(item?.type, item?.id)
        return <Link to={pathname}>MV:{this.getRenderKeyword(`${item.name}-${item.artistName}`)}</Link>
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

    getInputProps = () => {
        const {value} = this.props
        return {
            value: value,
            onChange: this.handleChange,
            onKeyPress: this.handleEnterKey,
            onFocus: this.handleFocus,
            onBlur: this.handleBlur
        }
    }

    getNavSearchInput = () => {
        return <div styleName="nav-search-bar">
            <SearchIcon styleName="search-icon" />
            <input
                ref={this.inputRef}
                placeholder="音乐/视频/电台/用户"
                styleName="nav-search-input"
                {...this.getInputProps()}
            />
        </div>
    }

    getPageSearchInput = () => {
        return <div styleName="page-search-bar">
            <input
                ref={this.inputRef}
                styleName="page-search-input"
                {...this.getInputProps()}
            />
            <span styleName="page-search-icon" onClick={this.handleSearch}/>
        </div>
    }

    getRenderInput = (type) => {
        switch (type) {
            case 'navSearch':
                return this.getNavSearchInput()
            case 'pageSearch':
                return this.getPageSearchInput()
            default:
                return null
        }
    }

    render() {
        let {type} = this.props
        const {wrapperId, keyword, result, resultVisible, activeUrl, mvSupportVisible} = this.state

        const searchUrl = this.getSearchUrl()

        return (
            <div id={wrapperId} styleName="wrapper">
                <div styleName="mv-support" style={{display: !keyword && mvSupportVisible ? 'block' : 'none'}}>
                    <p>现在支持搜索MV啦</p>
                </div>
                {this.getRenderInput(type)}
                <div
                    styleName={type === "navSearch" ? 'nav-search-layout' : 'page-search-layout'}
                    style ={{display: resultVisible ? 'block' : 'none'}}
                >
                    <div styleName="layout">
                        <div styleName="list">
                            <p styleName="note">
                                <Link to={searchUrl} styleName={searchUrl === activeUrl ? 'active' : ''} onClick={this.hideResult}>搜 &quot;{keyword}&quot; 相关用户</Link> >
                            </p>
                            {
                                result && Object.keys(result).length
                                    ? <div>
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
                                    </div>
                                    : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


