/**
 * scroll to the top when the pathname changes
 */
// import {useEffect} from 'react'
// import {withRouter} from 'react-router-dom'
//
// const ScrollToTop = ({children, location: {pathname}, containerRef}) => {
//     useEffect(() => {
//         containerRef ? containerRef.scrollTop = 0 : window.scrollTop = 0
//     }, [pathname])
//
//     return children || null
// }
//
// export default withRouter(ScrollToTop)

import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'

export default function ScrollToTop({children, containerRef}) {
    const {pathname} = useLocation()

    useEffect(() => {
        // 页面回到顶部
        containerRef ? containerRef.scrollTop = 0 : window.scrollTop = 0
    }, [pathname])

    return children || null
}
