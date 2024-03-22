import { memo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import MusicVideoIcon from '@mui/icons-material/MusicVideo'
import { PLAY_TYPE } from 'constants/music'
import Add from 'components/business/Add'
import SinglePlay from 'components/business/SinglePlay'
import AddToPlaylist from 'components/business/AddToPlaylist'
import useShallowEqualSelector from 'hook/useShallowEqualSelector'
import { formatDuration } from 'utils'
import { getRenderKeyword } from 'utils/song'

import styles from './index.scss'

function Songs(props) {
  const { keyword = '', list = [] } = props
  const { currentSong = {} } = useShallowEqualSelector(({ user }) => ({
    currentSong: user.player.currentSong
  }))

  return (
    <div className={styles.list}>
      {list.map((item, index) => {
        const { id, name, alias } = item
        const isEven = (index + 1) % 2 === 0

        return (
          <div
            key={id}
            className={`${styles.item} ${isEven ? styles.even : ''}`}
          >
            <span className={styles['play-icon']}>
              <SinglePlay id={id} active={currentSong?.id === id} />
            </span>
            <div className={`${styles.td} ${styles.name}`}>
              <Link to={`/song/${id}`}>{getRenderKeyword(name, keyword)}</Link>
              {alias && alias.length ? (
                <span className={styles.alias} title={alias.join('、')}>
                  {' '}
                  - ({alias.join('、')})
                </span>
              ) : (
                ''
              )}
              {item.mvid ? (
                <Link
                  to={`/mv/${item.mvid}`}
                  className={styles.icon}
                >
                  <MusicVideoIcon className={styles['mv-icon']} />
                </Link>
              ) : null}
            </div>
            <div className={`${styles.td} ${styles.operation}`}>
              <Add id={id} type={PLAY_TYPE.SINGLE.TYPE}>
                <a
                  href={null}
                  className={`${styles.icon} ${styles['add-icon']}`}
                  title="添加到播放列表"
                />
              </Add>
              <AddToPlaylist songIds={[id]}>
                <a
                  href={null}
                  className={`${styles.icon} ${styles['favorite-icon']}`}
                  title="收藏"
                />
              </AddToPlaylist>
              <a
                href={null}
                className={`${styles.icon} ${styles['share-icon']}`}
                title="分享"
              />
              <a
                href={null}
                className={`${styles.icon} ${styles['download-icon']}`}
                title="下载"
              />
            </div>
            <span className={`${styles.td} ${styles.artist}`}>
              {Array.isArray(item.artists) &&
                item.artists.map((artist, i) => {
                  return (
                    <span key={`${artist.id}-${i}`}>
                      <Link to={`/artist/${artist.id}`}>
                        {getRenderKeyword(artist.name, keyword)}
                      </Link>
                      {i !== item.artists.length - 1 ? '/' : ''}
                    </span>
                  )
                })}
            </span>
            <Link
              to={`/album/${item.album?.id}`}
              className={`${styles.td} ${styles.album}`}
            >
              《{getRenderKeyword(item.album?.name, keyword)}》
            </Link>
            <span className={styles.td}>{formatDuration(item.duration)}</span>
          </div>
        )
      })}
    </div>
  )
}

Songs.propTypes = {
  keyword: PropTypes.string,
  list: PropTypes.array
}

export default memo(Songs)
