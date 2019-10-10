import React from 'react'
import PropTypes from 'prop-types'
import {LOGIN_MODE} from 'constants/login'
import '../../index.scss'
import './index.scss'


export default class Guide extends React.Component {

    static propTypes = {
        changeMode: PropTypes.func,
    }

    static defaultProps = {
    }

    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    changeMode  = (mode) => {
        this.props.changeMode(mode)
    }

    render() {

        return (
            <div className="clearfix">
                <div className="fl" styleName="login-guide">
                    <div styleName="login-guide-platform"/>
                    <a href={null} styleName="login-btn" onClick={() => this.changeMode(LOGIN_MODE.MOBILE.TYPE)}><i>手机号登录</i></a>
                    <a href={null} styleName="sign-up-btn" onClick={() => this.changeMode(LOGIN_MODE.SIGN_UP.TYPE)}><i>注册</i></a>
                </div>
                <ul styleName="login-guide-other">
                    <li styleName="login-guide-item">
                        <a
                            href="http://music.163.com/api/sns/authorize?snsType=10&amp;clientType=web2&amp;callbackType=Login&amp;forcelogin=true"
                            target="_blank"><i styleName="login-guide-item-wechat"/>微信登录</a>
                    </li>
                    <li styleName="login-guide-item">
                        <a
                            href="http://music.163.com/api/sns/authorize?snsType=5&amp;clientType=web2&amp;callbackType=Login&amp;forcelogin=true"
                            target="_blank"><i styleName="login-guide-item-qq"/>QQ登录</a>
                    </li>
                    <li styleName="login-guide-item">
                        <a
                            href="http://music.163.com/api/sns/authorize?snsType=2&amp;clientType=web2&amp;callbackType=Login&amp;forcelogin=true"
                            target="_blank"><i styleName="login-guide-item-blog"/>微博登录</a>
                    </li>
                    <li styleName="login-guide-item">
                        <a href={null} onClick={() => this.changeMode(LOGIN_MODE.EMAIL163.TYPE)}>
                            <i styleName="login-guide-item-email"/>网易邮箱帐号登录
                        </a>
                    </li>
                </ul>
            </div>
        )
    }
}
