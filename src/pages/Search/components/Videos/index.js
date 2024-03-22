import { memo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import MusicVideoIcon from '@mui/icons-material/MusicVideo'
import { DEFAULT_ARTIST_AVATAR, VIDEO_TYPE } from 'constants'
import { formatDuration, formatNumber, getThumbnail } from 'utils'
import { getRenderKeyword } from 'utils/song'
import { getVideoPathname } from 'utils/video'

import styles from './index.scss'

function Videos(props) {
  const { keyword = '', list = [] } = props
  return (
    <ul className={styles.list}>
      {list.map((item) => {
        const { vid, type, title, creator: creators } = item
        const videoUrl = getVideoPathname(type, vid)
        const isMV = type === VIDEO_TYPE.MV.TYPE
        return (
          <li key={vid} className={styles.item}>
            <div className={styles.cover}>
              <Link to={videoUrl}>
                <img
                  src={getThumbnail(item.coverUrl, 159, 90)}
                  onError={(e) => {
                    e.target.src = DEFAULT_ARTIST_AVATAR
                  }}
                  alt="封面"
                />
              </Link>
              <span className={styles.time}>
                {formatDuration(item.durationms)}
              </span>
              <span className={styles['play-time']}>
                <span className={styles['video-icon']} />
                {formatNumber(item.playTime, 1)}
              </span>
            </div>
            <p className={styles.title}>
              {isMV ? <MusicVideoIcon className={styles['mv-icon']} /> : null}
              <Link to={videoUrl} title={title}>
                {getRenderKeyword(title, keyword)}
              </Link>
            </p>
            <p className={styles.name}>
              {Array.isArray(creators) && (
                <>
                  by{'\u00A0'}
                  {creators.map((creator, i) => {
                    const { userId, userName } = creator
                    const userHome = isMV
                      ? `/artist/${userId}`
                      : `/user/home/${userId}`
                    return (
                      <span key={userId}>
                        <Link to={userHome}>
                          {getRenderKeyword(userName, keyword)}
                        </Link>
                        {i !== creators.length - 1 ? ' / ' : ''}
                      </span>
                    )
                  })}
                </>
              )}
            </p>
          </li>
        )
      })}
    </ul>
  )
}

Videos.propTypes = {
  keyword: PropTypes.string,
  list: PropTypes.array
}

export default memo(Videos)
