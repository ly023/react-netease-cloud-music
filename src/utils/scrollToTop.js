/**
 * scroll to the top when the pathname changes
 */
// import {useEffect} from 'react'
// import {withRouter} from 'react-router-dom'
//
// const ScrollToTop = ({children, location: {pathname}}) => {
//     useEffect(() => {
//        window.scrollTo(0, 0)
//     }, [pathname])
//
//     return children || null
// }
//
// export default withRouter(ScrollToTop)

import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'

const EXCLUDE = ['/discover/album', '/discover/toplist']

export default function ScrollToTop({children}) {
    const {pathname, search} = useLocation()

    useEffect(() => {
        if (!EXCLUDE.includes(pathname)) {
            window.scrollTo(0, 0)
        }
    }, [pathname, search])

    return children || null
}
