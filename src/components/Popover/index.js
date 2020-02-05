import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react'
import PropTypes from 'prop-types'

import './index.scss'

const placements = [
    'top',
    'bottom',
    'bottomLeft',
    'bottomRight'
]

function Popover(props) {
    const {children, placement, trigger, content, style} = props
    const [visible, setVisible] = useState(false)
    const [positionStyle, setPositionStyle] = useState({})

    const childrenRef = useRef()
    const innerRef = useRef()


    const onlyChildren = React.Children.only(children)

    const setChildrenRef = useCallback((el) => {
        childrenRef.current = el
    }, [])

    const handleClick = useCallback(() => {
        setVisible(!visible)
    }, [visible])

    const handleMouseEnter = useCallback(() => {
        setVisible(true)
    }, [])

    const handleMouseLeave = useCallback(() => {
        setVisible(false)
    }, [])

    const element = trigger === 'click' ? React.cloneElement(onlyChildren, {
        ref: setChildrenRef,
        onClick: handleClick
    }) : React.cloneElement(onlyChildren, {
        ref: setChildrenRef,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave
    })

    const getComputeStyle = useCallback(() => {
        if (childrenRef.current && innerRef.current) {
            const boundingClientRect = childrenRef.current.getBoundingClientRect()
            const {width: childrenWidth, height: childrenHeight} = boundingClientRect

            const contentDom = innerRef.current
            const {offsetWidth: contentWidth} = contentDom

            if (placement === 'bottom') {
                return {
                    top: childrenHeight,
                    left: -(contentWidth - childrenWidth) / 2
                }
            } else if (placement === 'bottomRight') {
                return {
                    top: childrenHeight,
                    left: - (contentWidth - childrenWidth)
                }
            }
        }
    }, [placement, childrenRef, innerRef])


    const innerStyle = {
        ...style,
    }

    const placementStyleName = useMemo(() => placement.replace(/[A-Z]/g, (match)=>{
        return `-${match.toLowerCase()}`
    }), [placement])

    const PopoverContent = <div styleName={`wrapper place-${placementStyleName}`} style={
        {
            ...positionStyle,
            display: visible ? undefined : 'none'
        }
    }>
        <div styleName="content">
            <div styleName="arrow"/>
            <div styleName="inner" ref={innerRef} style={innerStyle}>
                {content}
            </div>
        </div>
    </div>

    useEffect(() => {
        if (visible) {
            setPositionStyle(getComputeStyle())
        }
    }, [visible, getComputeStyle])


    return <div styleName="root">
        {element}
        {PopoverContent}
    </div>
}

Popover.propTypes = {
    placement: PropTypes.oneOf(placements),
    trigger: PropTypes.oneOf(['hover', 'click']),
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    style: PropTypes.object,
}

Popover.defaultProps = {
    placement: 'bottom',
    trigger: 'click'
}

export default Popover
