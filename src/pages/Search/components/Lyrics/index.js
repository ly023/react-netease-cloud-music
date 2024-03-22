import { memo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { PLAY_TYPE } from 'constants/music'
import Add from 'components/business/Add'
import Play from 'components/business/Play'
import AddToPlaylist from 'components/business/AddToPlaylist'
import { formatDuration } from 'utils'
import { getRenderKeyword } from 'utils/song'

import styles from './index.scss'

function Lyrics(props) {
  const { keyword = '', list = [] } = props

  return (
    <div className={styles.list}>
      {list.map((item, index) => {
        const { id, transNames } = item
        const isEven = (index + 1) % 2 === 0
        return (
          <div key={id} className={styles.item}>
            <div className={`${styles.info} ${isEven ? styles.even : ''}`}>
              <Play id={id} type={PLAY_TYPE.SINGLE.TYPE}>
                <i className={`${styles.icon} ${styles['play-icon']}`} />
              </Play>
              <div className={`${styles.td} ${styles.name}`}>
                <Link to={`/song/${id}`}>
                  {getRenderKeyword(item.name, keyword)}
                </Link>
                {transNames && transNames.length ? (
                  <span
                    className={styles['trans-names']}
                    title={transNames.join('、')}
                  >
                    {' '}
                    - ({transNames.join('、')})
                  </span>
                ) : (
                  ''
                )}
                {item.mvid ? (
                  <Link
                    to={`/mv/${item.mvid}`}
                    className={`${styles.icon} ${styles['mv-icon']}`}
                  />
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
              <a className={`${styles.td} ${styles.album}`}>
                《{getRenderKeyword(item.album?.name, keyword)}》
              </a>
              <span className={styles.td}>{formatDuration(item.duration)}</span>
            </div>
            <div className={styles['lyric-content']}>{/*  todo 歌词 */}</div>
          </div>
        )
      })}
    </div>
  )
}

Lyrics.propTypes = {
  keyword: PropTypes.string,
  list: PropTypes.array
}

export default memo(Lyrics)
