import {useState, useEffect} from 'react'
import {throttle} from 'lodash-es'
import {HEADER_HEIGHT} from 'constants'

export default function useWindowSize() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [windowHeight, setWindowHeight] = useState(window.innerHeight)
    const [contentHeight, setContentHeight] = useState(window.innerHeight - HEADER_HEIGHT)

    useEffect(() => {
        const handleResize = throttle(() => {
            const {innerWidth, innerHeight} = window
            setWindowWidth(innerWidth)
            setWindowHeight(innerHeight)
            setContentHeight(innerHeight - HEADER_HEIGHT)
        }, 200)

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return {windowWidth, windowHeight, contentHeight}
}
