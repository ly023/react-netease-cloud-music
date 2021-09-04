/**
 * 歌单详情
 */
import {Component} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import dayjs from 'dayjs'
import Comments from 'components/Comments'
import {DATE_FORMAT, PLAYLIST_COLLECTION_TYPE} from 'constants'
import {PLAY_TYPE} from 'constants/music'
import Add from 'components/Add'
import Play from 'components/Play'
import {requestDetail} from 'services/playlist'
import {formatNumber, getThumbnail} from 'utils'
import emitter from 'utils/eventEmitter'
import Collapse from 'components/Collapse'
import SongTable from 'components/SongTable'
import SubscribePlaylist from 'components/SubscribePlaylist'

import './index.scss'

@connect(({user}) => ({
    isLogin: user.isLogin,
    userInfo: user.userInfo,
}))
export default class PlaylistDetail extends Component {
    constructor(props) {
        super(props)
        this.state = this.getInitialState()
    }

    getInitialState = () => {
        return {
            detailLoading: false,
            detail: {},
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.fetchData()
    }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            this.setState(this.getInitialState())
            this.fetchData()
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    fetchData = () => {
        const {id} = this.props
        if (id && !Number.isNaN(id)) {
            this.fetchDetail(id)
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
                const {afterDetailLoaded} = this.props
                afterDetailLoaded && afterDetailLoaded(detail)
            }
        } catch (e) {
            
        } finally {
            if(this._isMounted) {
                this.setState({detailLoading: false})
            }
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
        const {detailLoading, detail} = this.state

        const isSelf = detail?.creator?.userId === userInfo?.userId

        return (
            <>
                <div className="clearfix" styleName="info">
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
                            <Link to={`/user/home/${detail.creator?.userId}`} styleName="avatar">
                                <img src={getThumbnail(detail.creator?.avatarUrl, 120)} alt=""/>
                            </Link>
                            <Link to={`/user/home/${detail.creator?.userId}`}
                                  styleName="nickname">{detail.creator?.nickname}</Link>
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
                                    <i data-content={detail.subscribedCount ? `(${formatNumber(detail.subscribedCount)})` : '收藏'}/>
                                </a>
                            </SubscribePlaylist>
                            <a
                                href={null}
                                styleName="btn-share"
                            >
                                <i>{detail.shareCount ? `(${formatNumber(detail.shareCount)})` : '分享'}</i>
                            </a>
                            <a href={null} styleName="btn-download"><i>下载</i></a>
                            <a
                                href={null}
                                styleName="btn-comment"
                                onClick={this.handleComment}>
                                <i>({detail?.commentCount || 0})</i>
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
                            <span styleName="total">{detail.trackIds?.length}首歌</span>
                            <span styleName="more">播放：<strong styleName="play-count">{detail.playCount}</strong>次</span>
                        </span>
                    </div>
                    <SongTable loading={detailLoading} songs={detail?.songs || []} isSelf={isSelf}/>
                </div>
                <Comments
                    onRef={this.setCommentsRef}
                    type="PLAYLIST"
                    id={this.props.id}
                />
            </>
        )
    }
}
