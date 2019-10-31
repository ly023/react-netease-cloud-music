import React from 'react'
import PropTypes from 'prop-types'
import NProgress from 'nprogress'
import FooterBar from 'components/FooterBar'
import BackTop from 'components/BackTop'

import 'nprogress/nprogress.css'
import './index.scss'

export default class Page extends React.Component {

    static propTypes = {
        showFooter: PropTypes.bool,
        showBackTop: PropTypes.bool,
    }

    static defaultProps = {
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
        const {children, showFooter, showBackTop} = this.props

        return (
            <>
                {children}
                {showFooter ? <FooterBar/> : null}
                {showBackTop ? <BackTop/> : null}
            </>
        )
    }
}
