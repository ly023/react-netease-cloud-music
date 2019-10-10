import React from 'react'
import PropTypes from 'prop-types'
import './index.scss'

const Threshold = 10

export default class BackTop extends React.Component {

    static propTypes = {
        scrollStep: PropTypes.number,
        delayInMs: PropTypes.number,
    }

    static defaultProps = {
        scrollStep: 50,
        delayInMs: 0,
    }

    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
        this.timeoutTimer = 0
        this.intervalTimer = 0
    }

    componentDidMount() {
        window.addEventListener('scroll', this.scroll)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scroll)
        clearTimeout(this.timeoutTimer)
        clearInterval(this.intervalTimer)
    }

    scroll = () => {
        if(this.timeoutTimer) {
            clearTimeout(this.timeoutTimer)
        }

        this.timeoutTimer = setTimeout(()=>{
            const pageYOffset = window.pageYOffset
            if(pageYOffset >= Threshold) {
                this.setState({
                    visible: true
                })
            } else {
                this.setState({
                    visible: false
                })
            }
        }, 150)
    }

    scrollStep = () => {
        if (window.pageYOffset === 0) {
            clearInterval(this.intervalTimer)
        }
        window.scroll(0, window.pageYOffset - this.props.scrollStep)
    }

    scrollToTop = () => {
        this.intervalTimer = setInterval(()=>{
            this.scrollStep()
        }, this.props.delayInMs)
    }

    render() {
        let {visible} = this.state

        return (
            <div className={visible ? 'block' : 'hide'} styleName='back' onClick={this.scrollToTop}>
                回到顶部
            </div>
        )
    }
}
