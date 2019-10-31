import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

import './index.scss'

const DEFAULT_DURATION = 2

const iconType = {
    success: 'success-icon',
    error: 'error-icon',
}

class Notification extends React.Component {

    static propTypes = {
        type: PropTypes.oneOf(['success', 'error']),
        content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        duration: PropTypes.number,
        onClose: PropTypes.func
    }

    static defaultProps = {
        type: 'info',
        duration: DEFAULT_DURATION,
        onClose() {
        },
    }

    constructor(props) {
        super(props)
        this.state = {
            style: {}
        }
    }

    componentDidMount() {
        this.setTop()
        this.startCloseTimer()
    }

    componentWillUnmount() {
        this.clearCloseTimer()
    }

    setRef = (el) => {
        this.messageRef = el
    }

    setTop = () => {
        const {clientHeight} = document.documentElement
        const messageClientHeight = this.messageRef.clientHeight
        this.setState({
            style: {top: (clientHeight - messageClientHeight) / 2}
        })
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

        return <div styleName="wrapper" style={style} ref={this.setRef}>
            <div styleName="notice">
                <span styleName={`icon ${iconType[type]}`}/>
                <span styleName="content">{content}</span>
            </div>
        </div>
    }
}

const message = {
    open: (config) => {
        const div = document.createElement('div')
        const {getContainer, ...props} = config || {}

        if (getContainer) {
            const root = getContainer()
            root.appendChild(div)
        } else {
            document.body.appendChild(div)
        }

        function onClose() {
            // unmountComponentAtNode() https://reactjs.org/docs/react-dom.html#unmountcomponentatnode
            ReactDOM.unmountComponentAtNode(div)
            div.parentNode.removeChild(div)
        }
        ReactDOM.render(<Notification {...props} onClose={onClose}/>, div)
    },
    success: (config) => {
        message.open({...config, type: 'success'})
    },
    error: (config) => {
        message.open({...config, type: 'error'})
    }
}

export default message
