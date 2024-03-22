import { memo } from 'react'
import PropTypes from 'prop-types'

import styles from './index.scss'

/**
 * @return {null}
 */
function ListLoading({ loading = true }) {
  return loading ? (
    <div className={styles.content}>
      <i className={styles.icon} />
      加载中...
    </div>
  ) : null
}

ListLoading.propTypes = {
  loading: PropTypes.bool
}

export default memo(ListLoading)
