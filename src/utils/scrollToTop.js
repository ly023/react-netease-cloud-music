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

const EXCLUDE_REGEX = [
    /^\/discover\/album/,
    /^\/discover\/toplist/,
    /\/artist\/\d+\?\S+/,
]

export default function ScrollToTop({children}) {
    const {pathname, search} = useLocation()

    useEffect(() => {
        const match = EXCLUDE_REGEX.find(reg => reg.test(pathname + search))
        if (!match) {
            window.scrollTo(0, 0)
        }
    }, [pathname, search])

    return children || null
}
