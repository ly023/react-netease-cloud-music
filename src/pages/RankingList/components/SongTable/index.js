import { memo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import MusicVideoIcon from '@mui/icons-material/MusicVideo'
import useShallowEqualSelector from 'hook/useShallowEqualSelector'
import ListLoading from 'components/ListLoading'
import SinglePlay from 'components/business/SinglePlay'
import SongActions from 'components/business/SongActions'
import { formatDuration, getThumbnail } from 'utils'
import { getArtists } from 'utils/song'

import styles from './index.scss'

function SongTable(props) {
  const { loading, songs = [], isSelf = false } = props
  const { currentSong = {} } = useShallowEqualSelector(({ user }) => ({
    currentSong: user.player.currentSong
  }))

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.w1}>
              <div className={`${styles.th} ${styles.first}`} />
            </th>
            <th>
              <div className={styles.th}>标题</div>
            </th>
            <th className={styles.w3}>
              <div className={styles.th}>时长</div>
            </th>
            <th className={styles.w4}>
              <div className={styles.th}>歌手</div>
            </th>
          </tr>
        </thead>
        {Array.isArray(songs) && (
          <tbody>
            {songs.map((item, index) => {
              const Top = 3
              const order = index + 1
              const { id, alia: alias, album } = item
              const isTop = order <= Top
              const disabled = false // todo 播放权限
              return (
                <tr
                  key={id}
                  className={`${styles.track} ${disabled ? styles.disabled : ''} ${order % 2 ? styles.even : ''}`}
                >
                  <td className={styles.order}>
                    <span className={styles.number}>{order}</span>
                  </td>
                  <td>
                    {isTop ? (
                      <img
                        src={getThumbnail(album?.picUrl, 50)}
                        className={styles['album-cover']}
                        alt=""
                      />
                    ) : null}
                    <SinglePlay
                      id={id}
                      active={currentSong?.id === id}
                      disabled={disabled}
                    />
                    <div
                      className={`${styles.name} ${isTop ? styles.top : ''}`}
                    >
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
                        <Link
                          to={`/mv/${item.mv}`}
                        >
                          <MusicVideoIcon  className={styles['mv-icon']} />
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
                            <Link to={`/artist/${artist.id}`}>
                              {artist.name}
                            </Link>
                            {i !== item.artists.length - 1 ? '/' : ''}
                          </span>
                        )
                      })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        )}
      </table>
      <ListLoading loading={loading} />
    </>
  )
}

SongTable.propTypes = {
  songs: PropTypes.array,
  isSelf: PropTypes.bool
}

export default memo(SongTable)
