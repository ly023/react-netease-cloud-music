import React, {useState, useEffect, useRef} from 'react'
import {Link} from 'react-router-dom'
import {getThumbnail} from 'utils'
import {requestRecommendation as requestRecommendProgram} from 'services/program'
import ListLoading from 'components/ListLoading'

import './index.scss'

function RecommendedProgram() {
    const [recommendProgram, setRecommendProgram] = useState([])
    const [loading, setLoading] = useState(false)
    const isMounted = useRef()

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

    return loading
        ? <ListLoading loading={loading}/>
        : <ul styleName="list">
            {
                recommendProgram.map((item, index) => {
                    const {id, name, radio = {}} = item
                    return <li key={id} styleName={`item ${(index + 1) % 2 === 0 ? 'even' : ''}`}>
                        <div styleName="cover">
                            <img src={getThumbnail(radio?.picUrl, 40)} alt="封面"/>
                            <i styleName="play-icon"/>
                        </div>
                        <div styleName="content">
                            <Link styleName="program-name" to={`/program/${id}`}>{name}</Link>
                            <Link styleName="radio-name" to={`/radio/${radio?.id}`}>{radio?.name}</Link>
                        </div>
                        <Link styleName="category" to={`/discover/radio/category?id=${radio?.categoryId}`}>{radio?.category}</Link>
                    </li>
                })
            }
        </ul>
}

export default RecommendedProgram
