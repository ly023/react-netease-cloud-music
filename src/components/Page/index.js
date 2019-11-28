import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {Helmet} from 'react-helmet'
import NProgress from 'nprogress'
import {DEFAULT_DOCUMENT_TITLE} from 'constants'
import FooterBar from 'components/FooterBar'
import BackTop from 'components/BackTop'

import 'nprogress/nprogress.css'
import './index.scss'

const progress = NProgress.configure({
    easing: 'ease',  // 动画方式
    speed: 500,  // 递增进度条的速度
    showSpinner: false, // 是否显示加载ico
    minimum: 0.3 // 初始化时的最小百分比
})

progress.start()

function Page(props) {
    const {children, title, showFooter, showBackTop} = props

    useEffect(() => {
        progress.done()
        return () => {
            progress.remove()
        }
    }, [])

    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            {children}
            {showFooter ? <FooterBar/> : null}
            {showBackTop ? <BackTop/> : null}
        </>
    )
}

Page.propTypes = {
    title: PropTypes.string,
    showFooter: PropTypes.bool,
    showBackTop: PropTypes.bool,
}

Page.defaultProps = {
    title: DEFAULT_DOCUMENT_TITLE,
    showFooter: true,
    showBackTop: true
}

export default Page
