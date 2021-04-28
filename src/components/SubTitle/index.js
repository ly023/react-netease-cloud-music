import {memo} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'

import './index.scss'

function SubTitle(props) {
    const {title, guide, slot} = props

    return <div styleName="title">
        <h3>{title}</h3>
        {slot ? <div className="fr">{slot}</div> : null}
        {guide && !slot ? <Link className="fr" styleName="guide" to={guide}>更多 ></Link> : null}
    </div>
}

PropTypes.propTypes = {
    title: PropTypes.string.isRequired,
    guide: PropTypes.string,
    slot: PropTypes.node,
}

export default memo(SubTitle)
