import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import Page from 'components/Page'
import Play from 'components/business/Play'
import ListLoading from 'components/ListLoading'
import { DEFAULT_DOCUMENT_TITLE } from 'constants'
import { PLAY_TYPE } from 'constants/music'
import { requestRecommendation } from 'services/program'
import { getThumbnail } from 'utils'

import styles from './index.scss'

function AnchorRadioRecommendation() {
  const [loading, setLoading] = useState(false)
  const [programs, setPrograms] = useState([])
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    const fetchRecommendation = async () => {
      try {
        setLoading(true)

        const res = await requestRecommendation({ limit: 50 })
        if (isMounted.current) {
          setPrograms(res.programs)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendation()

    return () => {
      isMounted.current = false
    }
  }, [])

  const documentTitle = useMemo(
    () => `推荐节目 - 主播电台 - ${DEFAULT_DOCUMENT_TITLE}`,
    []
  )

  return (
    <Page title={documentTitle}>
      <div className="main">
        <div className="gutter">
          <div className={styles.title}>
            <h3>推荐节目</h3>
            <span className={styles.sub}>（每日更新）</span>
          </div>
          {loading ? (
            <ListLoading loading={loading} />
          ) : (
            <ul className={styles.list}>
              {programs.map((item, index) => {
                const { id, name, radio = {} } = item
                const order = index + 1

                return (
                  <li
                    key={id}
                    className={`${styles.item} ${order % 2 === 0 ? styles.even : ''}`}
                  >
                    <div className={`fl ${styles.cover}`}>
                      <img src={getThumbnail(item.coverUrl, 40)} alt="" />
                      <Play id={id} type={PLAY_TYPE.PROGRAM.TYPE}>
                        <i className={styles['play-icon']} />
                      </Play>
                    </div>
                    <Link
                      to=""
                      className={`fl ${styles['program-name']}`}
                      title={name}
                    >
                      {name}
                    </Link>
                    <Link
                      to=""
                      className={`fl ${styles['radio-name']}`}
                      title={radio.name}
                    >
                      {radio.name}
                    </Link>
                    <span className={`fl ${styles['listener-count']}`}>
                      播放{item.listenerCount}
                    </span>
                    <span className={`fl ${styles['like-count']}`}>
                      赞{item.likedCount}
                    </span>
                    <div className={`fl ${styles.tag}`}>
                      <Link to={`/discover/radio/category/${radio.id}`}>
                        {radio.category}
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </Page>
  )
}

export default AnchorRadioRecommendation
