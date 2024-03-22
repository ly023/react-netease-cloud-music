import { memo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import MusicVideoIcon from '@mui/icons-material/MusicVideo'
import ListLoading from 'components/ListLoading'
import SinglePlay from 'components/business/SinglePlay'
import SongActions from 'components/business/SongActions'
import Empty from 'components/Empty'
import { formatDuration } from 'utils'
import useShallowEqualSelector from 'hook/useShallowEqualSelector'

import styles from './index.scss'

function SongList(props) {
  const { loading = false, songs = [], isSelf = false } = props

  const { currentSong = {} } = useShallowEqualSelector(({ user }) => ({
    currentSong: user.player.currentSong
  }))

  return (
    <>
      {Array.isArray(songs) && songs.length ? (
        <table className={styles.table}>
          <tbody>
            {songs.map((item, index) => {
              const order = index + 1
              const { id, alia: alias } = item
              const disabled = false // todo 没有播放权限
              return (
                <tr
                  key={id}
                  className={`${styles.track} ${disabled ? styles.disabled : ''} ${order % 2 ? styles.even : ''}`}
                >
                  <td className={styles.order}>
                    <span className={styles.number}>{order}</span>
                    <span className={styles.play}>
                      <SinglePlay
                        id={id}
                        active={currentSong?.id === id}
                        disabled={disabled}
                      />
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
                  <td className={styles.album}>
                    <Link to={`/album/${item.al?.id}`}>{item.al?.name}</Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : (
        <Empty tip="暂无音乐" />
      )}
      <ListLoading loading={loading} />
    </>
  )
}

SongList.propTypes = {
  songs: PropTypes.array,
  isSelf: PropTypes.bool
}

export default memo(SongList)
