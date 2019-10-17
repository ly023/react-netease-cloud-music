import React from 'react'
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css'
import './index.scss'

function Popover(props){
    const {content, children} = props

    return <Tooltip
        {...props}
        overlay={content}
    >
        {children}
    </Tooltip>
}

Popover.defaultProps = {
    placement: 'bottom',
    trigger: 'hover',
    mouseEnterDelay: 0.1,
    mouseLeaveDelay: 0.1,
}

export default Popover
