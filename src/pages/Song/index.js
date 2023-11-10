/**
 * 歌曲详情页
 */
import {Component} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import PlayCircleOutlineIcon  from '@mui/icons-material/PlayCircleOutline'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import AddIcon from '@mui/icons-material/Add'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import ShareIcon from '@mui/icons-material/Share'
import ChatIcon from '@mui/icons-material/Chat'
import MusicVideoIcon from '@mui/icons-material/MusicVideo'
import withRouter from 'hoc/withRouter'
import Page from 'components/Page'
import {DEFAULT_DOCUMENT_TITLE} from 'constants'
import {FEE_TYPE, PLAY_TYPE} from 'constants/music'
import Add from 'components/business/Add'
import Play from 'components/business/Play'
import Comments from 'components/business/Comments'
import RelatedPlaylists from 'components/business/RelatedPlaylists'
import AddToPlaylist from 'components/business/AddToPlaylist'
import {requestDetail, requestLyric, requestSimilar as requestSimilarSongs} from 'services/song'
import {requestSimilar as requestSimilarPlaylists} from 'services/playlist'
import {getThumbnail} from 'utils'
import pubsub from 'utils/pubsub'
import {getArtists, getLyric, renderArtists} from 'utils/song'

import './index.scss'

const DEFAULT_SECOND = -1
const DEFAULT_LYRIC_LINES = 13

@withRouter
@connect(({user}) => ({
    isLogin: user.isLogin,
}))
export default class Song extends Component {
    constructor(props) {
        super(props)
        this.state = this.getInitialState()
        this.formattedLyric = null
    }

    getInitialState = () => {
        return {
            detail: null,
            lyric: null,
            similarPlaylists: [],
            similarSongs: [],
            isLyricFolding: true,
            totalComment: 0,
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.fetchData()
    }

    componentDidUpdate(prevProps) {
        if (this.props.params.id !== prevProps.params.id) {
            this.setState(this.getInitialState())
            this.fetchData()
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    fetchData = () => {
        const {id} = this.props.params
        if (id) {
            this.fetchDetail(id)
            this.fetchLyric(id)
            this.fetchSimilarPlaylists(id)
            this.fetchSimilarSongs(id)
        }
    }

    fetchDetail = async (id) => {
        const res = await requestDetail({ids: id})
        if (this._isMounted) {
            this.setState({
                detail: {
                    ...res?.songs?.[0],
                    privilege: res?.privileges?.[0]
                }
            })
        }
    }

    fetchLyric = async (id) => {
        const res = await requestLyric({id: id})
        if (this._isMounted) {
            this.setState({
                lyric: res
            })
            this.formattedLyric = null
        }
    }

    fetchSimilarPlaylists = async (id) => {
        const res = await requestSimilarPlaylists({id: id})
        if (this._isMounted) {
            this.setState({
                similarPlaylists: res.playlists || []
            })
        }
    }

    fetchSimilarSongs = async (id) => {
        const res = await requestSimilarSongs({id: id})
        if (this._isMounted) {
            this.setState({
                similarSongs: res.songs || []
            })
        }
    }

    ctrlFold = () => {
        this.setState((prevState) => {
            return {isLyricFolding: !prevState.isLyricFolding}
        })
    }

    getRenderLyric = (lyric) => {
        if (lyric && Object.keys(lyric).length) {
            const {nolyric, tlyric = {}, lrc = {}} = lyric
            if (nolyric) {
                return <div styleName="no-lyric">纯音乐，无歌词</div>
            }
            if (!tlyric.lyric && !lrc.lyric) {
                return <div styleName="no-lyric">
                    <span>暂时没有歌词 </span>
                    <a href={null}>求歌词</a>
                </div>
            }
            return this.getLyricElement(lyric)
        }
        return ''
    }

    getLyricElement = (lyric) => {
        let lyricElement = []
        if(!this.formattedLyric) {
            this.formattedLyric = getLyric(lyric)
        }
        const convertedLyric = this.formattedLyric
        convertedLyric.forEach((item, index) => {
            const {origin, transform} = item
            let innerTime = origin.second
            let originLyrics = origin.lyrics

            if (transform) {
                let transformLyrics = transform.lyrics
                originLyrics.forEach((v, i) => {
                    let innerText = ''
                    if (transformLyrics[i]) {
                        innerText = `${v}<br/>${transformLyrics[i]}`
                    } else {
                        innerText = v
                    }
                    lyricElement.push(
                        <p key={`${innerTime}-${index}-${i}`} dangerouslySetInnerHTML={{__html: innerText}}/>
                    )
                })

            } else {
                originLyrics.forEach((v, i) => {
                    if (innerTime !== DEFAULT_SECOND || v) {
                        lyricElement.push(
                            <p key={`${innerTime}-${index}-${i}`}>
                                {v}
                            </p>
                        )
                    }
                })
            }
        })
        return lyricElement
    }

    setTotalComment = (total) => {
        this.setState({totalComment: total})
    }

    setCommentsRef = (ref) => {
        this.commentsRef = ref
    }

    validateLogin = () => {
        const {isLogin} = this.props
        if (isLogin) {
            return true
        }
        pubsub.publish('login')
        return false
    }

    handleComment = () => {
        if (this.validateLogin()) {
            this.commentsRef.focusEditor()
        }
    }

    render() {
        const {detail, lyric, isLyricFolding, similarPlaylists, similarSongs, totalComment} = this.state
        const lyricElement = this.getRenderLyric(lyric)
        const isVip = detail?.fee === FEE_TYPE.VIP
        const hasCopyright = detail?.privilege?.st === 0

        const alias = detail?.alia && detail.alia.length ? detail?.alia.map((v, i)=> `${v}${i !== detail?.alia.length - 1 ? '、' : ''}`) : ''

        const name = `${detail?.name || ''}${alias ? `（${alias}）` : ''}`

        const title = detail ? `${name} - ${getArtists(detail?.ar)} - 单曲 - ${DEFAULT_DOCUMENT_TITLE}` : DEFAULT_DOCUMENT_TITLE

        return (
            <Page title={title}>
                <div className="main">
                    <div className="left-wrapper">
                        <div className="left">
                            <div styleName="info">
                                <div styleName="cover-wrapper">
                                    <div styleName="cover">
                                        <img
                                            src={getThumbnail(detail?.al?.picUrl)}
                                            alt="封面"
                                        />
                                    </div>
                                </div>
                                <div styleName="content">
                                    {isVip ? <span styleName="vip-label">VIP单曲</span> : <span styleName="label"/>}
                                    <div styleName={`title${isVip ? ' vip-title' : ''}`}>
                                        <span>{detail?.name}</span>
                                        {detail?.mv ? <Link to={`/mv/${detail?.mv}`} title="播放mv">
                                            <MusicVideoIcon styleName="mv-icon" />
                                        </Link> : null}
                                        {detail?.alia && detail.alia.length ? <div styleName="alias">
                                            {alias}
                                        </div> : null}
                                    </div>
                                    <div styleName="desc">
                                        歌手：
                                        <span>
                                            {renderArtists(detail?.ar)}
                                        </span>
                                    </div>
                                    <div styleName="desc">
                                        所属专辑：<Link to={`/album/${detail?.al?.id}`} href={null} title={detail?.al?.name}>{detail?.al?.name}</Link>
                                    </div>
                                    <div styleName="operation">
                                        {
                                            isVip && detail?.privilege?.payed === 0
                                                ? <a
                                                    href={null}
                                                    hidefocus="true"
                                                    title="播放"
                                                    styleName="vip-play"
                                                >
                                                    <PlayCircleOutlineIcon/>
                                                    <span>开通VIP畅听</span>
                                                </a>
                                                : (hasCopyright ? <>
                                                    <Play id={detail?.id} type={PLAY_TYPE.SINGLE.TYPE}>
                                                        <a href={null} styleName="btn-play" title="播放">
                                                            <PlayCircleOutlineIcon/>
                                                            <span>播放</span>
                                                        </a>
                                                    </Play>
                                                    <Add id={detail?.id} type={PLAY_TYPE.SINGLE.TYPE}>
                                                        <a href={null} styleName="btn-add-play" title="添加到播放列表">
                                                            <AddIcon/>
                                                        </a>
                                                    </Add>
                                                </> : <a href={null} styleName="btn-play-disabled" title="播放">
                                                    <span>播放</span>
                                                </a>)
                                        }
                                        <AddToPlaylist songIds={detail?.id ? [detail.id] : []}>
                                            <a href={null} styleName="action-btn">
                                                <LibraryAddIcon/>
                                                <span>收藏</span>
                                            </a>
                                        </AddToPlaylist>
                                        <a href={null} styleName="action-btn">
                                            <ShareIcon/>
                                            <span>分享</span>
                                        </a>
                                        {/*<a href={null} styleName={`btn-download${isVip ? ' btn-vip-download': ''}`}><i>下载</i></a>*/}
                                        <a href={null} styleName="action-btn" onClick={this.handleComment}>
                                            <ChatIcon/>
                                            <span>{totalComment ? `(${totalComment})` : '评论'}</span>
                                        </a>
                                    </div>
                                    <div styleName="lyric-wrapper">
                                        <div styleName={`lyric ${isLyricFolding ? 'fold' : 'unfold'}`}>
                                            {lyricElement}
                                        </div>
                                        {
                                            Array.isArray(lyricElement) && lyricElement.length > DEFAULT_LYRIC_LINES
                                                ? <>
                                                    <div href={null} styleName="fold-ctrl" onClick={this.ctrlFold}>
                                                        {isLyricFolding ? '展开' : '收起'}<i/>
                                                    </div>
                                                    <div styleName="lyric-user">
                                                        {
                                                            lyric.lyricUser || lyric.transUser ? <div styleName="lyric-user-info">
                                                                {
                                                                    lyric.lyricUser
                                                                        ? <>贡献歌词：<Link to={`/user/home/${lyric?.lyricUser?.userid}`}>{lyric?.lyricUser?.nickname}</Link></>
                                                                        : null
                                                                }
                                                                {lyric.lyricUser && lyric.transUser ? <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</> : ''}
                                                                {
                                                                    lyric.transUser ?
                                                                        <>贡献翻译：<Link to={`/user/home/${lyric?.transUser?.userid}`}>{lyric?.transUser?.nickname}</Link></>
                                                                        : null
                                                                }
                                                            </div> : null
                                                        }
                                                    </div>
                                                </>
                                                : null
                                        }
                                    </div>
                                </div>
                            </div>
                            <Comments onRef={this.setCommentsRef} id={Number(this.props.params.id)} setTotalComment={this.setTotalComment}/>
                        </div>
                    </div>
                    <div className="right-wrapper">
                        <RelatedPlaylists title="包含这首歌的歌单" list={similarPlaylists}/>
                        {
                            similarSongs.length ? <div styleName="songs">
                                <h3 styleName="title-underline">相似歌曲</h3>
                                <ul>
                                    {
                                        similarSongs.map((item) => {
                                            return <li key={item.id}>
                                                <div styleName="text">
                                                    <p><Link to={`/song/${item.id}`} title={item.name}>{item.name}</Link></p>
                                                    <div styleName="singer" title={getArtists(item.artists)}>
                                                        {
                                                            item.artists.map((artist, i) => {
                                                                return <span key={artist.id}><Link
                                                                    to={`/artist/${artist.id}`}>{artist.name}</Link>{i !== item.artists.length - 1 ? '/' : ''}</span>
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                                <div styleName="oper">
                                                    <Play id={item.id} type={PLAY_TYPE.SINGLE.TYPE}>
                                                        <PlayArrowIcon styleName="icon play-icon" href={null}/>
                                                    </Play>
                                                    <Add id={item.id} type={PLAY_TYPE.SINGLE.TYPE}>
                                                        <AddIcon styleName="icon" href={null}/>
                                                    </Add>
                                                </div>
                                            </li>
                                        })
                                    }
                                </ul>
                            </div> : null
                        }
                    </div>
                </div>
            </Page>
        )
    }
}
