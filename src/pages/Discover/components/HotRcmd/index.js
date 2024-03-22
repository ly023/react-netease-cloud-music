/**
 * 热门推荐
 */
import { useState, useEffect, useRef, memo } from 'react'
import { Link } from 'react-router-dom'
import HeadsetIcon from '@mui/icons-material/Headset'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import Play from 'components/business/Play'
import { PLAY_TYPE } from 'constants/music'
import ListLoading from 'components/ListLoading'
import { formatNumber, getThumbnail } from 'utils'
import { requestPersonalized } from 'services/playlist'

import styles from './index.scss'

function HotRcmd() {
  const [personalized, setPersonalized] = useState([])
  const [loading, setLoading] = useState(false)
  const isMounted = useRef(false)

  useEffect(() => {
    const fetchPersonalized = async () => {
      setLoading(true)
      const res = await requestPersonalized({ limit: 10 })
      if (isMounted.current) {
        const data = res?.result || []
        setLoading(false)
        setPersonalized(data)
      }
    }

    isMounted.current = true
    fetchPersonalized()

    return () => {
      isMounted.current = false
    }
  }, [])

  return (
    <>
      <ListLoading loading={loading} />
      <ul className={styles.list}>
        {personalized.map((item) => {
          const { id, name } = item
          const detailLink = `/playlist/${id}`
          return (
            <li key={id} className={styles.item}>
              <div className={styles.cover}>
                <img src={getThumbnail(item.picUrl)} />
                <Link to={detailLink} className={styles.mask} />
                <div className={styles.bottom}>
                  <HeadsetIcon className={`fl ${styles['icon-headset']}`} />
                  <span className="fl">{formatNumber(item.playCount, 1)}</span>
                  <Play type={PLAY_TYPE.PLAYLIST.TYPE} id={id}>
                    <PlayCircleOutlineIcon
                      className={`fr ${styles['icon-play']}`}
                    />
                  </Play>
                </div>
              </div>
              <p>
                <Link to={detailLink} className={styles.des} alt={name}>
                  {name}
                </Link>
              </p>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default memo(HotRcmd)
