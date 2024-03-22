import { useMemo } from 'react'
import Page from 'components/Page'
import { DEFAULT_DOCUMENT_TITLE } from 'constants'
import RadioCategorySlides from 'components/business/RadioCategorySlides'
import ProgramRank from 'components/business/ProgramRank'
import SubTitle from 'components/SubTitle'
import RecommendedProgram from './components/RecommendedProgram'
import CategoryRecommendation from './components/CategoryRecommendation'
import { CATEGORY_RECOMMENDATION } from './constants'

import styles from './index.scss'

function AnchorRadio() {
  const documentTitle = useMemo(
    () => `主播电台 - ${DEFAULT_DOCUMENT_TITLE}`,
    []
  )

  return (
    <Page title={documentTitle}>
      <div className="main">
        <div className="gutter">
          <RadioCategorySlides />
          <div className={`clearfix ${styles.rank}`}>
            <div className={`fl ${styles.column}`}>
              <SubTitle title="推荐节目" guide="/discover/radio/recommend" />
              <RecommendedProgram />
            </div>
            <div className={`fr ${styles.column}`}>
              <SubTitle title="节目排行榜" guide="/discover/radio/rank" />
              <ProgramRank type="part" />
            </div>
          </div>
          {Object.keys(CATEGORY_RECOMMENDATION).map((key) => {
            return (
              <CategoryRecommendation
                key={key}
                type={CATEGORY_RECOMMENDATION[key].TYPE}
              />
            )
          })}
        </div>
      </div>
    </Page>
  )
}

export default AnchorRadio
