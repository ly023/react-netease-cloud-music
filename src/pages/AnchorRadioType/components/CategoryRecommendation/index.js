import React, {useEffect, useState, useRef} from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import SubTitle from 'components/SubTitle'
import {getThumbnail} from 'utils'
import {requestCategoryRecommendation} from 'services/radio'

import './index.scss'

function CategoryRecommendation({type}) {
    const isMounted = useRef()
    const [radios, setRadios] = useState([])

    useEffect(() => {
        isMounted.current = true

        const fetchCategoryRecommendation = async () => {
            const res = await requestCategoryRecommendation({type})
            if (isMounted.current) {
                const data = res.djRadios.slice(0, 5)
                setRadios(data)
            }
        }

        fetchCategoryRecommendation()

        return () => {
            isMounted.current = false
        }
    }, [type])

    return <div styleName="section">
        <SubTitle title='优秀新电台'/>
        <ul styleName="radios">
            {
                radios.map((item) => {
                    const {id} = item
                    const link = `/radio/${id}`
                    return <li key={id} styleName="item">
                        <Link to={link}>
                            <img src={getThumbnail(item.picUrl, 200)} alt="" styleName="cover"/>
                        </Link>
                        <div styleName="cont">
                            <Link to={link} styleName="name">{item.name}</Link>
                            <div styleName="desc">
                                {item.rcmdtext}
                            </div>
                        </div>
                    </li>
                })
            }
        </ul>
    </div>
}

CategoryRecommendation.propTypes = {
    type: PropTypes.number.isRequired
}

export default CategoryRecommendation
