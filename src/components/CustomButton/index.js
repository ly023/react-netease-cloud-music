import {memo} from 'react'
import PropTypes from 'prop-types'

import './index.scss'

function CustomButton(props) {
    const {children, type, classname, ...restProps} = props
    return <button styleName={`custom-button ${type || ''}`} className={classname} {...restProps}>
        {children}
    </button>
}

CustomButton.propTypes = {
    type: PropTypes.oneOf(['primary']),
}

export default memo(CustomButton)
