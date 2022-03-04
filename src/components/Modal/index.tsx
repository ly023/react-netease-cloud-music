import {Component, createRef, CSSProperties, MouseEvent} from 'react'
import {createPortal} from 'react-dom'
import './index.scss'

const EDGE = 0

interface ModalProps {
    visible?: boolean,
    title?: string,
    mask?: boolean,
    width?: number,
    height?: number,
    onCancel?: () => void,
}

interface ModalState {
    positionStyle: CSSProperties,
}

export default class Modal extends Component<ModalProps, ModalState> {

    // todo defaultProps checking
    static defaultProps : ModalProps = {
        visible: false,
        mask: false,
        width: 530,
        title: '',
    }

   state: ModalState = {
        positionStyle: {},
   }

    componentDidUpdate(prevProps: ModalProps) {
        if (!prevProps.visible && this.props.visible) {
            // @ts-ignore
            const {clientWidth: modalClientWidth, clientHeight: modalClientHeight} = this.modalRef.current
            this.modalClientWidth = modalClientWidth
            this.modalClientHeight = modalClientHeight
            this.setPosition()
        }
    }

    modalRef = createRef<HTMLDivElement>()
    modalClientWidth = 0
    modalClientHeight = 0
    isDrag = false
    startPosX = 0
    startPosY = 0
    top = 0
    left = 0

    setPosition = () => {
        const {clientWidth, clientHeight} = document.documentElement
        const top = (clientHeight - this.modalClientHeight) / 2
        const left = (clientWidth - this.modalClientWidth) / 2
        this.setState({
            positionStyle: this.getRightPosition(top, left)
        })
    }

    handleMouseDown = (e: MouseEvent) => {
        if (this.isDrag) {
            return
        }

        this.startPosX = e.clientX
        this.startPosY = e.clientY
        if(this.modalRef.current) {
            let rectObj = this.modalRef.current.getBoundingClientRect()
            this.top = rectObj.top
            this.left = rectObj.left
            this.isDrag = true
            this.bindEvent()
        }
    }

    handleMouseMove = (e: MouseEvent) => {
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

    getRightPosition = (top: number, left: number) => {
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

    bindEvent = (remove: boolean = false) => {
        let functionName = 'addEventListener'
        if (remove) {
            functionName = 'removeEventListener'
        }
        // todo No index signature with a parameter of type 'string' was found on type 'Document'.
        // @ts-ignore
        document[functionName]('mousemove', this.handleMouseMove, false)
        // @ts-ignore
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

    handleModalClick = (e: MouseEvent) => {
        e.stopPropagation()
    }

    render() {
        const {visible, title, width, height, mask, children} = this.props
        const {positionStyle} = this.state
        const modalRoot = document.getElementById('modal-root') as HTMLDivElement

        const contentStyle = {
            width,
            height,
        }

        return visible ? createPortal(<>
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
        </>, modalRoot) : null
    }
}
