import { useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import HeadsetIcon from '@mui/icons-material/Headset'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import Play from 'components/business/Play'
import { PLAY_TYPE } from 'constants/music'
import { formatNumber, getThumbnail } from 'utils'

import styles from './index.scss'

function PlaylistItem(props) {
  const { item, showCreator = false, ellipsis = false } = props
  const { id, name, creator = {} } = item
  const detailLink = useMemo(() => `/playlist/${id}`, [id])

  return (
    <>
      <div className={styles['cover-wrapper']}>
        <Link to={detailLink} className={styles.cover}>
          <img src={getThumbnail(item.coverUrl)} alt="歌单封面" />
        </Link>
        <div className={styles.bottom}>
          <HeadsetIcon className={`fl ${styles['icon-headset']}`} />
          <span className="fl">{formatNumber(item.playCount, 1)}</span>
          <Play type={PLAY_TYPE.PLAYLIST.TYPE} id={id}>
            <PlayCircleOutlineIcon className={`fr ${styles['icon-play']}`} />
          </Play>
        </div>
      </div>
      <Link
        to={detailLink}
        className={`${styles.name} ${ellipsis ? styles.ellipsis : ''}`}
        title={name}
      >
        {name}
      </Link>
      {showCreator ? (
        <div className={styles.creator}>
          by{' '}
          <Link
            to={`/user/home/${creator.userId}`}
            className={styles.nickname}
            title={creator.nickname}
          >
            {creator.nickname}
          </Link>
        </div>
      ) : null}
    </>
  )
}

PlaylistItem.propTypes = {
  item: PropTypes.object,
  showCreator: PropTypes.bool, // 是否显示创建者
  ellipsis: PropTypes.bool // 文字溢出省略
}

export default memo(PlaylistItem)
