import React, {useState, useEffect, useMemo, useCallback, useRef} from 'react'
import {Link} from 'react-router-dom'
import Page from 'components/Page'
import {DEFAULT_DOCUMENT_TITLE} from 'constants'
import {requestCategories} from 'services/radio'
import ProgramRank from 'components/ProgramRank'
import SubTitle from './components/SubTitle'
import RecommendedProgram from './components/RecommendedProgram'
import CategoryRecommendation from './components/CategoryRecommendation'
import {CATEGORY_RECOMMENDATION} from './constants'

import './index.scss'

const PER_SLIDES = 18

function AnchorRadio() {
    const [categories, setCategories] = useState([])
    const [slides, setSlides] = useState([])
    const [activeIndex, setActiveIndex] = useState(0)
    const [pagination, setPagination] = useState([])
    const isMounted = useRef()
    const containerRef = useRef()

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

    const documentTitle = useMemo(() => `主播电台 - ${DEFAULT_DOCUMENT_TITLE}`, [])

    return <Page title={documentTitle}>
        <div className="main">
            <div className="gutter">
                <div styleName="categories">
                    <div ref={containerRef}>
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
                    </div>
                    <div styleName={`prev ${activeIndex === 0 ? 'disabled' : ''}`} onClick={handlePrev}/>
                    <div styleName={`next ${activeIndex === pagination.length - 1 ? 'disabled' : ''}`} onClick={handleNext}/>
                </div>
                <div className="clearfix" styleName="rank">
                    <div className="fl" styleName="column">
                        <SubTitle title="推荐节目" guide="/discover/radio/recommend"/>
                        <RecommendedProgram/>
                    </div>
                    <div className="fr" styleName="column">
                        <SubTitle title="节目排行榜" guide="/discover/radio/rank"/>
                        <ProgramRank type='part'/>
                    </div>
                </div>
                {
                    Object.keys(CATEGORY_RECOMMENDATION).map((key) => {
                        return <CategoryRecommendation key={key} type={CATEGORY_RECOMMENDATION[key].TYPE}/>
                    })
                }
            </div>
        </div>
    </Page>
}

export default AnchorRadio
