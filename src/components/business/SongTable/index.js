import { useCallback, useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import MusicVideoIcon from '@mui/icons-material/MusicVideo'
import ListLoading from 'components/ListLoading'
import Empty from 'components/Empty'
import SinglePlay from 'components/business/SinglePlay'
import SongActions from 'components/business/SongActions'
import { formatDuration } from 'utils'
import { getArtists } from 'utils/song'
import useShallowEqualSelector from 'hook/useShallowEqualSelector'

import styles from './index.scss'

function SongTable(props) {
  const {
    loading = false,
    songs = [],
    isSelf = false,
    showDislike = false,
    onDislikeSuccess
  } = props
  const { currentSong = {} } = useShallowEqualSelector(({ user }) => ({
    currentSong: user.player.currentSong
  }))

  const handleDislike = useCallback(
    (id) => {
      // todo 歌曲不感兴趣
      onDislikeSuccess && onDislikeSuccess(songs.filter((v) => v.id !== id))
    },
    [songs, onDislikeSuccess]
  )

  const renderTip = useMemo(() => {
    if (loading) {
      return <ListLoading />
    }
    if (songs?.length) {
      return null
    }
    return <Empty tip="暂无音乐" />
  }, [loading, songs])

  return Array.isArray(songs) && songs.length ? (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.w1}>
              <div className={`${styles.th} ${styles.first}`} />
            </th>
            <th className={styles.w2}>
              <div className={styles.th}>歌曲标题</div>
            </th>
            <th className={styles.w3}>
              <div className={styles.th}>时长</div>
            </th>
            <th className={styles.w4}>
              <div className={styles.th}>歌手</div>
            </th>
            <th className={styles.w5}>
              <div className={styles.th}>专辑</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {songs.map((item, index) => {
            const order = index + 1
            const { id, alia: alias } = item
            const disabled = false // todo 没有播放权限
            const active = currentSong?.id === id
            return (
              <tr
                key={id}
                className={`${styles.track} ${disabled ? styles.disabled : ''} ${order % 2 ? styles.even : ''} ${active ? ` ${styles.active}` : ''}`}
              >
                <td className={styles.order}>
                  <span className={styles.number}>{order}</span>
                  <span className={styles.play}>
                    <SinglePlay id={id} active={active} disabled={disabled} />
                  </span>
                </td>
                <td>
                  <div className={styles.name}>
                    <Link to={`/song/${id}`} title={item.name}>
                      {item.name}
                    </Link>
                    {alias && alias.length ? (
                      <span className={styles.alias} title={alias.join('、')}>
                        {' '}
                        - ({alias.join('、')})
                      </span>
                    ) : (
                      ''
                    )}
                    {item.mv ? (
                      <Link to={`/mv/${item.mv}`}>
                        <MusicVideoIcon className={styles['mv-icon']} />
                      </Link>
                    ) : null}
                  </div>
                </td>
                <td>
                  <div className={styles.duration}>
                    <span className={styles.time}>
                      {formatDuration(item.duration)}
                    </span>
                    <div className={styles.actions}>
                      <SongActions id={id} isSelf={isSelf} />
                    </div>
                  </div>
                </td>
                <td className={styles.artists}>
                  {Array.isArray(item.artists) &&
                    item.artists.map((artist, i) => {
                      return (
                        <span
                          key={`${artist.id}-${i}`}
                          title={getArtists(item.artists)}
                        >
                          <Link to={`/artist/${artist.id}`}>{artist.name}</Link>
                          {i !== item.artists.length - 1 ? '/' : ''}
                        </span>
                      )
                    })}
                </td>
                <td className={styles.album}>
                  <Link to={`/album/${item.album?.id}`}>
                    {item.album?.name}
                  </Link>
                  {showDislike ? (
                    <i
                      className={styles.dislike}
                      title="不感兴趣"
                      onClick={() => handleDislike(id)}
                    />
                  ) : null}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  ) : (
    renderTip
  )
}

SongTable.propTypes = {
  songs: PropTypes.array,
  isSelf: PropTypes.bool,
  showDislike: PropTypes.bool,
  onDislikeSuccess: PropTypes.func
}

export default memo(SongTable)
