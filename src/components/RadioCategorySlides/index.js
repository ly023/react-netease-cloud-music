import React, {useState, useEffect, useCallback, useRef} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {requestCategories} from 'services/radio'

import './index.scss'

const PER_SLIDES = 18

function RadioCategorySlides() {
    const [categories, setCategories] = useState([])
    const [slides, setSlides] = useState([])
    const [activeIndex, setActiveIndex] = useState(0)
    const [pagination, setPagination] = useState([])
    const isMounted = useRef()

    useEffect(() => {
        isMounted.current = true

        const fetchCategories = async () => {
            const res = await requestCategories()
            if (isMounted.current) {
                setCategories(res.categories)
            }
        }

        fetchCategories()

        return () => {
            isMounted.current = false
        }
    }, [])

    const slide = useCallback((index) => {
        const currentSlides = categories.slice(index * PER_SLIDES, (index + 1) * PER_SLIDES)
        const page = Math.ceil(categories.length / PER_SLIDES)

        setActiveIndex(index)
        setSlides(currentSlides)
        setPagination(Array.from(new Array(page)))
    }, [categories])

    const handlePrev = () => {
        if (activeIndex === 0) {
            return
        }
        const prevIndex = activeIndex - 1
        slide(prevIndex)
    }

    const handleNext = () => {
        if (activeIndex === pagination.length - 1) {
            return
        }
        const nextIndex = activeIndex + 1
        slide(nextIndex)
    }

    const handlePageChange = (index) => {
        slide(index)
    }

    useEffect(() => {
        slide(0)
    }, [categories, slide])

    return  <div styleName="categories">
        <div styleName="list">
            {
                slides.map((item) => {
                    const {id, name} = item
                    const categoryLink = `/discover/radio/category/${id}`
                    return <Link key={id} to={categoryLink} styleName="item">
                        <div styleName="icon" style={{backgroundImage: `url(${item.picWebUrl})`}}/>
                        <em styleName="name">{name}</em>
                    </Link>
                })
            }
        </div>
        <div styleName="pagination">
            {
                pagination.map((v, index) => {
                    return <span
                        key={index}
                        styleName={`dot ${index === activeIndex ? 'active' : ''}`}
                        onClick={() => handlePageChange(index)}
                    />
                })
            }
        </div>
        <div styleName={`prev ${activeIndex === 0 ? 'disabled' : ''}`} onClick={handlePrev}/>
        <div styleName={`next ${activeIndex === pagination.length - 1 ? 'disabled' : ''}`} onClick={handleNext}/>
    </div>
}

PropTypes.propTypes = {
    activeId: PropTypes.number
}

export default RadioCategorySlides
