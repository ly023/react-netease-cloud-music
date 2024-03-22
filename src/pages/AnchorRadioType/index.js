import { useMemo } from 'react'
import withRouter from 'hoc/withRouter'
import Page from 'components/Page'
import RadioCategorySlides from 'components/business/RadioCategorySlides'
import CategoryRecommendation from './components/CategoryRecommendation'
import RadioRank from './components/RadioRank'

import styles from './index.scss'

function AnchorRadioType(props) {
  const { params } = props

  const categoryId = useMemo(() => {
    return parseInt(params.id, 10)
  }, [params])

  return (
    <Page>
      <div className="main">
        <div className="gutter">
          <RadioCategorySlides categoryId={categoryId} />
          <CategoryRecommendation
            key={`category-recommendation-${categoryId}`}
            type={categoryId}
          />
          <div className={styles.section}>
            <RadioRank key={`radio-rank-${categoryId}`} />
          </div>
        </div>
      </div>
    </Page>
  )
}

export default withRouter(AnchorRadioType)
