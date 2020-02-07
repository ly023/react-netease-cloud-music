import React, {useState, useEffect, useMemo} from 'react'
import Page from 'components/Page'
import RadioCategorySlides from 'components/RadioCategorySlides'
import CategoryRecommendation  from './components/CategoryRecommendation'
import RadioRank from './components/RadioRank'

import './index.scss'

function AnchorRadioType(props) {
    const {match} = props

    const categoryId = useMemo(() => {
        const {id} = match.params
        return parseInt(id, 10)
    }, [match])

    return <Page>
        <div className="main">
            <div className="gutter">
                <RadioCategorySlides categoryId={categoryId}/>
                <CategoryRecommendation key={`category-recommendation-${categoryId}`} type={categoryId}/>
                <div styleName="section">
                    <RadioRank key={`radio-rank-${categoryId}`}/>
                </div>
            </div>
        </div>
    </Page>
}

export default AnchorRadioType
