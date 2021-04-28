import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import './index.scss'

const Threshold = 10

let timeoutTimer = 0
let intervalTimer = 0

function BackTop(props) {
    const [visible, setVisible] = useState(false)
    const {step = 50, delayInMs = 0} = props

    const scrollStep = () => {
        if (window.pageYOffset === 0) {
            clearInterval(intervalTimer)
        }
        window.scroll(0, window.pageYOffset - step)
    }

    const scrollToTop = () => {
        intervalTimer = setInterval(() => {
            scrollStep()
        }, delayInMs)
    }

    useEffect(() => {
        const scroll = () => {
            if (timeoutTimer) {
                clearTimeout(timeoutTimer)
            }

            timeoutTimer = window.setTimeout(() => {
                const pageYOffset = window.pageYOffset
                if (pageYOffset >= Threshold) {
                    setVisible(true)
                } else {
                    setVisible(false)
                }
            }, 150)
        }

        window.addEventListener('scroll', scroll)

        return () => {
            clearTimeout(timeoutTimer)
            clearInterval(intervalTimer)
            window.removeEventListener('scroll', scroll)
        }
    }, [])

    return <div className={visible ? 'block' : 'hide'} styleName='back' onClick={scrollToTop}>
        回到顶部
    </div>
}

BackTop.propTypes = {
    step: PropTypes.number,
    delayInMs: PropTypes.number,
}

export default BackTop
