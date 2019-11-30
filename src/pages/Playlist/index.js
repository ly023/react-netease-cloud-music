/**
 * 歌单详情页
 */
import React from 'react'
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'
import moment from 'moment'
moment.locale('zh-cn')
import Page from 'components/Page'
import Comments from 'components/Comments'
import {DATE_FORMAT, DEFAULT_DOCUMENT_TITLE} from 'constants'
import {PLAY_TYPE} from 'constants/play'
import Add from 'components/Add'
import Play from 'components/Play'
import {requestDetail, requestRelated} from 'services/playlist'
import {formatDuration, formatNumber, getThumbnail} from 'utils'
import emitter from 'utils/eventEmitter'
import Collapse from 'components/Collapse'
import SubscribedUsers from 'components/SubscribedUsers'
import RelatedPlaylists from 'components/RelatedPlaylists'
import ClientDownload from 'components/ClientDownload'
import SongActions from 'components/SongActions'
import {getArtists} from 'utils/song'

import './index.scss'

@withRouter
@connect(({user}) => ({
    isLogin: user.isLogin,
}))
export default class Playlist extends React.Component {
    constructor(props) {
        super(props)
        this.state = this.getInitialState()
    }

    getInitialState = () => {
        return {
            detail: null,
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

    fetchDetail = async (id) => {
        const res = await requestDetail({id})
        if (this._isMounted) {
            this.setState({
                detail: {
                    ...res?.playlist,
                    privileges: res?.privileges
                }
            })
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

    render() {
        const {detail, related} = this.state

        const title = detail ? `${detail?.name || ''} - 歌单 - ${DEFAULT_DOCUMENT_TITLE}` : DEFAULT_DOCUMENT_TITLE

        return (
            <Page title={title}>
                <div className="main">
                    <div className="left-wrapper">
                        <div className="left">
                            {
                                detail ? <>
                                    <div className="clearfix">
                                        <div styleName="cover">
                                            <img
                                                src={getThumbnail(detail?.coverImgUrl, 200)}
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
                                                    styleName="time">{moment(detail.createTime).format(DATE_FORMAT)} 创建</span>
                                            </div>
                                            <div styleName="operation">
                                                <Play id={detail.id} type={PLAY_TYPE.PLAYLIST.TYPE}>
                                                    <a href={null} styleName="btn-play" title="播放"><i><em/>播放</i></a>
                                                </Play>
                                                <Add id={detail.id} type={PLAY_TYPE.PLAYLIST.TYPE}>
                                                    <a href={null} styleName="btn-add-play" title="添加到播放列表"/>
                                                </Add>
                                                <a
                                                    href={null}
                                                    styleName="btn-add-favorite"
                                                >
                                                    <i>{detail.subscribedCount ? `(${formatNumber(detail.subscribedCount, 5)})` : '收藏'}</i>
                                                </a>
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


                                                                return <Link to="/" key={tag}
                                                                    styleName="tag">{tag}</Link>
                                                            })}
                                                        </div>
                                                        : null
                                                }
                                                {
                                                    detail.description ? <div styleName="description">
                                                        <Collapse content={`描述：${detail.description}`}/>
                                                    </div> : null
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div styleName="tracks-wrapper" className="clearfix">
                                        <div styleName="table-title">
                                            <h3>歌曲列表</h3>
                                            <span styleName="other">
                                                <span styleName="total">{detail.tracks.length}首歌</span>
                                                <span styleName="more">播放：<strong
                                                    styleName="play-count">{detail.playCount}</strong>次</span>
                                                <span styleName="out-chain"><i/><Link to="/">生成外链播放器</Link></span>
                                            </span>
                                        </div>
                                        <table styleName="table">
                                            <thead>
                                                <tr>
                                                    <th styleName="w1"><div styleName="th first"/></th>
                                                    <th styleName="w2"><div styleName="th">歌曲标题</div></th>
                                                    <th styleName="w3"><div styleName="th">时长</div></th>
                                                    <th styleName="w4"><div styleName="th">歌手</div></th>
                                                    <th styleName="w5"><div styleName="th">专辑</div></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    detail.tracks.map((item, index) => {
                                                        const order = index + 1
                                                        const {alia: alias} = item
                                                        const privilege = detail.privileges?.[index]
                                                        return <tr key={item.id}
                                                            styleName={`track${privilege?.st === -200 ? ' disabled' : ''} ${order % 2 ? ' even' : ''}`}>
                                                            <td styleName="order">
                                                                <span styleName="number">{order}</span>
                                                                <Play id={item.id} type={PLAY_TYPE.SINGLE.TYPE}>
                                                                    <span styleName="ply"/>
                                                                </Play>
                                                            </td>
                                                            <td>
                                                                <div styleName="name">
                                                                    <Link to={`/song/${item.id}`}>{item.name}</Link>
                                                                    {
                                                                        alias && alias.length
                                                                            ?
                                                                            <span styleName="alias" title={alias.join('、')}> - ({alias.join('、')})</span>
                                                                            : ''
                                                                    }
                                                                    {item.mv ? <Link to={`/mv/${item.mv}`} styleName="mv-icon"/> : null}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div styleName="duration">
                                                                    <span styleName="time">{formatDuration(item.dt)}</span>
                                                                    <div styleName="actions">
                                                                        <SongActions id={item.id}/>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td styleName="artists">
                                                                {
                                                                    Array.isArray(item.ar) && item.ar.map((artist, i) => {
                                                                        return <span key={artist.id}
                                                                            title={getArtists(item.ar)}>
                                                                            <Link to={`/artist/${artist.id}`}
                                                                                onClick={this.closePanel}>{artist.name}</Link>
                                                                            {i !== item.ar.length - 1 ? '/' : ''}
                                                                        </span>
                                                                    })
                                                                }
                                                            </td>
                                                            <td styleName="album">
                                                                <Link to={`/artist/${item.al?.id}`}>{item.al?.name}</Link>
                                                            </td>
                                                        </tr>
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </> : null
                            }
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
