import { memo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { DEFAULT_ARTIST_AVATAR } from 'constants'
import { getThumbnail } from 'utils'
import { getRenderKeyword } from 'utils/song'

import styles from './index.scss'

function Artists(props) {
  const { keyword = '', list = [] } = props

  return (
    <ul className={styles.list}>
      {list.map((item) => {
        const { id, name } = item
        const artistUrl = `/artist/${id}`
        return (
          <li key={id} className={styles.item}>
            <Link to={artistUrl}>
              <div className={styles.cover}>
                <img
                  src={getThumbnail(item.picUrl, 130)}
                  onError={(e) => {
                    e.target.src = DEFAULT_ARTIST_AVATAR
                  }}
                  alt="封面"
                />
                <div className={styles.mask} />
              </div>
            </Link>
            <div className={styles.meta}>
              <Link to={artistUrl} className={styles.name} title={name}>
                {getRenderKeyword(name, keyword)}
              </Link>
              {item.accountId ? (
                <Link
                  to={`/user/home/${item.accountId}`}
                  className={styles.icon}
                />
              ) : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

Artists.propTypes = {
  keyword: PropTypes.string,
  list: PropTypes.array
}

export default memo(Artists)
