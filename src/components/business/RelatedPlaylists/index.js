import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { getThumbnail } from 'utils'
import styles from './index.scss'

function RelatedPlaylists({ title = '', list = [] }) {
  return list.length ? (
    <div className={styles.list}>
      <h3 className={styles.title}>{title}</h3>
      <ul>
        {list.map((item) => {
          return (
            <li key={item.id} className={styles.item}>
              <Link
                to={`/playlist/${item.id}`}
                title={item.name}
                className={styles.cover}
              >
                <img src={getThumbnail(item.coverImgUrl, 120)} alt="cover" />
              </Link>
              <div className={styles.meta}>
                <p className={styles.name}>
                  <Link to={`/playlist/${item.id}`} title={item.name}>
                    {item.name}
                  </Link>
                </p>
                <p>
                  <span className={styles.by}>by</span>
                  <Link
                    className={styles.nickname}
                    to={`/user/home/${item?.creator?.userId}`}
                    title={item?.creator?.nickname}
                  >
                    {item?.creator?.nickname}
                  </Link>
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  ) : null
}

RelatedPlaylists.propTypes = {
  title: PropTypes.string,
  list: PropTypes.array
}

export default RelatedPlaylists
