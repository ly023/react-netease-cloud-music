/**
 * 歌单详情
 */
import { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import dayjs from 'dayjs'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import AddIcon from '@mui/icons-material/Add'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck'
import ShareIcon from '@mui/icons-material/Share'
import ChatIcon from '@mui/icons-material/Chat'
import Comments from 'components/business/Comments'
import { DATE_FORMAT, PLAYLIST_COLLECTION_TYPE } from 'constants'
import { PLAY_TYPE } from 'constants/music'
import Add from 'components/business/Add'
import Play from 'components/business/Play'
import Collapse from 'components/Collapse'
import SongTable from 'components/business/SongTable'
import SubscribePlaylist from 'components/business/SubscribePlaylist'
import { requestDetail } from 'services/playlist'
import { requestDetail as requestSongDetail } from 'services/song'
import { formatNumber, getThumbnail } from 'utils'
import pubsub from 'utils/pubsub'

import styles from './index.scss'

@connect(({ user }) => ({
  isLogin: user.isLogin,
  userInfo: user.userInfo
}))
export default class PlaylistDetail extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState = () => {
    return {
      detailLoading: false,
      detail: {}
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
    const { id } = this.props
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
      this.setState({ detailLoading: true })
      const res = await requestDetail({ id })
      if (this._isMounted) {
        const playlist = res?.playlist || {}
        // 接口拿到的tracks不完整，但trackIds是完整的，用trackIds再请求剩余的song/detail
        const { tracks, trackIds } = playlist
        let songs = tracks
        let privileges = res?.privileges || []
        // 如果没有返回完整的歌曲列表信息
        if (tracks.length !== trackIds.length) {
          const restTrackIds = trackIds.slice(tracks.length).map((v) => v.id) // 剩余的trackIds
          const songDetailRes = await requestSongDetail({
            ids: restTrackIds.join(',')
          })
          const { songs: restSongs, privileges: restPrivileges } = songDetailRes
          songs = songs.concat(restSongs)
          privileges = privileges.concat(restPrivileges)
        }
        const detail = {
          ...playlist,
          tracks: [],
          songs: this.parseTracks(songs, privileges)
        }
        this.setState({ detail })
        const { afterDetailLoaded } = this.props
        afterDetailLoaded && afterDetailLoaded(detail)
      }
    } catch (e) {
      console.log(e)
    } finally {
      if (this._isMounted) {
        this.setState({ detailLoading: false })
      }
    }
  }

  setCommentsRef = (ref) => {
    this.commentsRef = ref
  }

  validateLogin = () => {
    const { isLogin } = this.props
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

  handleSubscribeSuccess = () => {
    this.setState((prevState) => {
      return {
        detail: {
          ...prevState.detail,
          subscribed: !prevState.detail.subscribed
        }
      }
    })
  }

  render() {
    const { userInfo } = this.props
    const { detailLoading, detail } = this.state

    const isSelf = detail?.creator?.userId === userInfo?.userId

    return (
      <>
        <div className={`clearfix ${styles.info}`}>
          <div className={styles.cover}>
            <img src={getThumbnail(detail.coverImgUrl)} alt="封面" />
          </div>
          <div className={styles.content}>
            <span className={styles.label} />
            <h2 className={styles.title}>{detail.name}</h2>
            <div className={styles.creator}>
              <Link
                to={`/user/home/${detail.creator?.userId}`}
                className={styles.avatar}
              >
                <img
                  src={getThumbnail(detail.creator?.avatarUrl, 120)}
                  alt=""
                />
              </Link>
              <Link
                to={`/user/home/${detail.creator?.userId}`}
                className={styles.nickname}
              >
                {detail.creator?.nickname}
              </Link>
              <span className={styles.time}>
                {dayjs(detail.createTime).format(DATE_FORMAT)} 创建
              </span>
            </div>
            <div className={styles.operation}>
              <Play id={detail.id} type={PLAY_TYPE.PLAYLIST.TYPE}>
                <a href={null} className={styles['btn-play']} title="播放">
                  <PlayCircleOutlineIcon />
                  <span>播放</span>
                </a>
              </Play>
              <Add id={detail.id} type={PLAY_TYPE.PLAYLIST.TYPE}>
                <a
                  href={null}
                  className={styles['btn-add-play']}
                  title="添加到播放列表"
                >
                  <AddIcon />
                </a>
              </Add>
              <SubscribePlaylist
                id={detail.id}
                type={
                  detail.subscribed
                    ? PLAYLIST_COLLECTION_TYPE.OK
                    : PLAYLIST_COLLECTION_TYPE.CANCEL
                }
                disabled={isSelf}
                onSuccess={this.handleSubscribeSuccess}
              >
                <a
                  href={null}
                  className={`${styles['action-btn']} ${isSelf ? styles['btn-add-favorite-dis'] : ''}`}
                >
                  {detail.subscribed ? (
                    <LibraryAddCheckIcon />
                  ) : (
                    <LibraryAddIcon />
                  )}
                  <span
                    data-content={
                      detail.subscribedCount
                        ? `(${formatNumber(detail.subscribedCount)})`
                        : '收藏'
                    }
                  />
                </a>
              </SubscribePlaylist>
              <a href={null} className={styles['action-btn']}>
                <ShareIcon />
                <span>分享</span>
              </a>
              {/*<a href={null} className="btn-download"><i>下载</i></a>*/}
              <a
                href={null}
                className={styles['action-btn']}
                onClick={this.handleComment}
              >
                <ChatIcon />
                <span>
                  {detail?.commentCount || 0
                    ? `(${detail?.commentCount || 0})`
                    : '评论'}
                </span>
              </a>
            </div>
            <div className={styles.desc}>
              {Array.isArray(detail.tags) && detail.tags.length ? (
                <div className={styles.tags}>
                  <b>标签：</b>
                  {detail.tags.map((tag) => {
                    return (
                      <Link
                        to={`/discover/playlist?cat=${tag}&order=hot`}
                        key={tag}
                        className={styles.tag}
                      >
                        {tag}
                      </Link>
                    )
                  })}
                </div>
              ) : null}
              {detail.description ? (
                <div className={styles.description}>
                  <Collapse content={`介绍：${detail.description}`} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className={styles['tracks-wrapper']}>
          <div className={styles['table-title']}>
            <h3>歌曲列表</h3>
            <span className={styles.other}>
              <span className={styles.total}>
                {detail.trackIds?.length}首歌
              </span>
              <span className={styles.more}>
                播放：
                <strong className={styles['play-count']}>
                  {detail.playCount}
                </strong>
                次
              </span>
            </span>
          </div>
          <SongTable
            loading={detailLoading}
            songs={detail?.songs || []}
            isSelf={isSelf}
          />
        </div>
        <Comments
          type="PLAYLIST"
          id={this.props.id}
          onRef={this.setCommentsRef}
        />
      </>
    )
  }
}
