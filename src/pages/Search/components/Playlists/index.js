import { memo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { PLAY_TYPE } from 'constants/music'
import { PLAYLIST_COLLECTION_TYPE } from 'constants'
import Add from 'components/business/Add'
import Play from 'components/business/Play'
import SubscribePlaylist from 'components/business/SubscribePlaylist'
import useShallowEqualSelector from 'hook/useShallowEqualSelector'
import { formatNumber } from 'utils'
import { getRenderKeyword } from 'utils/song'

import styles from './index.scss'

function Playlists(props) {
  const { keyword = '', list = [], onSubscribeSuccess } = props

  const { userInfo } = useShallowEqualSelector(({ user }) => ({
    userInfo: user.userInfo
  }))

  const handleSubscribeSuccess = (index) => {
    onSubscribeSuccess && onSubscribeSuccess(index)
  }

  return (
    <div className={styles.list}>
      {list.map((item, index) => {
        const { id, name, creator } = item
        const isEven = (index + 1) % 2 === 0
        const isSelf = creator?.userId === userInfo?.userId
        return (
          <div
            key={id}
            className={`${styles.item} ${isEven ? styles.even : ''}`}
          >
            <div className={styles.td}>
              <Play id={id} type={PLAY_TYPE.PLAYLIST.TYPE}>
                <i className={`${styles.icon} ${styles['play-icon']}`} />
              </Play>
            </div>
            <Link to={'/'} className={`${styles.td} ${styles.cover}`}>
              <img src={item.coverImgUrl} />
              <div className={styles.mask} />
            </Link>
            <div className={`${styles.td} ${styles.name}`}>
              <Link to={`/playlist/${id}`}>
                {getRenderKeyword(name, keyword)}
              </Link>
            </div>
            <div className={`${styles.td} ${styles.operation}`}>
              <Add id={id} type={PLAY_TYPE.PLAYLIST.TYPE}>
                <a
                  href={null}
                  className={`${styles.icon} ${styles['add-icon']}`}
                  title="添加到播放列表"
                />
              </Add>
              <SubscribePlaylist
                id={id}
                type={
                  item.subscribed
                    ? PLAYLIST_COLLECTION_TYPE.OK
                    : PLAYLIST_COLLECTION_TYPE.CANCEL
                }
                disabled={isSelf}
                onSuccess={() => handleSubscribeSuccess(index)}
              >
                <a
                  href={null}
                  className={`${styles.icon} ${styles['favorite-icon']}`}
                  title="收藏"
                />
              </SubscribePlaylist>
              <a
                href={null}
                className={`${styles.icon} ${styles['share-icon']}`}
                title="分享"
              />
            </div>
            <div className={`${styles.td} ${styles['track-count']}`}>
              {item.trackCount}首
            </div>
            {creator && (
              <Link
                to={`/user/home/${creator.userId}`}
                className={`${styles.td} ${styles.creator}`}
              >
                by{'\u00A0'}
                {getRenderKeyword(creator.nickname, keyword)}
              </Link>
            )}
            <div className={`${styles.td} ${styles.count}`}>
              收藏: {formatNumber(item.bookCount, 1)}
            </div>
            <div className={`${styles.td} ${styles.count}`}>
              收听: {formatNumber(item.playCount, 1)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

Playlists.propTypes = {
  keyword: PropTypes.string,
  list: PropTypes.array,
  onSubscribeSuccess: PropTypes.func
}

export default memo(Playlists)
