import {memo} from 'react'
import PropTypes from 'prop-types'

import './index.scss'

/**
 * @return {null}
 */
function ListLoading({loading = true}) {
    return loading ? <div styleName="content">
        <i styleName="icon"/>加载中...
    </div> : null
}

ListLoading.propTypes = {
    loading: PropTypes.bool
}

export default memo(ListLoading)

