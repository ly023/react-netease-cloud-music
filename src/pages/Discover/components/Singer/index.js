import { useState, useEffect, useRef, memo } from 'react'
import { Link } from 'react-router-dom'
import { requestTopArtist } from 'services/artist'
import { getThumbnail } from 'utils'

import styles from './index.scss'

function Singer() {
  const [artists, setArtists] = useState([])
  const isMounted = useRef(false)

  useEffect(() => {
    const fetchArtist = async () => {
      const params = { limit: 8 }
      const res = await requestTopArtist(params)
      if (isMounted.current) {
        setArtists(res.artists)
      }
    }

    isMounted.current = true
    fetchArtist()

    return () => {
      isMounted.current = false
    }
  }, [])

  return (
    <section className={styles.wrapper}>
      <h3 className={styles.title}>
        <span className="fl">热门歌手</span>
        <a href={null} className={styles.more}>
          查看全部 &gt;
        </a>
      </h3>
      <ul className={styles.list}>
        {artists.map((item) => {
          const { id, accountId, name, alias, picUrl } = item
          return (
            <li key={id} className={styles.item}>
              <Link to={`/user/home/${accountId}`}>
                <img
                  src={getThumbnail(picUrl, 80)}
                  className={styles['item-avatar']}
                  alt="头像"
                />
                <div className={styles['item-info']}>
                  <h4 className={styles['item-nickname']}>
                    {name}
                    {alias?.[0]}
                  </h4>
                  <p className={styles['item-desc']}>暂无描述</p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default memo(Singer)
