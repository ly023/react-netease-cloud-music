import React from 'react'
import PropTypes from 'prop-types'

import './index.scss'

/**
 * @return {null}
 */
function ListLoading({loading}) {
    return loading ? <div styleName="content">
        <i styleName="icon"/>加载中...
    </div> : null
}

ListLoading.propTypes = {
    loading: PropTypes.bool
}

ListLoading.defaultProps = {
    loading: true
}

export default React.memo(ListLoading)

