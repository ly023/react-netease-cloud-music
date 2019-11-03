import React from 'react'
import PropTypes from 'prop-types'
import {Helmet} from 'react-helmet'
import NProgress from 'nprogress'
import {DEFAULT_DOCUMENT_TITLE} from 'constants'
import FooterBar from 'components/FooterBar'
import BackTop from 'components/BackTop'

import 'nprogress/nprogress.css'
import './index.scss'

export default class Page extends React.Component {

    static propTypes = {
        title: PropTypes.string,
        showFooter: PropTypes.bool,
        showBackTop: PropTypes.bool,
    }

    static defaultProps = {
        title: DEFAULT_DOCUMENT_TITLE,
        showFooter: true,
        showBackTop: true
    }

    constructor(props) {
        super(props)
        this.progress = this.configNProgress()
        this.progress.start()
    }

    componentDidMount() {
        this.progress.done()
    }

    componentWillUnmount() {
        this.progress.remove()
    }

    configNProgress = () => {
        return NProgress.configure({
            easing: 'ease',  // 动画方式
            speed: 500,  // 递增进度条的速度
            showSpinner: false, // 是否显示加载ico
            minimum: 0.3 // 初始化时的最小百分比
        })
    }

    render() {
        const {children, title, showFooter, showBackTop} = this.props

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
}
