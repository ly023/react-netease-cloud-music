import React from 'react'
import {hot} from 'react-hot-loader/root'
import {setConfig} from 'react-hot-loader'
import {connect} from 'react-redux'
import {requestLoginStatus} from 'actions/user'
import NavBar from 'components/NavBar'
import PlayBar from 'components/PlayBar'
import Routes from 'router'
import {getCsrfToken} from 'utils'
import ScrollToTop from 'utils/scrollToTop'

import './App.scss'

@connect()
class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            subContentHeight: 0
        }
        this.resizeTimer = 0
        this.navBarRef = React.createRef()
    }

    componentDidMount() {
        const csrfToken = getCsrfToken()
        if (csrfToken) {
            this.props.dispatch(requestLoginStatus())
        }
        this.setSubContentHeight()
        window.addEventListener('resize', this.resize)
        // requestAnimationFrame兼容
        this.setWindowRequestAnimationFrame()
        this.setWindowCancelAnimationFrame()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
        window.clearTimeout(this.resizeTimer)
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

    setSubContentHeight = () => {
        const navBar = this.navBarRef.current
        const {clientHeight: documentClientHeight} = document.documentElement
        const subContentHeight = navBar ? documentClientHeight - navBar.clientHeight : documentClientHeight
        this.setState({
            subContentHeight
        })
    }

    resize = () => {
        if (this.resizeTimer) {
            window.clearTimeout(this.resizeTimer)
        }
        this.resizeTimer = window.setTimeout(this.setSubContentHeight, 100)
    }

    setRef = (el) => {
        this.containerRef = el
    }

    render() {
        const {subContentHeight} = this.state

        return (
            <>
                <NavBar ref={this.navBarRef}/>
                <ScrollToTop containerRef={this.containerRef}>
                    <div styleName="sub-content" style={{height: subContentHeight}} ref={this.setRef}>
                        <Routes/>
                    </div>
                </ScrollToTop>
                <PlayBar/>
            </>
        )
    }
}

setConfig({
    logLevel: 'debug',
})

export default hot(App)
