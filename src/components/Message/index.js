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
        type: 'success',
        content: 'success',
        duration: DEFAULT_DURATION,
        onClose() {},
    }

    constructor(props) {
        super(props)
        this.state = {
            style: {}
        }
        this.messageRef = React.createRef()
    }

    componentDidMount() {
        this.setTop()
        this.startCloseTimer()
    }

    componentWillUnmount() {
        this.clearCloseTimer()
    }

    setTop = () => {
        const {clientHeight} = document.documentElement
        const messageClientHeight = this.messageRef.current.clientHeight
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

        return <div styleName="wrapper" style={style} ref={this.messageRef}>
            <div styleName="notice">
                <span styleName={`icon ${iconType[type]}`}/>
                <span styleName="content">{content}</span>
            </div>
        </div>
    }
}

let wrapper

const message = {
    open: (config) => {

        function destroy(div) {
            if(div){
                // unmountComponentAtNode() https://reactjs.org/docs/react-dom.html#unmountcomponentatnode
                ReactDOM.unmountComponentAtNode(div)
                div.parentNode.removeChild(div)
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

        ReactDOM.render(<Notification {...props} onClose={()=> destroy(wrapper)}/>, wrapper)
    },
    success: (config) => {
        message.open({...config, type: 'success'})
    },
    error: (config) => {
        message.open({...config, type: 'error'})
    }
}

export default message
