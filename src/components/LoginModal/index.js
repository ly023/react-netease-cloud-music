import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import Modal from 'components/Modal'
import {LOGIN_MODE} from 'constants/login'
import {requestMobileLogin} from 'actions/user'
import Guide from './components/Guide'
import Mobile from './components/Mobile'

import './index.scss'

@withRouter
@connect(({user}) => ({
    user,
}))
export default class LoginModal extends React.PureComponent {

    static propTypes = {
        visible: PropTypes.bool,
        mode: PropTypes.oneOf(Object.keys(LOGIN_MODE)),
        onCancel: PropTypes.func,
    }

    static defaultProps = {
        visible: false,
        mode: LOGIN_MODE.GUIDE.TYPE
    }

    constructor(props) {
        super(props)
        this.state = {
            mode: props.mode,
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    changeMode  = (mode) => {
        this.setState({mode})
    }

    mobileLogin = (payload, success, fail) => {
        this.props.dispatch(requestMobileLogin(payload, success, fail))

    }

    afterLogin = () => {
        this.props.onCancel?.()
        this.props.history.go(0)
    }

    getRenderMode = (mode) => {
        switch (mode) {
            case LOGIN_MODE.GUIDE.TYPE:
                return <Guide {...this.props} changeMode={this.changeMode}/>
            case LOGIN_MODE.MOBILE.TYPE:
                return <Mobile {...this.props} onLogin={this.mobileLogin} afterLogin={this.afterLogin}/>
            default:
        }
    }

    getRenderModeTip = (mode) => {
        switch (mode) {
            case LOGIN_MODE.MOBILE.TYPE:
                return <div styleName="login-mode">
                    <a
                        href={null}
                        styleName="login-link-primary"
                        onClick={() => this.changeMode(LOGIN_MODE.GUIDE.TYPE)}>&lt;&nbsp;&nbsp;其他登录方式</a>
                    <a
                        href={null}
                        className="fr"
                        styleName="sign-up-guide"
                        onClick={() => this.changeMode(LOGIN_MODE.SIGN_UP.TYPE)}>没有帐号？免费注册&nbsp;&nbsp;></a>
                </div>
            case LOGIN_MODE.SIGN_UP.TYPE:
            case LOGIN_MODE.RESET_PASSWORD.TYPE:
                return <div styleName="login-mode">
                    <a
                        href={null}
                        styleName="login-link-primary"
                        onClick={() => this.changeMode(LOGIN_MODE.GUIDE.TYPE)}>&lt;&nbsp;&nbsp;返回登录</a>
                </div>
            case LOGIN_MODE.EMAIL163.TYPE:
                return <div styleName="login-mode">
                    <a
                        href={null}
                        styleName="login-link-primary"
                        onClick={() => this.changeMode(LOGIN_MODE.GUIDE.TYPE)}>&lt;&nbsp;&nbsp;其他登录方式</a>
                </div>
            default:
        }
    }

    getTitle = (mode) => {
        return LOGIN_MODE[mode] &&  LOGIN_MODE[mode].TITLE
    }

    render() {
        const {mode} = this.state

        return (
            <Modal {...this.props} title={this.getTitle(mode)}>
                {this.getRenderMode(mode)}
                {this.getRenderModeTip(mode)}
            </Modal>
        )
    }
}
// function mapStateToProps(state) {
//     return {user: state.user}
// }
//
// export default connect(mapStateToProps)(LoginPopover)
