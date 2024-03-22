import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import SubTitle from 'components/SubTitle'
import ListLoading from 'components/ListLoading'
import { getThumbnail } from 'utils'
import { requestCategoryRecommendation } from 'services/radio'

import styles from './index.scss'

function CategoryRecommendation({ type }) {
  const isMounted = useRef(false)
  const [radios, setRadios] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    const fetchCategoryRecommendation = async () => {
      setLoading(true)
      try {
        const res = await requestCategoryRecommendation({ type })
        if (isMounted.current) {
          const data = res.djRadios.slice(0, 5)
          setRadios(data)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryRecommendation()
  }, [type])

  return (
    <div className={styles.section}>
      <SubTitle title="优秀新电台" />
      <ListLoading loading={loading} />
      <ul className={styles.radios}>
        {radios.map((item) => {
          const { id } = item
          const link = `/radio/${id}`
          return (
            <li key={id} className={styles.item}>
              <Link to={link}>
                <img
                  src={getThumbnail(item.picUrl, 200)}
                  alt=""
                  className={styles.cover}
                />
              </Link>
              <div className={styles.cont}>
                <Link to={link} className={styles.name}>
                  {item.name}
                </Link>
                <div className={styles.desc}>{item.rcmdtext}</div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

CategoryRecommendation.propTypes = {
  type: PropTypes.number.isRequired
}

export default CategoryRecommendation
