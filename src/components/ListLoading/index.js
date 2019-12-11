import React from 'react'
import PropTypes from 'prop-types'

import './index.scss'

function ListLoading(props) {
    return <div styleName="content" style={{display: props.loading ? 'block' : 'none'}}>
        <i styleName="icon"/>加载中...
    </div>
}

ListLoading.propTypes = {
    loading: PropTypes.bool
}

ListLoading.defaultProps = {
    loading: false
}

export default React.memo(ListLoading)

