import React, {useState, useEffect, useCallback, useRef} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {DEFAULT_DOCUMENT_TITLE} from 'constants'
import {requestCategories} from 'services/radio'

import './index.scss'

const PER_SLIDES = 18

function RadioCategorySlides(props) {
    const {categoryId} = props

    const [categories, setCategories] = useState([])
    const [slides, setSlides] = useState([])
    const [activePageIndex, setActivePageIndex] = useState(0)
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

        setActivePageIndex(index)
        setSlides(currentSlides)
        setPagination(Array.from(new Array(page)))
    }, [categories])

    const handlePrev = () => {
        if (activePageIndex === 0) {
            return
        }
        const prevIndex = activePageIndex - 1
        slide(prevIndex)
    }

    const handleNext = () => {
        if (activePageIndex === pagination.length - 1) {
            return
        }
        const nextIndex = activePageIndex + 1
        slide(nextIndex)
    }

    const handlePageChange = (index) => {
        slide(index)
    }

    useEffect(() => {
        let pageIndex = 0
        if (categoryId) {
            const index = categories.findIndex(v => v.id === categoryId)
            if (index !== -1) {
                pageIndex = Math.floor(index / PER_SLIDES)
                // 修改 document title
                const categoryName = categories[index].name
                document.title = `${categoryName} - 主播电台 - ${DEFAULT_DOCUMENT_TITLE}`
            }
        }
        slide(pageIndex)
    }, [categoryId, categories, slide])

    return <div styleName="categories">
        <div styleName="list">
            {
                slides.map((item) => {
                    const {id, name} = item
                    const categoryLink = `/discover/radio/category/${id}`
                    return <Link key={id} to={categoryLink} styleName={`item ${categoryId === id ? 'active' : ''}`}>
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
                        styleName={`dot ${index === activePageIndex ? 'active' : ''}`}
                        onClick={() => handlePageChange(index)}
                    />
                })
            }
        </div>
        <div styleName={`prev ${activePageIndex === 0 ? 'disabled' : ''}`} onClick={handlePrev}/>
        <div styleName={`next ${activePageIndex === pagination.length - 1 ? 'disabled' : ''}`} onClick={handleNext}/>
    </div>
}

PropTypes.propTypes = {
    categoryId: PropTypes.number
}

export default RadioCategorySlides
