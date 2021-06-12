/**
 * 专辑详情页
 */
import React from 'react'
import {withRouter, Link} from 'react-router-dom'
import {connect} from 'react-redux'
import dayjs from 'dayjs'
import Page from 'components/Page'
import Comments from 'components/Comments'
import {DATE_FORMAT, DEFAULT_DOCUMENT_TITLE} from 'constants'
import {PLAY_TYPE} from 'constants/play'
import Add from 'components/Add'
import Play from 'components/Play'
import AddToPlaylist from 'components/AddToPlaylist'
import {requestDetail} from 'services/album'
import {requestAlbum} from 'services/artist'
import {formatDuration, formatNumber, getThumbnail} from 'utils'
import emitter from 'utils/eventEmitter'
import Collapse from 'components/Collapse'
import SongActions from 'components/SongActions'
import ClientDownload from 'components/ClientDownload'
import {getArtists} from 'utils/song'

import './index.scss'
import SinglePlay from "components/SinglePlay";

@withRouter
@connect(({user}) => ({
    isLogin: user.isLogin,
    currentSong: user.player.currentSong
}))
export default class AlbumDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = this.getInitialState()
    }

    getInitialState = () => {
        return {
            detail: {},
            albums: [],
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
        }
    }

    fetchDetail = async (id) => {
        const res = await requestDetail({id})
        if (this._isMounted) {
            const album = res?.album
            this.setState({
                detail: {
                    ...album,
                    songs: res?.songs || []
                }
            })
            const artist = album.artists[0]
            if (artist.id) {
                this.fetchAlbum(artist.id)
            }
        }
    }

    fetchAlbum = async (id) => {
        const res = await requestAlbum({id, limit: 5})
        if (this._isMounted) {
            this.setState({
                albums: res.hotAlbums || []
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
        const {currentSong} = this.props
        const {detail, albums} = this.state

        const title = detail ? `${detail.name || ''} - 专辑 - ${DEFAULT_DOCUMENT_TITLE}` : DEFAULT_DOCUMENT_TITLE

        return (
            <Page title={title}>
                <div className="main">
                    <div className="left-wrapper">
                        <div className="left">
                            <div className="clearfix">
                                <div styleName="cover">
                                    <img
                                        src={getThumbnail(detail.picUrl, 200)}
                                        alt="封面"
                                    />
                                </div>
                                <div styleName="content">
                                    <span styleName="label"/>
                                    <h2 styleName="title">{detail.name}</h2>
                                    <div styleName="publish">
                                        <div>
                                            歌手：{
                                            Array.isArray(detail.artists) && detail.artists.map((artist, i) => {
                                                return <span key={artist.id}>
                                                        <Link to={`/artist/${artist.id}`}
                                                              styleName="artist">{artist.name}</Link>
                                                    {i !== detail.artists.length - 1 ? '/' : ''}
                                                    </span>
                                            })
                                        }
                                        </div>
                                        <div>发行时间：{dayjs(detail.publishTime).format(DATE_FORMAT)}</div>
                                        <div>发行公司：{detail.company}</div>
                                    </div>
                                    <div styleName="operation">
                                        <Play id={detail.id} type={PLAY_TYPE.ALBUM.TYPE}>
                                            <a href={null} styleName="btn-play" title="播放"><i><em/>播放</i></a>
                                        </Play>
                                        <Add id={detail.id} type={PLAY_TYPE.ALBUM.TYPE}>
                                            <a href={null} styleName="btn-add-play" title="添加到播放列表"/>
                                        </Add>
                                        <AddToPlaylist
                                            songIds={Array.isArray(detail?.songs) ? detail.songs.map(v => v.id) : []}>
                                            <a
                                                href={null}
                                                styleName="btn-add-favorite"
                                            >
                                                <i>{detail.subscribedCount ? `(${formatNumber(detail.subscribedCount, 5)})` : '收藏'}</i>
                                            </a>
                                        </AddToPlaylist>
                                        <a
                                            href={null}
                                            styleName="btn-share"
                                        >
                                            <i>{detail.info?.shareCount ? `(${formatNumber(detail.info?.shareCount, 5)})` : '分享'}</i>
                                        </a>
                                        <a href={null} styleName="btn-download"><i>下载</i></a>
                                        <a
                                            href={null}
                                            styleName="btn-comment"
                                            onClick={this.handleComment}
                                        >
                                            <i>{detail.info?.commentCount ? `(${detail.info?.commentCount})` : '评论'}</i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            {
                                detail.description ? <div styleName="desc">
                                    <h3>专辑介绍：</h3>
                                    <div styleName="description">
                                        <Collapse content={detail.description} maxWordNumber={140}/>
                                    </div>
                                </div> : null
                            }
                            <div styleName="tracks-wrapper" className="clearfix">
                                <div styleName="table-title">
                                    <h3>包含歌曲列表</h3>
                                    <span styleName="other">
                                        <span styleName="total">{detail?.songs?.length}首歌</span>
                                        <span styleName="out-chain"><i/><a href={null}>生成外链播放器</a></span>
                                    </span>
                                </div>
                                <table styleName="table">
                                    <thead>
                                    <tr>
                                        <th styleName="w1">
                                            <div styleName="th first"/>
                                        </th>
                                        <th>
                                            <div styleName="th">歌曲标题</div>
                                        </th>
                                        <th styleName="w2">
                                            <div styleName="th">时长</div>
                                        </th>
                                        <th styleName="w3">
                                            <div styleName="th">歌手</div>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        Array.isArray(detail.songs) && detail.songs.map((item, index) => {
                                            const order = index + 1
                                            const {id, alia: alias} = item
                                            const privilege = detail.privileges?.[index]
                                            const disabled = privilege?.st === -200
                                            return <tr key={id}
                                                       styleName={`track${disabled ? ' disabled' : ''} ${order % 2 ? ' even' : ''}`}>
                                                <td styleName="order">
                                                    <span styleName="number">{order}</span>
                                                    <span styleName="play">
                                                            <SinglePlay
                                                                id={id}
                                                                active={currentSong?.id === id}
                                                                disabled={disabled}
                                                            />
                                                        </span>
                                                </td>
                                                <td>
                                                    <div styleName="name">
                                                        <Link to={`/song/${id}`}>{item.name}</Link>
                                                        {alias && alias.length ? <span styleName="alias"
                                                                                       title={alias.join('、')}> - ({alias.join('、')})</span> : ''}
                                                        {item.mv ?
                                                            <Link to={`/mv/${item.mv}`} styleName="mv-icon"/> : null}
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
                                            </tr>
                                        })
                                    }
                                    </tbody>
                                </table>
                            </div>
                            }
                            <Comments
                                onRef={this.setCommentsRef}
                                type="ALBUM"
                                id={Number(this.props.match.params.id)}
                            />
                        </div>
                    </div>
                    <div className="right-wrapper">
                        {/* todo 喜欢这张专辑的人 */}
                        <div styleName="other-albums">
                            <h3 styleName="album-title">他的其他热门专辑</h3>
                            <ul>
                                {
                                    albums.map((item) => {
                                        const albumLink = `/album/${item.id}`
                                        return <li key={item.id} styleName="album-item">
                                            <Link to={albumLink} title={item.name} styleName="album-cover">
                                                <img src={item.picUrl} alt="cover"/>
                                            </Link>
                                            <div styleName="album-meta">
                                                <p styleName="album-name"><Link to={albumLink}
                                                                                title={item.name}>{item.name}</Link></p>
                                                <p styleName="album-time">{dayjs(item.publishTime).format(DATE_FORMAT)}</p>
                                            </div>
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                        <ClientDownload/>
                    </div>
                </div>
            </Page>
        )
    }
}
