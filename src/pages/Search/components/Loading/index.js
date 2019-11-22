import React from 'react'
import PropTypes from 'prop-types'

import './index.scss'

function Loading(props) {
    return <div styleName="content" style={{display: props.loading ? 'block' : 'none'}}>
        <i styleName="icon"/>加载中...
    </div>
}

Loading.propTypes = {
    loading: PropTypes.bool
}

Loading.defaultProps = {
    loading: false
}

export default React.memo(Loading)

