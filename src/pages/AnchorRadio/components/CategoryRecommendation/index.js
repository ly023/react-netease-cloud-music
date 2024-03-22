import { useEffect, useState, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import SubTitle from 'components/SubTitle'
import { getThumbnail } from 'utils'
import { requestCategoryRecommendation } from 'services/radio'
import { CATEGORY_RECOMMENDATION } from '../../constants'

import styles from './index.scss'

function CategoryRecommendation({ type }) {
  const isMounted = useRef(false)
  const [radios, setRadios] = useState([])

  const categoryName = useMemo(() => {
    let name = ''
    const keys = Object.keys(CATEGORY_RECOMMENDATION)
    for (let i = 0; i < keys.length; i++) {
      const obj = CATEGORY_RECOMMENDATION[keys[i]]
      if (obj && obj.TYPE === type) {
        name = obj.TEXT
        break
      }
    }
    return name
  }, [type])

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    const fetchCategoryRecommendation = async () => {
      const res = await requestCategoryRecommendation({ type })
      if (isMounted.current) {
        const data = res.djRadios.slice(0, 4)
        setRadios(data)
      }
    }

    fetchCategoryRecommendation()
  }, [type])

  return (
    <div className={styles.section}>
      <SubTitle
        title={`${categoryName}·电台`}
        guide={`/discover/radio/category/${type}`}
      />
      <ul className={styles.radios}>
        {radios.map((item, index) => {
          const { id } = item
          const link = `/radio/${id}`
          const style =
            index === 2 || index === 3 ? { borderColor: '#fff' } : null
          return (
            <li key={id} className={styles.item} style={style}>
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
