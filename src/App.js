import {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import {requestLoginStatus} from 'actions/user'
import NavBar from 'components/NavBar'
import PlayBar from 'components/PlayBar'
import Routes from 'router'
import KEY_CODE from 'constants/keyCode'
import {getCsrfToken} from 'utils'
import ScrollToTop from 'utils/scrollToTop'
import './App.scss'

dayjs.locale('zh-cn')

function App() {
    const dispatch = useDispatch()

    useEffect(() => {
        const setWindowRequestAnimationFrame = () => {
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

        const setWindowCancelAnimationFrame = () => {
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

        const disableTabKey = () => {
            document.addEventListener('keydown', function (e) {
                if (e.keyCode === KEY_CODE.TAB) {
                    e.preventDefault()
                }
            })
        }

        const csrfToken = getCsrfToken()
        if (csrfToken) {
            dispatch(requestLoginStatus())
        }
        // requestAnimationFrame兼容
        setWindowRequestAnimationFrame()
        setWindowCancelAnimationFrame()
        // 禁用tab键
        disableTabKey()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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

export default App


