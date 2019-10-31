import React from 'react'
import Routes from 'router'
import ScrollToTop from './components/scrollToTop'

import './index.scss'

export default class SubContent extends React.Component {

    componentDidMount() {
        // requestAnimationFrame兼容
        this.setWindowRequestAnimationFrame()
        this.setWindowCancelAnimationFrame()
    }

    setWindowRequestAnimationFrame = () => {
        window.requestAnimationFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            function (callback) {
                // 为了使setTimteout的尽可能的接近每秒60帧的效果
                window.setTimeout(callback, 1000 / 60)
            }
    }

    setWindowCancelAnimationFrame = () => {
        window.cancelAnimationFrame = window.cancelAnimationFrame ||
            Window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.msCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            function (id) {
                // 为了使setTimteout的尽可能的接近每秒60帧的效果
                window.clearTimeout(id)
            }
    }

    setRef = (el) => {
        this.containerRef = el
    }

    render() {

        return (
            <ScrollToTop containerRef={this.containerRef}>
                <div styleName="sub-content" style={{height: this.props.height}} ref={this.setRef}>
                    <Routes/>
                </div>
            </ScrollToTop>
        )
    }
}
