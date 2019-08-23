import React from 'react'
import Page from 'components/Page'
import './index.scss'

export default class NotFound extends React.PureComponent {

    render() {
        return (
            <Page showBackTop={false}>
                <div styleName="not-found">
                    <div styleName="not-found-wrapper">
                        <i styleName="not-found-icon"/>
                        <p styleName="not-found-note">很抱歉，你要查找的网页找不到</p>
                    </div>
                </div>
            </Page>
        )
    }
}
