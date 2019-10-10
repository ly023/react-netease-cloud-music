/**
 * 404
 */
import React from 'react'
import Page from 'components/Page'
import './index.scss'

const NotFound = () => (
    <Page showBackTop={false}>
        <div styleName="not-found-wrapper">
            <div styleName="not-found">
                <i styleName="not-found-icon"/>
                <p styleName="not-found-note">很抱歉，你要查找的网页找不到</p>
            </div>
        </div>
    </Page>
)

export default NotFound
