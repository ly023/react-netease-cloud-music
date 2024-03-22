import { memo } from 'react'
import Proptypes from 'prop-types'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import Play from 'components/business/Play'
import { PLAY_TYPE } from 'constants/music'
import { getThumbnail } from 'utils'

import styles from './index.scss'

function AlbumItem(props) {
  const {
    item = {},
    smallSize = false,
    showArtistName = false,
    showDate = false
  } = props
  const { id, name, artist } = item
  const albumLink = `/album/${id}`

  return (
    <div className={styles.box}>
      <div className={styles.cover}>
        <Link to={albumLink}>
          <img
            src={getThumbnail(item.picUrl, smallSize ? 200 : 256)}
            style={{ width: smallSize ? 120 : 130 }}
            alt={name}
          />
          <span className={`${styles.mask} ${smallSize ? styles.small : ''}`} />
        </Link>
        <Play id={id} type={PLAY_TYPE.ALBUM.TYPE}>
          <PlayCircleOutlineIcon className={styles['play-icon']} />
        </Play>
      </div>
      <Link to={albumLink} className={styles.title} title={name}>
        {name}
      </Link>
      {showArtistName ? (
        <Link to="/" className={styles.name} title={artist?.name}>
          {artist?.name}
        </Link>
      ) : null}
      {showDate ? (
        <div className={styles.name}>
          {dayjs(item.publishTime).format('YYYY.MM.DD')}
        </div>
      ) : null}
    </div>
  )
}

AlbumItem.propTypes = {
  item: Proptypes.object,
  smallSize: Proptypes.bool,
  showArtistName: Proptypes.bool,
  showDate: Proptypes.bool
}

export default memo(AlbumItem)
