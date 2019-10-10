import React from 'react'
import PropTypes from 'prop-types'
import './index.scss'

const EDGE = 20

export default class Modal extends React.Component {

    static propTypes = {
        visible: PropTypes.bool,
    }

    static defaultProps = {
        visible: false,
    }

    constructor(props) {
        super(props)
        this.state = {
            style: {}
        }
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps) {
        if (!prevProps.visible && this.props.visible) {
            const {clientWidth, clientHeight} = this.popoverRef
            this.popoverClientWidth = clientWidth
            this.popoverClientHeight = clientHeight
            this.setPosition()
        }
    }

    componentWillUnmount() {

    }

    getCenterPosition = () => {
        const {clientWidth, clientHeight} = document.documentElement
        const top = (clientHeight - this.popoverClientHeight) / 2
        const left = (clientWidth - this.popoverClientWidth) / 2
        return {top, left}
    }

    setPosition = () => {
        this.setState({
            style: this.getCenterPosition()
        })
    }

    handleMouseDown = (e) => {
        if (this.isDrag) {
            return
        }

        this.startPosX = e.clientX
        this.startPosY = e.clientY
        let popup = window.getComputedStyle(this.popoverRef)
        this.top = parseInt(popup.top, 10)
        this.left = parseInt(popup.left, 10)
        this.isDrag = true

        this.bindEvent()
    }

    handleMouseMove = (e) => {
        if (!this.isDrag) {
            return
        }

        // end position - start position
        let moveX = e.clientX - this.startPosX
        let moveY = e.clientY - this.startPosY

        this.setState({
            style: {
                top: this.top + moveY,
                left: Math.max(this.left + moveX, EDGE)
            }
        })
    }

    bindEvent = (remove) => {
        let functionName = 'addEventListener'
        if (remove) {
            functionName = 'removeEventListener'
        }
        document[functionName]('mousemove', this.handleMouseMove, false)
        document[functionName]('mouseup', this.handleMouseUp, false)
    }

    handleMouseUp = () => {
        this.isDrag = false
        this.bindEvent(true)
    }

    close = () => {
        this.props.onCancel && this.props.onCancel()
    }

    setPopoverRef = (el) => {
        this.popoverRef = el
    }

    render() {
        const {visible, title, children} = this.props
        const {style} = this.state

        return (
            <>
                <div ref={this.setPopoverRef} styleName="popover" className={visible ? null : "hide"} style={style}>
                    <div
                        styleName="popover-bar"
                        onMouseDown={this.handleMouseDown}
                    >
                        <p styleName="popover-title">{title}</p>
                        <span styleName="popover-close" title="关闭窗体" onClick={this.close}>×</span>
                    </div>
                    <div styleName="popover-cont">
                        {children}
                    </div>
                </div>
                <div className={visible ? null : "hide"} styleName="popover-mask"/>
            </>
        )
    }
}
