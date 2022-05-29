import {useState, useEffect, useRef, cloneElement, Children, memo} from 'react'
import {useLocation} from 'react-router-dom'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {requestCategory} from 'services/playlist'
import {click} from 'utils'

import './index.scss'

const PLAYLIST_CATEGORY_ID = 'playlist-category'

function Categories(props) {
    const {children, category = '全部'} = props
    const isMounted = useRef(false)
    const {pathname, search} = useLocation()
    const [categories, setCategories] = useState({})
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setVisible(false)
    }, [pathname, search])

    useEffect(() => {
        isMounted.current = true

        const handleDocumentClick = (e) => {
            click(e, PLAYLIST_CATEGORY_ID, () => {
                setVisible(false)
            })
        }

        const formatResData = (data = {}) => {
            const keys = data.categories || {}
            const sub = data.sub || []
            let categoryObj = {}
            sub.forEach((item) => {
                const {category} = item
                if (!categoryObj[category]) {
                    categoryObj[category] = {
                        text: keys[category],
                        sub: []
                    }
                }
                categoryObj[category].sub.push(item)
            })
            return categoryObj
        }

        const fetchCategories = async () => {
            const res = await requestCategory()
            if (isMounted.current) {
                setCategories(formatResData(res))
            }
        }

        document.addEventListener('click', handleDocumentClick)

        fetchCategories()

        return () => {
            isMounted.current = false
            document.removeEventListener('click', handleDocumentClick)
        }
    }, [])

    const toggle = () => {
        setVisible(!visible)
    }

    return (
        <div id={PLAYLIST_CATEGORY_ID} styleName="wrapper">
            {
                cloneElement(Children.only(children), {
                    onClick: toggle
                })
            }
            <div styleName="arrow" className={visible ? "block" : "hide"}/>
            <div styleName="category-panel" className={visible ? "block" : "hide"}>
                <div styleName="all">
                    <Link to="/discover/playlist">全部风格</Link>
                </div>
                <div>
                    {
                        Object.keys(categories).map((key, index) => {
                            const {text, sub} = categories[key]
                            return <div key={key} styleName="category">
                                <div styleName={`category-name category-${key}`}><i/><span>{text}</span></div>
                                <div styleName={`sub-categories ${index === Object.keys(categories).length - 1 ? 'last' : ''}`}>
                                    {
                                        sub.map((subCategory, i) => {
                                            const {name} = subCategory
                                            return <span key={`${name}-${i}`} styleName={`sub ${category === name ? 'active' : ''}`}>
                                                <Link
                                                    to={`/discover/playlist?cat=${window.encodeURIComponent(name)}&order=hot`}>{name}</Link>
                                                {i !== sub.length - 1 ? <span styleName="line">|</span> : null}
                                            </span>
                                        })
                                    }
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    )
}

Categories.propTypes = {
    category: PropTypes.string,
}

export default memo(Categories)
