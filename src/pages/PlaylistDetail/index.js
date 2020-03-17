/**
 * 歌单详情页
 */
import React from 'react'
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'
import dayjs from 'dayjs'
dayjs.locale('zh-cn')
import Page from 'components/Page'
import Comments from 'components/Comments'
import {DATE_FORMAT, DEFAULT_DOCUMENT_TITLE, PLAYLIST_COLLECTION_TYPE} from 'constants'
import {PLAY_TYPE} from 'constants/play'
import Add from 'components/Add'
import Play from 'components/Play'
import {requestDetail, requestRelated} from 'services/playlist'
import {formatNumber, getThumbnail} from 'utils'
import emitter from 'utils/eventEmitter'
import Collapse from 'components/Collapse'
import SongTable from 'components/SongTable'
import SubscribedUsers from 'components/SubscribedUsers'
import RelatedPlaylists from 'components/RelatedPlaylists'
import ClientDownload from 'components/ClientDownload'
import SubscribePlaylist from 'components/SubscribePlaylist'

import './index.scss'

@withRouter
@connect(({user}) => ({
    isLogin: user.isLogin,
    userInfo: user.userInfo,
}))
export default class PlaylistDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = this.getInitialState()
    }

    getInitialState = () => {
        return {
            detailLoading: false,
            detail: {},
            related: [],
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.fetchData()
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.setState(this.getInitialState())
            this.fetchData()
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    fetchData = () => {
        const {id} = this.props.match.params
        if (id) {
            this.fetchDetail(id)
            this.fetchRelated(id)
        }
    }

    parseTracks = (tracks = [], privileges = []) => {
        const newTracks = []
        const len = tracks.length
        for (let i = 0; i < len; i++) {
            const item = tracks[i]
            newTracks.push({
                ...item,
                al: {},
                ar: [],
                album: item.al,
                artists: item.ar,
                duration: item.dt,
                privilege: privileges[i] || {}
            })
        }
        return newTracks
    }

    fetchDetail = async (id) => {
        try {
            this.setState({detailLoading: true})
            const res = await requestDetail({id})
            if (this._isMounted) {
                const playlist = res?.playlist || {}
                const detail = {
                    ...playlist,
                    tracks: [],
                    songs: this.parseTracks(playlist.tracks, res?.privileges),
                }
                this.setState({detail})
            }
        } finally {
            this.setState({detailLoading: false})
        }
    }

    fetchRelated = async (id) => {
        const res = await requestRelated({id})
        if (this._isMounted) {
            this.setState({
                related: res.playlists || []
            })
        }
    }

    setCommentsRef = (ref) => {
        this.commentsRef = ref
    }

    validateLogin = () => {
        const {isLogin} = this.props
        if (isLogin) {
            return true
        }
        emitter.emit('login')
        return false
    }

    handleComment = () => {
        if (this.validateLogin()) {
            this.commentsRef.focusEditor()
        }
    }

    handleSubscribeSuccess = () => {
        this.setState((prevState) => {
            return {
                detail: {
                    ...prevState.detail,
                    subscribed: !(prevState.detail.subscribed)
                }
            }
        })
    }

    render() {
        const {userInfo} = this.props
        const {detailLoading, detail, related} = this.state

        const title = detail ? `${detail?.name || ''} - 歌单 - ${DEFAULT_DOCUMENT_TITLE}` : DEFAULT_DOCUMENT_TITLE

        const isSelf = detail?.creator?.userId === userInfo?.userId

        return (
            <Page title={title}>
                <div className="main">
                    <div className="left-wrapper">
                        <div className="left">
                            <div className="clearfix">
                                <div styleName="cover">
                                    <img
                                        src={getThumbnail(detail.coverImgUrl, 200)}
                                        alt="封面"
                                    />
                                </div>
                                <div styleName="content">
                                    <span styleName="label"/>
                                    <h2 styleName="title">{detail.name}</h2>
                                    <div styleName="creator">
                                        <Link to="/" styleName="avatar">
                                            <img src={detail.creator?.avatarUrl} alt=""/>
                                        </Link>
                                        <Link to="/" styleName="nickname">{detail.creator?.nickname}</Link>
                                        <span
                                            styleName="time">{dayjs(detail.createTime).format(DATE_FORMAT)} 创建</span>
                                    </div>
                                    <div styleName="operation">
                                        <Play id={detail.id} type={PLAY_TYPE.PLAYLIST.TYPE}>
                                            <a href={null} styleName="btn-play" title="播放"><i><em/>播放</i></a>
                                        </Play>
                                        <Add id={detail.id} type={PLAY_TYPE.PLAYLIST.TYPE}>
                                            <a href={null} styleName="btn-add-play" title="添加到播放列表"/>
                                        </Add>

                                        <SubscribePlaylist
                                            id={detail.id}
                                            type={detail.subscribed ? PLAYLIST_COLLECTION_TYPE.CANCEL : PLAYLIST_COLLECTION_TYPE.OK}
                                            disabled={isSelf}
                                            onSuccess={this.handleSubscribeSuccess}
                                        >
                                            <a
                                                href={null}
                                                styleName={`btn-add-favorite ${detail.subscribed ? 'btn-add-favorite-subscribed' : ''} ${isSelf ? 'btn-add-favorite-dis' : ''}`}
                                            >
                                                <i data-content={detail.subscribedCount ? `(${formatNumber(detail.subscribedCount, 5)})` : '收藏'}/>
                                            </a>
                                        </SubscribePlaylist>
                                        <a
                                            href={null}
                                            styleName="btn-share"
                                        >
                                            <i>{detail.shareCount ? `(${formatNumber(detail.shareCount, 5)})` : '分享'}</i>
                                        </a>
                                        <a href={null} styleName="btn-download"><i>下载</i></a>
                                        <a
                                            href={null}
                                            styleName="btn-comment"
                                            onClick={this.handleComment}>
                                            <i>{detail.commentCount ? `(${detail.commentCount})` : '评论'}</i>
                                        </a>
                                    </div>
                                    <div styleName="desc">
                                        {
                                            Array.isArray(detail.tags) && detail.tags.length ?
                                                <div styleName="tags">
                                                    <b>标签：</b>
                                                    {detail.tags.map((tag) => {
                                                        return <Link to={`/discover/playlist?cat=${tag}&order=hot`} key={tag}
                                                            styleName="tag">{tag}</Link>
                                                    })}
                                                </div>
                                                : null
                                        }
                                        {
                                            detail.description ? <div styleName="description">
                                                <Collapse content={`介绍：${detail.description}`}/>
                                            </div> : null
                                        }
                                    </div>
                                </div>
                            </div>
                            <div styleName="tracks-wrapper">
                                <div styleName="table-title">
                                    <h3>歌曲列表</h3>
                                    <span styleName="other">
                                        <span styleName="total">{detail.songs?.length}首歌</span>
                                        <span styleName="more">播放：<strong styleName="play-count">{detail.playCount}</strong>次</span>
                                        <span styleName="out-chain"><i/><Link to="/">生成外链播放器</Link></span>
                                    </span>
                                </div>
                                <SongTable loading={detailLoading} detail={detail} isSelf={isSelf}/>
                            </div>
                            <Comments
                                onRef={this.setCommentsRef}
                                type="PLAYLIST"
                                id={Number(this.props.match.params.id)}
                            />
                        </div>
                    </div>
                    <div className="right-wrapper">
                        <SubscribedUsers title="喜欢这个歌单的人" list={detail?.subscribers}/>
                        <RelatedPlaylists title="相关推荐" list={related}/>
                        <ClientDownload/>
                    </div>
                </div>
            </Page>
        )
    }
}
