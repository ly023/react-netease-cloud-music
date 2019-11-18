/**
 * 搜索页
 */
import React from 'react'
import {withRouter} from 'react-router-dom'
import qs from 'qs'
import {Link} from 'react-router-dom'
import Page from 'components/Page'
import Search from 'components/Search'
import Pagination from 'components/Pagination'
import {SEARCH_TYPE} from 'constants'
import {requestSearch, requestMultiMatch} from 'services/search'
import {getUrlParameter} from 'utils'
import Loading from './components/Loading'
import Empty from './components/Empty'
import Songs from './components/Songs'

import './index.scss'

function getUrlType() {
    const type = parseInt(getUrlParameter('type'), 10)
    if (Number.isNaN(type)) {
        return
    }
    return type
}

const LIMIT = 30

@withRouter
export default class SearchPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeType: getUrlType(),
            value: getUrlParameter('s'),
            offset: 0,
            total: 0,
            current: 1,
            list: [],
            loading: false,
            recQuery: [],
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.fetchData()
    }

    componentDidUpdate(prevProps, prevState) {
        const activeType = getUrlType()
        const value = getUrlParameter('s')
        const {activeType: prevActiveType, value: prevValue} = prevState

        if (value !== prevValue || (activeType !== prevActiveType)) {
            this.setState({
                activeType,
                value
            }, () => {
                this.fetchData()
            })
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    handleTabChange = (type) => {
        if (type !== this.state.activeType) {
            this.setState({
                activeType: type,
                list: [],
                total: 0,
                current: 1,
            }, () => {
                this.setUrlQuery('type', type)
                this.fetchData()
            })
        }
    }

    setUrlQuery = (type, value) => {
        const {pathname, search} = this.props.history.location
        const query = qs.parse(search, {ignoreQueryPrefix: true})
        const newQuery = {
            ...query,
            [type]: value
        }
        const path = `${pathname}?${qs.stringify(newQuery)}`
        this.props.history.replace(path)
    }

    getTypeText = (activeType) => {
        const values = Object.values(SEARCH_TYPE)
        const item = values.find((v) => v.TYPE === activeType)
        if (item) {
            return `${item.UNIT}${item.TEXT}`
        }
    }

    handlePageChange = (page) => {
        this.setState({
            current: page
        })
        this.fetchData((page - 1) * LIMIT, true)
    }

    handlePressEnter = () => {
        this.setState({
            value: getUrlParameter('s')
        }, () => {
            this.fetchData()
        })
    }

    fetchData = (offset = 0) => {
        const {activeType, value} = this.state

        const params = {
            offset,
            type: activeType,
            keywords: value
        }
        this.setState({loading: true})
        requestSearch(params)
            .then((res) => {
                if (this._isMounted) {
                    const {result = {}} = res
                    this.setState(this.parseData(activeType, result))
                }
            })
            .finally(() => {
                this.setState({loading: false})
            })
        requestMultiMatch(params)
            .then((res) => {
                if (this._isMounted) {
                    const {result = {}} = res
                    this.setState({
                        recQuery: result.rec_query || []
                    })
                }
            })
    }

    parseData = (type, result) => {
        switch (type) {
            case SEARCH_TYPE.SONG.TYPE:
                return {
                    list: result.songs || [],
                    total: result.songCount || 0,
                }
            case SEARCH_TYPE.ARTIST.TYPE:
                return {
                    list: result.artists || [],
                    total: result.artistCount || 0,
                }
            case SEARCH_TYPE.ALBUM.TYPE:
                return {
                    list: result.albums || [],
                    total: result.albumCount || 0,
                }
            case SEARCH_TYPE.MV.TYPE:
                return {
                    list: result.videos || [],
                    total: result.videoCount || 0,
                }
            default:
                return {
                    list: [],
                    total: 0
                }
        }
    }

    getRenderList = () => {
        const {activeType, value, list} = this.state
        switch (activeType) {
            case SEARCH_TYPE.SONG.TYPE:
                return <Songs keyword={value} list={list}/>
            default:
        }
    }

    render() {
        const {activeType, value, loading, list, total, current, recQuery} = this.state

        return (
            <Page>
                <div className="main">
                    <div styleName="wrapper">
                        <div styleName="search-wrapper">
                            <Search
                                key={value} // value变化重新渲染Search组件
                                wrapperId="search-page"
                                inputWrapper={<div styleName="search-bar"/>}
                                input={<input styleName="input"/>}
                                resultWrapper={<div styleName="layout"/>}
                                defaultValue={value}
                                onPressEnter={this.handlePressEnter}
                            />
                        </div>
                        <div styleName="summary">
                            搜索"{value}"，找到<span styleName="total"> {total} </span>{this.getTypeText(activeType)}
                            {
                                Array.isArray(recQuery) && recQuery.length ? <>
                                    ，您是不是要搜：{
                                        recQuery.map((s) => {
                                            return <Link key={s} styleName="rec"
                                                to={`/search?s=${s}&type=${activeType}`}>{s}</Link>
                                        })
                                    }
                                </> : null
                            }
                        </div>
                        <div styleName="tab-panel">
                            <ul styleName="tabs">
                                {
                                    Object.keys(SEARCH_TYPE).map((key) => {
                                        const {TYPE: type, TEXT: text} = SEARCH_TYPE[key]
                                        return <li
                                            key={key}
                                            onClick={() => this.handleTabChange(type)}
                                            styleName={`tab${type === activeType ? ' active' : ''}`}
                                        >
                                            {text}
                                        </li>
                                    })
                                }
                            </ul>
                            <div styleName="list">
                                {
                                    loading ? <Loading/>
                                        : (!list.length
                                            ? <Empty/>
                                            : <>
                                                {this.getRenderList()}
                                                <Pagination
                                                    current={current}
                                                    total={Math.ceil(total / LIMIT)}
                                                    onChange={this.handlePageChange}
                                                />
                                            </>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Page>
        )
    }
}
