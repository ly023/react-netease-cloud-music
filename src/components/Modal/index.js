import React from 'react'
import {createPortal} from 'react-dom'
import PropTypes from 'prop-types'
import './index.scss'

const EDGE = 0

export default class Modal extends React.Component {

    static propTypes = {
        visible: PropTypes.bool,
        title: PropTypes.string,
        mask: PropTypes.bool,
        width: PropTypes.number,
        height: PropTypes.number,
        onCancel: PropTypes.func,
    }

    static defaultProps = {
        visible: false,
        mask: false,
        width: 530,
    }

    constructor(props) {
        super(props)
        this.state = {
            positionStyle: {}
        }
        this.modalRef = React.createRef()
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.visible && this.props.visible) {
            const {clientWidth: modalClientWidth, clientHeight: modalClientHeight} = this.modalRef.current
            this.modalClientWidth = modalClientWidth
            this.modalClientHeight = modalClientHeight
            this.setPosition()
        }
    }

    setPosition = () => {
        const {clientWidth, clientHeight} = document.documentElement
        const top = (clientHeight - this.modalClientHeight) / 2
        const left = (clientWidth - this.modalClientWidth) / 2
        this.setState({
            positionStyle: this.getRightPosition(top, left)
        })
    }

    handleMouseDown = (e) => {
        if (this.isDrag) {
            return
        }

        this.startPosX = e.clientX
        this.startPosY = e.clientY
        let rectObj = this.modalRef.current.getBoundingClientRect()
        this.top = rectObj.top
        this.left = rectObj.left
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

        let styleTop = this.top + moveY
        let styleLeft = this.left + moveX

        this.setState({
            positionStyle: this.getRightPosition(styleTop, styleLeft)
        })
    }

    getRightPosition = (top, left) => {
        const {clientWidth, clientHeight} = document.documentElement
        const maxTop = clientHeight - this.modalClientHeight - EDGE
        const maxLeft = clientWidth - this.modalClientWidth - EDGE

        if (top < EDGE) {
            top = EDGE
        } else if (top > maxTop) {
            top = maxTop
        }

        if (left < EDGE) {
            left = EDGE
        } else if (left > maxLeft) {
            left = maxLeft
        }
        return {top, left}
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
        const {onCancel} = this.props
        onCancel && onCancel()
    }

    handleModalClick = (e) => {
        e.stopPropagation()
    }

    render() {
        const {visible, title, width, height, mask, children} = this.props
        const {positionStyle} = this.state
        const modalRoot = document.getElementById('modal-root')

        const contentStyle = {
            width,
            height,
        }

        return createPortal(visible ? <>
            <div ref={this.modalRef} styleName="popover" style={positionStyle} onClick={this.handleModalClick}>
                <div
                    styleName="popover-bar"
                    onMouseDown={this.handleMouseDown}
                >
                    <p styleName="popover-title">{title}</p>
                    <span styleName="popover-close" title="关闭窗体" onClick={this.close}>×</span>
                </div>
                <div styleName="popover-cont" style={contentStyle}>
                    {children}
                </div>
            </div>
            {mask ? <div styleName="popover-mask"/> : null}
        </> : null, modalRoot)
    }
}
