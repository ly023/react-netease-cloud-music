import PropTypes from 'prop-types'

import './index.scss'

function Empty(props) {
    const {tip = '暂无数据'} = props
    return <div styleName="content">
        <i styleName="icon"/>{tip}
    </div>
}

Empty.propTypes = {
    tip: PropTypes.string,
}

export default Empty
