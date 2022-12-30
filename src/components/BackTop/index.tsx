import {useState, useEffect} from 'react'
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop'
import './index.scss'

const Threshold = 10

let timeoutTimer = 0
let intervalTimer = 0

interface BackTopProps {
    step?: number,
    delayInMs?: number,
}

function BackTop(props: BackTopProps) {
    const [visible, setVisible] = useState(false)
    const {step = 50, delayInMs = 0} = props

    const scrollStep = () => {
        if (window.pageYOffset === 0) {
            window.clearInterval(intervalTimer)
        }
        window.scroll(0, window.pageYOffset - step)
    }

    const scrollToTop = () => {
        intervalTimer = window.setInterval(() => {
            scrollStep()
        }, delayInMs)
    }

    useEffect(() => {
        const scroll = () => {
            if (timeoutTimer) {
                window.clearTimeout(timeoutTimer)
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
            window.clearTimeout(timeoutTimer)
            window.clearInterval(intervalTimer)
            window.removeEventListener('scroll', scroll)
        }
    }, [])

    return <div className={visible ? 'block' : 'hide'} styleName='back' onClick={scrollToTop} title="回到顶部">
        <VerticalAlignTopIcon styleName="back-icon" />
    </div>
}

export default BackTop
