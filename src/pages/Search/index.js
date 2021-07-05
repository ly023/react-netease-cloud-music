/**
 * 搜索页
 */
import React from 'react'
import {withRouter} from 'react-router-dom'
import {Link} from 'react-router-dom'
import qs from 'qs'
import {cloneDeep} from 'lodash'
import Page from 'components/Page'
import Search from 'components/Search'
import Tabs from 'components/Tabs'
import ListLoading from 'components/ListLoading'
import Empty from 'components/Empty'
import Pagination from 'components/Pagination'
import {SEARCH_TYPE} from 'constants'
import {requestSearch, requestMultiMatch} from 'services/search'
import {getUrlParameter} from 'utils'
import Songs from './components/Songs'
import Artists from './components/Artists'
import Albums from './components/Albums'
import Videos from './components/Videos'
import Lyrics from './components/Lyrics'
import Playlists from './components/Playlists'

import './index.scss'

function getUrlType() {
    const type = parseInt(getUrlParameter('type'), 10)
    if (Number.isNaN(type)) {
        return
    }
    return type
}

@withRouter
export default class SearchPage extends React.Component {
    constructor(props) {
        super(props)
        const searchValue = getUrlParameter('s')
        this.state = {
            activeType: getUrlType(),
            searchValue: searchValue,
            value: searchValue,
            limit: 0,
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
        const searchValue = getUrlParameter('s')
        const {activeType: prevActiveType, searchValue: prevSearchValue} = prevState
        if (searchValue !== prevSearchValue || (activeType !== prevActiveType)) {
            this.setState({
                activeType,
                searchValue,
            }, () => {
                if(searchValue !== prevSearchValue){
                    this.setState({value: searchValue})
                }
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
        const path = `${pathname}${qs.stringify(newQuery, {addQueryPrefix: true})}`
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
        this.fetchData((page - 1) * this.state.limit, true)
    }

    handleInputChange = (value) => {
        this.setState({value})
    }

    handlePressEnter = () => {
        this.setState({
            value: getUrlParameter('s')
        }, () => {
            this.fetchData()
        })
    }

    getLimitFromType = (type) => {
        switch (type) {
            case SEARCH_TYPE.ARTIST.TYPE:
            case SEARCH_TYPE.ALBUM.TYPE:
                return 75
            case SEARCH_TYPE.VIDEO.TYPE:
                return 20
            default:
                return 30
        }
    }

    fetchData = (offset = 0) => {
        const {activeType, searchValue, value} = this.state
        const keywords = value && value.trim() ? value : searchValue
        const limit = this.getLimitFromType(activeType)
        const params = {
            limit,
            offset,
            type: activeType,
            keywords
        }
        this.setState({loading: true})
        requestSearch(params)
            .then((res) => {
                if (this._isMounted) {
                    const {result = {}} = res
                    this.setState({
                        ...this.parseData(activeType, result),
                        limit,
                        offset,
                    })
                    if (value !== keywords) {
                        this.setState({value: keywords})
                    }
                }
            })
            .finally(() => {
                if (this._isMounted) {
                    this.setState({loading: false})
                }
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
            case SEARCH_TYPE.LYRIC.TYPE:
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
            case SEARCH_TYPE.VIDEO.TYPE:
                return {
                    list: result.videos || [],
                    total: result.videoCount || 0,
                }
            case SEARCH_TYPE.PLAYLIST.TYPE:
                return {
                    list: result.playlists || [],
                    total: result.playlistCount || 0
                }
            default:
                return {
                    list: [],
                    total: 0
                }
        }
    }

    handleSubscribePlaylistSuccess = (index) => {
        const currentList = cloneDeep(this.state.list)
        currentList[index] = {
            ...currentList[index],
            subscribed: !(currentList[index].subscribed)
        }
        this.setState({
            list: currentList
        })
    }

    getRenderList = () => {
        const {activeType, searchValue, list} = this.state
        switch (activeType) {
            case SEARCH_TYPE.SONG.TYPE:
                return <Songs keyword={searchValue} list={list}/>
            case SEARCH_TYPE.ARTIST.TYPE:
                return <Artists keyword={searchValue} list={list}/>
            case SEARCH_TYPE.ALBUM.TYPE:
                return <Albums keyword={searchValue} list={list}/>
            case SEARCH_TYPE.VIDEO.TYPE:
                return <Videos keyword={searchValue} list={list}/>
            case SEARCH_TYPE.LYRIC.TYPE:
                return <Lyrics keyword={searchValue} list={list}/>
            case SEARCH_TYPE.PLAYLIST.TYPE:
                return <Playlists keyword={searchValue} list={list} onSubscribeSuccess={this.handleSubscribePlaylistSuccess}/>
            default:
        }
    }

    render() {
        const {activeType, searchValue, value, loading, list, limit, total, current, recQuery} = this.state

        const tabs = Object.keys(SEARCH_TYPE).map((k) => {
            const {TYPE: key, TEXT: name} = SEARCH_TYPE[k]
            return {key, name}
        })

        return (
            <Page>
                <div className="main">
                    <div styleName="wrapper">
                        <div styleName="search-wrapper">
                            <Search
                                type="pageSearch"
                                value={value}
                                onChange={this.handleInputChange}
                                onPressEnter={this.handlePressEnter}
                            />
                        </div>
                        <div styleName="summary">
                            { loading ? null : <>搜索"{searchValue}"，找到<span styleName="total"> {total} </span>{this.getTypeText(activeType)}
                                {
                                    Array.isArray(recQuery) && recQuery.length ? <>
                                    ，您是不是要搜：{
                                            recQuery.map((s) => {
                                                return <Link key={s} styleName="rec"
                                                    to={`/search?s=${window.encodeURIComponent(s)}&type=${activeType}`}>{s}</Link>
                                            })
                                        }
                                    </> : null
                                }</>
                            }
                        </div>
                        <Tabs tabs={tabs} activeTabKey={activeType} onChange={this.handleTabChange}/>
                        <ListLoading loading={loading}/>
                        {
                            !loading ? (
                                list.length ? <>
                                    {this.getRenderList()}
                                    <Pagination
                                        current={current}
                                        total={total}
                                        pageSize={limit}
                                        onChange={this.handlePageChange}
                                    />
                                </> : <Empty tip="很抱歉，未能找到相关搜索结果！"/>
                            ) : ''
                        }
                    </div>
                </div>
            </Page>
        )
    }
}
