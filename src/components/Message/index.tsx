import React, {Component, createRef, CSSProperties} from 'react'
import ReactDOM from 'react-dom'

import './index.scss'

const DEFAULT_DURATION = 2

const iconType = {
    success: 'success-icon',
    error: 'error-icon',
}

interface NotificationProps {
    type: 'success' | 'error',
    content: string | React.ReactNode,
    duration: number,
    onClose: () => void
}

interface NotificationState {
    style: CSSProperties,
}

class Notification extends Component<NotificationProps, NotificationState> {

    static defaultProps = {
        type: 'success',
        content: 'success',
        duration: DEFAULT_DURATION,
        onClose() {},
    }

    componentDidMount() {
        this.setTop()
        this.startCloseTimer()
    }

    componentWillUnmount() {
        this.clearCloseTimer()
    }

    messageRef = createRef<HTMLDivElement>()
    closeTimer = 0

    setTop = () => {
        const {clientHeight} = document.documentElement
        if(this.messageRef.current) {
            const messageClientHeight = this.messageRef.current.clientHeight
            this.setState({
                style: {top: (clientHeight - messageClientHeight) / 2}
            })
        }
    }

    close = () => {
        this.clearCloseTimer()
        this.props.onClose()
    }

    startCloseTimer = () => {
        this.closeTimer = window.setTimeout(() => {
            this.close()
        }, this.props.duration * 1000)
    }

    clearCloseTimer = () => {
        window.clearTimeout(this.closeTimer)
    }

    render() {
        const {type, content} = this.props
        const {style} = this.state

        return <div styleName="wrapper" style={style} ref={this.messageRef}>
            <div styleName="notice">
                <span styleName={`icon ${iconType[type]}`}/>
                <span styleName="content">{content}</span>
            </div>
        </div>
    }
}

let wrapper: HTMLElement | null

interface MessageConfig extends NotificationProps {
    getContainer?: () => HTMLElement | Document
}

const message = {
    open: (config: MessageConfig) => {

        function destroy(div: HTMLElement) {
            if(div){
                // unmountComponentAtNode() https://reactjs.org/docs/react-dom.html#unmountcomponentatnode
                ReactDOM.unmountComponentAtNode(div)
                div.parentNode?.removeChild(div)
                wrapper = null
            }
        }

        if(wrapper) {
            destroy(wrapper)
        }

        wrapper = document.createElement('div')
        const {getContainer, ...props} = config || {}

        if (getContainer) {
            const root = getContainer()
            root.appendChild(wrapper)
        } else {
            document.body.appendChild(wrapper)
        }
        // @ts-ignore
        ReactDOM.render(<Notification {...props} onClose={()=> destroy(wrapper)}/>, wrapper)
    },
    success: (config: MessageConfig) => {
        message.open({...config, type: 'success'})
    },
    error: (config: MessageConfig) => {
        message.open({...config, type: 'error'})
    }
}

export default message
