import React from 'react'
import {hot} from 'react-hot-loader/root'
import {setConfig} from 'react-hot-loader'
import {connect} from 'react-redux'
import {requestLoginStatus} from 'actions/user'
import NavBar from 'components/NavBar'
import PlayBar from 'components/PlayBar'
import Routes from 'router'
import KEY_CODE from 'constants/keyCode'
import {getCsrfToken} from 'utils'
import ScrollToTop from 'utils/scrollToTop'

@connect()
class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        const csrfToken = getCsrfToken()
        if (csrfToken) {
            this.props.dispatch(requestLoginStatus())
        }
        // requestAnimationFrame兼容
        this.setWindowRequestAnimationFrame()
        this.setWindowCancelAnimationFrame()
        // 禁用tab键
        this.disableTabKey()
    }

    componentWillUnmount() {
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

    disableTabKey = () => {
        document.addEventListener('keydown', function (e) {
            if(e.keyCode === KEY_CODE.TAB) {
                e.preventDefault()
            }
        })
    }

    render() {
        return (
            <>
                <NavBar/>
                <ScrollToTop>
                    <Routes/>
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
