/**
 * 专辑详情页
 */
import { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import dayjs from 'dayjs'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import AddIcon from '@mui/icons-material/Add'
import ShareIcon from '@mui/icons-material/Share'
import ChatIcon from '@mui/icons-material/Chat'
import MusicVideoIcon from '@mui/icons-material/MusicVideo'
import withRouter from 'hoc/withRouter'
import Page from 'components/Page'
import Comments from 'components/business/Comments'
import { DATE_FORMAT, DEFAULT_DOCUMENT_TITLE } from 'constants'
import { PLAY_TYPE } from 'constants/music'
import Add from 'components/business/Add'
import Play from 'components/business/Play'
import AddToPlaylist from 'components/business/AddToPlaylist'
import { requestDetail } from 'services/album'
import { requestAlbum } from 'services/artist'
import { formatDuration, formatNumber, getThumbnail } from 'utils'
import pubsub from 'utils/pubsub'
import Collapse from 'components/Collapse'
import SinglePlay from 'components/business/SinglePlay'
import SongActions from 'components/business/SongActions'
import { getArtists } from 'utils/song'

import styles from './index.scss'

@withRouter
@connect(({ user }) => ({
  isLogin: user.isLogin,
  currentSong: user.player.currentSong
}))
class AlbumDetail extends Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState = () => {
    return {
      detail: {},
      albums: []
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
    const { id } = this.props.params
    if (id) {
      this.fetchDetail(id)
    }
  }

  fetchDetail = async (id) => {
    const res = await requestDetail({ id })
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
    const res = await requestAlbum({ id, limit: 5 })
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

  render() {
    const { currentSong } = this.props
    const { detail, albums } = this.state

    const title = detail
      ? `${detail.name || ''} - 专辑 - ${DEFAULT_DOCUMENT_TITLE}`
      : DEFAULT_DOCUMENT_TITLE

    return (
      <Page title={title}>
        <div className="main">
          <div className="left-wrapper">
            <div className="left">
              <div className="clearfix">
                <div className={styles.cover}>
                  <img src={getThumbnail(detail.picUrl, 640)} alt="封面" />
                </div>
                <div className={styles.content}>
                  <span className={styles.label} />
                  <h2 className={styles.title}>{detail.name}</h2>
                  <div className={styles.publish}>
                    <div>
                      歌手：
                      {Array.isArray(detail.artists) &&
                        detail.artists.map((artist, i) => {
                          return (
                            <span key={artist.id}>
                              <Link
                                to={`/artist/${artist.id}`}
                                className={styles.artist}
                              >
                                {artist.name}
                              </Link>
                              {i !== detail.artists.length - 1 ? '/' : ''}
                            </span>
                          )
                        })}
                    </div>
                    <div>
                      发行时间：{dayjs(detail.publishTime).format(DATE_FORMAT)}
                    </div>
                    <div>发行公司：{detail.company}</div>
                  </div>
                  <div className={styles.operation}>
                    <Play id={detail.id} type={PLAY_TYPE.ALBUM.TYPE}>
                      <a
                        href={null}
                        className={styles['btn-play']}
                        title="播放"
                      >
                        <PlayCircleOutlineIcon />
                        <span>播放</span>
                      </a>
                    </Play>
                    <Add id={detail.id} type={PLAY_TYPE.ALBUM.TYPE}>
                      <a
                        href={null}
                        className={styles['btn-add-play']}
                        title="添加到播放列表"
                      >
                        <AddIcon />
                      </a>
                    </Add>
                    <AddToPlaylist
                      songIds={
                        Array.isArray(detail?.songs)
                          ? detail.songs.map((v) => v.id)
                          : []
                      }
                    >
                      <a href={null} className={styles['action-btn']}>
                        <span
                          data-content={
                            detail.subscribedCount
                              ? `(${formatNumber(detail.subscribedCount)})`
                              : '收藏'
                          }
                        />
                      </a>
                    </AddToPlaylist>
                    <a href={null} className={styles['action-btn']}>
                      <ShareIcon />
                      <span>
                        {detail.info?.shareCount
                          ? `(${formatNumber(detail.info?.shareCount)})`
                          : '分享'}
                      </span>
                    </a>
                    {/*<a href={null} className="btn-download"><i>下载</i></a>*/}
                    <a
                      href={null}
                      className={styles['action-btn']}
                      onClick={this.handleComment}
                    >
                      <ChatIcon />
                      <span>
                        {detail.info?.commentCount
                          ? `(${detail.info?.commentCount})`
                          : '评论'}
                      </span>
                    </a>
                  </div>
                </div>
              </div>
              {detail.description ? (
                <div className={styles.desc}>
                  <h3>专辑介绍：</h3>
                  <div className={styles.description}>
                    <Collapse
                      content={detail.description}
                      maxWordNumber={140}
                    />
                  </div>
                </div>
              ) : null}
              <div className={`clearfix ${styles['tracks-wrapper']}`}>
                <div className={styles['table-title']}>
                  <h3>包含歌曲列表</h3>
                  <span className={styles.other}>
                    <span className={styles.total}>
                      {detail?.songs?.length}首歌
                    </span>
                  </span>
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.w1}>
                        <div className={`${styles.th} ${styles.first}`} />
                      </th>
                      <th>
                        <div className={styles.th}>歌曲标题</div>
                      </th>
                      <th className={styles.w2}>
                        <div className={styles.th}>时长</div>
                      </th>
                      <th className={styles.w3}>
                        <div className={styles.th}>歌手</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(detail.songs) &&
                      detail.songs.map((item, index) => {
                        const order = index + 1
                        const { id, alia: alias } = item
                        const privilege = detail.privileges?.[index]
                        const disabled = privilege?.st === -200
                        return (
                          <tr
                            key={id}
                            className={`${styles.track} ${disabled ? styles.disabled : ''} ${order % 2 ? styles.even : ''}`}
                          >
                            <td className={styles.order}>
                              <span className={styles.number}>{order}</span>
                              <SinglePlay
                                id={id}
                                active={currentSong?.id === id}
                                disabled={disabled}
                              />
                            </td>
                            <td>
                              <div className={styles.name}>
                                <Link to={`/song/${id}`}>{item.name}</Link>
                                {alias && alias.length ? (
                                  <span
                                    className={styles.alias}
                                    title={alias.join('、')}
                                  >
                                    {' '}
                                    - ({alias.join('、')})
                                  </span>
                                ) : (
                                  ''
                                )}
                                {item.mv ? (
                                  <Link to={`/mv/${item.mv}`}>
                                    <MusicVideoIcon
                                      className={styles['mv-icon']}
                                    />
                                  </Link>
                                ) : null}
                              </div>
                            </td>
                            <td>
                              <div className={styles.duration}>
                                <span className={styles.time}>
                                  {formatDuration(item.dt)}
                                </span>
                                <div className={styles.actions}>
                                  <SongActions id={item.id} />
                                </div>
                              </div>
                            </td>
                            <td className={styles.artists}>
                              {Array.isArray(item.ar) &&
                                item.ar.map((artist, i) => {
                                  return (
                                    <span
                                      key={artist.id}
                                      title={getArtists(item.ar)}
                                    >
                                      <Link
                                        to={`/artist/${artist.id}`}
                                        onClick={this.closePanel}
                                      >
                                        {artist.name}
                                      </Link>
                                      {i !== item.ar.length - 1 ? '/' : ''}
                                    </span>
                                  )
                                })}
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
              <Comments
                onRef={this.setCommentsRef}
                type="ALBUM"
                id={Number(this.props.params.id)}
              />
            </div>
          </div>
          <div className="right-wrapper">
            {/* todo 喜欢这张专辑的人 */}
            <div className={styles['other-albums']}>
              <h3 className={styles['album-title']}>Ta的其他热门专辑</h3>
              <ul>
                {albums.map((item) => {
                  const albumLink = `/album/${item.id}`
                  return (
                    <li key={item.id} className={styles['album-item']}>
                      <Link
                        to={albumLink}
                        title={item.name}
                        className={styles['album-cover']}
                      >
                        <img src={getThumbnail(item.picUrl, 120)} alt="cover" />
                      </Link>
                      <div className={styles['album-meta']}>
                        <p className={styles['album-name']}>
                          <Link to={albumLink} title={item.name}>
                            {item.name}
                          </Link>
                        </p>
                        <p className={styles['album-time']}>
                          {dayjs(item.publishTime).format(DATE_FORMAT)}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </Page>
    )
  }
}

export default AlbumDetail
