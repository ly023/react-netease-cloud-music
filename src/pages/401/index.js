/**
 * 401
 */
import Page from 'components/Page'
import './index.scss'

const Forbidden = () => (
    <Page showBackTop={false}>
        <div styleName="wrapper">
            <div styleName="forbidden">
                <i styleName="icon"/>
                <p styleName="note">无权限访问</p>
            </div>
        </div>
    </Page>
)

export default Forbidden
