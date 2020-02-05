import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import './index.scss'

function SubTitle(props) {
    const {title, guide} = props

    return <div styleName="title">
        <h3>{title}</h3>
        <Link styleName="guide" to={guide}>更多 ></Link>
    </div>
}

PropTypes.propTypes = {
    title: PropTypes.string.isRequired,
    guide: PropTypes.string.isRequired,
}

export default React.memo(SubTitle)
