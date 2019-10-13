import React from 'react'
import {connect} from 'react-redux'
import {withRouter, NavLink, Link} from 'react-router-dom'
import LoginModal from 'components/LoginModal'
import {LOGIN_MODE} from 'constants/login'
import emitter from 'utils/eventEmitter'
import styles from './index.scss'

@withRouter
@connect(({user}) => ({
    user,
}))
class NavBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            style: {},
            loginVisible: false,
            loginMode: LOGIN_MODE.GUIDE.TYPE
        }
    }

    componentDidMount() {
        this.setNavHeight()
        emitter.on('login', (mode = LOGIN_MODE.GUIDE.TYPE) => {
            this.handleLogin(mode)
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            this.setNavHeight()
        }
    }

    setNavHeight = () => {
        const navHeight = parseInt(window.getComputedStyle(this.navRef, null).getPropertyValue('height'), 10)
        if (navHeight) {
            this.setState({
                style: {height: navHeight}
            })
        }
    }

    handleLogin = (mode) => {
        this.setState({
            loginVisible: true,
            loginMode: mode
        })
    }

    handleCancel = () => {
        this.setState({
            loginVisible: false,
        })
    }

    handleEnterKey = (e) => {
        const keyCode = e.nativeEvent.which || e.nativeEvent.keyCode
        if(keyCode === 13){
        }
    }

    getRenderSubNav = () => {
        const pathname = this.props.history.location.pathname

        if (pathname.startsWith('/discover') || pathname.startsWith('/song')) {
            return <ul styleName="sub-nav-list">
                <li styleName="sub-nav-item">
                    <NavLink to="/discover" exact={true} activeClassName={styles["sub-nav-active"]}><em>推荐</em></NavLink>
                </li>
                <li styleName="sub-nav-item">
                    <NavLink to="/discover/toplist" activeClassName={styles["sub-nav-active"]}><em>排行榜</em></NavLink>
                </li>
                <li styleName="sub-nav-item">
                    <NavLink to="/discover/2" activeClassName={styles["sub-nav-active"]}><em>歌单<i/></em></NavLink>
                </li>
                <li styleName="sub-nav-item">
                    <NavLink to="/discover/3" activeClassName={styles["sub-nav-active"]}><em>主播电台</em></NavLink>
                </li>
                <li styleName="sub-nav-item">
                    <NavLink to="/discover/4" activeClassName={styles["sub-nav-active"]}><em>歌手</em></NavLink>
                </li>
                <li styleName="sub-nav-item">
                    <NavLink to="/discover/5" activeClassName={styles["sub-nav-active"]}><em>新碟上架</em></NavLink>
                </li>
            </ul>
        }
        return null
    }

    setNavRef = (el) => {
        this.navRef = el
    }

    getNavBarHeight = () => {
        return this.state.style.height
    }

    render() {
        const {style, loginVisible, loginMode} = this.state
        const {user: {isLogin, userInfo}} = this.props

        // todo 未读通知数
        const unreadCount = 0

        return (
            <div ref={this.props.innerRef}>
                <div style={style}>
                    <div styleName="wrapper" ref={this.setNavRef}>
                        <div styleName="cont">
                            <a href='/' styleName="logo">
                                <span styleName="logo-text">网易云音乐</span>
                            </a>
                            <ul styleName="link-list">
                                <li styleName="link-item">
                                    <NavLink to='/discover' styleName="link" activeClassName={styles["link-active"]}>
                                        发现音乐
                                    </NavLink>
                                </li>
                                <li styleName="link-item">
                                    <NavLink to='/2' styleName="link" activeClassName={styles["link-active"]}>
                                        我的音乐
                                    </NavLink>
                                </li>
                                <li styleName="link-item">
                                    <NavLink to='/friend' styleName="link" activeClassName={styles["link-active"]}>
                                        朋友
                                    </NavLink>
                                </li>
                                <li styleName="link-item">
                                    <NavLink to='/4' styleName="link" activeClassName={styles["link-active"]}>
                                        商城
                                    </NavLink>
                                </li>
                                <li styleName="link-item">
                                    <NavLink to='/5' styleName="link" activeClassName={styles["link-active"]}>
                                        音乐人
                                    </NavLink>
                                </li>
                                <li styleName="link-item">
                                    <NavLink to='/download' styleName="link" activeClassName={styles["link-active"]}>
                                        下载客户端<i styleName="tag-hot"/>
                                    </NavLink>
                                </li>
                            </ul>
                            {
                                isLogin
                                    ? <div styleName="login">
                                        <div styleName="login-status avatar">
                                            <img src={userInfo?.profile?.avatarUrl} alt="头像"/><i styleName="arrow"/>
                                            {unreadCount ? <i styleName="login-badge">{unreadCount}</i> : null}
                                        </div>
                                        <div styleName="login-cont">
                                            <i styleName="arrow"/>
                                            <ul styleName="login-list">
                                                <li styleName="login-item">
                                                    <i styleName="login-icon login-icon-home"/>
                                                    <Link to={`/user/home/${userInfo?.profile?.userId}`} href={null}>我的主页</Link>
                                                </li>
                                                <li styleName="login-item">
                                                    <i styleName="login-icon login-icon-msg"/>
                                                    <a href={null}>我的消息{unreadCount ? <span styleName="login-badge">{unreadCount}</span> : null}</a>
                                                </li>
                                                <li styleName="login-item">
                                                    <i styleName="login-icon login-icon-level"/><a href={null}>我的等级</a>
                                                </li>
                                                <li styleName="login-item">
                                                    <i styleName="login-icon login-icon-member"/><a href={null}>VIP会员</a>
                                                </li>
                                            </ul>
                                            <ul styleName="login-list">
                                                <li styleName="login-item">
                                                    <i styleName="login-icon login-icon-setting"/><a href={null}>个人设置</a>
                                                </li>
                                                <li styleName="login-item">
                                                    <i styleName="login-icon login-icon-verify"/><a href={null}>实名认证</a>
                                                </li>
                                            </ul>
                                            <ul styleName="login-list">
                                                <li styleName="login-item">
                                                    <i styleName="login-icon login-icon-logout"/>退出
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    : <div styleName="login">
                                        <span className="link" styleName="login-status login-text" onClick={() => this.handleLogin(LOGIN_MODE.GUIDE.TYPE)}>登录<i styleName="arrow"/></span>
                                        <div styleName="login-cont">
                                            <i styleName="arrow"/>
                                            <ul styleName="login-list">
                                                <li styleName="login-item" onClick={() => this.handleLogin(LOGIN_MODE.MOBILE.TYPE)}>手机号登录</li>
                                                <li styleName="login-item"><a href={null}>微信登录</a></li>
                                                <li styleName="login-item"><a href={null}>QQ登录</a></li>
                                                <li styleName="login-item"><a href={null}>新浪微博登录</a></li>
                                                <li styleName="login-item" onClick={() => this.handleLogin(LOGIN_MODE.EMAIL163.TYPE)}>网易邮箱账号登录</li>
                                            </ul>
                                        </div>
                                    </div>
                            }
                            <a href='https://music.163.com/login?targetUrl=%2Fst/creator' target='_blank' styleName="video-creator">创作者中心</a>
                            <div styleName="search">
                                <div styleName="search-cont">
                                    <input
                                        placeholder="音乐/视频/电台/用户"
                                        styleName="input"
                                        onKeyPress={this.handleEnterKey}
                                    />
                                </div>
                            </div>
                        </div>
                        <div styleName="sub-nav-wrapper">
                            <div styleName="sub-nav">
                                {this.getRenderSubNav()}
                            </div>
                        </div>
                    </div>
                </div>
                { isLogin ? null : <LoginModal visible={loginVisible} mode={loginMode} onCancel={this.handleCancel}/>}
            </div>
        )
    }
}

export default React.forwardRef((props, ref) => <NavBar innerRef={ref} {...props} />)
