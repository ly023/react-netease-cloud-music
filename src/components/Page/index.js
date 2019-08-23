import React from 'react'
import PropTypes from 'prop-types'
import FooterBar from 'components/FooterBar'
import BackTop from 'components/BackTop'

export default class Page extends React.Component {

    static propTypes = {
        showFooter: PropTypes.bool,
        showBackTop: PropTypes.bool,
    }

    static defaultProps = {
        showFooter: true,
        showBackTop: true
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
