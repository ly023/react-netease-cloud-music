import React from 'react'
import PropTypes from 'prop-types'

import './index.scss'

function Empty(props) {
    const {tip} = props
    return <div styleName="content">
        <i styleName="icon"/>{tip}
    </div>
}

Empty.propTypes = {
    tip: PropTypes.string,
}

Empty.defaultProps = {
    tip: '暂无数据'
}

export default Empty
