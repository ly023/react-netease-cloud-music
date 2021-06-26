/**
 * 404
 */
import Page from 'components/Page'
import './index.scss'

const NotFound = () => (
    <Page showBackTop={false}>
        <div styleName="wrapper">
            <div styleName="not-found">
                <i styleName="icon"/>
                <p styleName="note">很抱歉，你要查找的网页找不到</p>
            </div>
        </div>
    </Page>
)

export default NotFound
