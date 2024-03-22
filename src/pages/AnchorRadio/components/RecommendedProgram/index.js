import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Play from 'components/business/Play'
import ListLoading from 'components/ListLoading'
import { PLAY_TYPE } from 'constants/music'
import { requestRecommendation as requestRecommendProgram } from 'services/program'
import { getThumbnail } from 'utils'

import styles from './index.scss'

function RecommendedProgram() {
  const [recommendProgram, setRecommendProgram] = useState([])
  const [loading, setLoading] = useState(false)
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    const fetchRecommendProgram = async () => {
      try {
        setLoading(true)
        const res = await requestRecommendProgram()
        if (isMounted.current) {
          setRecommendProgram(res.programs)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendProgram()

    return () => {
      isMounted.current = false
    }
  }, [])

  return loading ? (
    <ListLoading loading={loading} />
  ) : (
    <ul className={styles.list}>
      {recommendProgram.map((item, index) => {
        const { id, name, radio = {} } = item
        return (
          <li
            key={id}
            className={`${styles.item} ${(index + 1) % 2 === 0 ? styles.even : ''}`}
          >
            <div className={styles.cover}>
              <img src={getThumbnail(radio?.picUrl, 80)} alt="封面" />
              <Play id={id} type={PLAY_TYPE.PROGRAM.TYPE}>
                <i className={styles['play-icon']} />
              </Play>
            </div>
            <div className={styles.content}>
              <Link className={styles['program-name']} to={`/program/${id}`}>
                {name}
              </Link>
              <Link className={styles['radio-name']} to={`/radio/${radio?.id}`}>
                {radio?.name}
              </Link>
            </div>
            <Link
              className={styles.category}
              to={`/discover/radio/category/${radio?.categoryId}`}
            >
              {radio?.category}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default RecommendedProgram
