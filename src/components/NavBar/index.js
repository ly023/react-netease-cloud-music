import React from 'react'
import {connect} from 'react-redux'
import {withRouter, NavLink, Link} from 'react-router-dom'
import emitter from 'utils/eventEmitter'
import {LOGIN_MODE} from 'constants/login'
import LoginModal from 'components/LoginModal'
import {setNavHeight} from 'actions/base'
import {requestLogout} from 'services/user'
import {getThumbnail} from 'utils'
import SearchBar from './components/SearchBar'

import styles from './index.scss'

@withRouter
@connect(({user}) => ({
    isLogin: user.isLogin,
    userInfo: user.userInfo,
}))
export default class NavBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            style: {},
            loginVisible: false,
            loginMode: LOGIN_MODE.GUIDE.TYPE
        }
        this.navRef = React.createRef()
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
        const navHeight = this.navRef.current.offsetHeight
        if (navHeight) {
            this.setState({
                style: {height: navHeight}
            })
            this.props.dispatch(setNavHeight({navHeight}))
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

    handleLogout = () => {
        requestLogout()
            .then((res) => {
                if (res.code === 200) {
                    window.location.href = '/'
                }
            })
    }

    isBelongToDiscover = () => {
        const {pathname} = this.props.history.location
        return pathname.startsWith('/discover')
            || pathname.startsWith('/song')
            || pathname.startsWith('/playlist')
            || pathname.startsWith('/album')
            || pathname.startsWith('/artist')
    }

    getRenderSubNav = () => {
        if (this.isBelongToDiscover()) {
            return <ul styleName="sub-nav-list">
                <li styleName="sub-nav-item">
                    <NavLink
                        to="/discover"
                        exact={true}
                        activeClassName={styles["sub-nav-active"]}
                    >
                        <em>推荐</em>
                    </NavLink>
                </li>
                <li styleName="sub-nav-item">
                    <NavLink to="/discover/toplist" activeClassName={styles["sub-nav-active"]}><em>排行榜</em></NavLink>
                </li>
                <li styleName="sub-nav-item">
                    <NavLink to="/discover/playlist"
                             activeClassName={styles["sub-nav-active"]}><em>歌单<i/></em></NavLink>
                </li>
                <li styleName="sub-nav-item">
                    <NavLink to="/discover/radio" activeClassName={styles["sub-nav-active"]}><em>主播电台</em></NavLink>
                </li>
                <li styleName="sub-nav-item">
                    <NavLink to="/discover/4" activeClassName={styles["sub-nav-active"]}><em>歌手</em></NavLink>
                </li>
                <li styleName="sub-nav-item">
                    <NavLink to="/discover/album" activeClassName={styles["sub-nav-active"]}><em>新碟上架</em></NavLink>
                </li>
            </ul>
        }
        return null
    }

    render() {
        const {style, loginVisible, loginMode} = this.state
        const {isLogin, userInfo} = this.props

        // todo 未读通知数
        const unreadCount = 0

        return (
            <>
                <div style={style}>
                    <div styleName="wrapper" ref={this.navRef}>
                        <div styleName="cont">
                            <a href='/' styleName="logo">
                                <span styleName="logo-text">网易云音乐</span>
                            </a>
                            <ul styleName="link-list">
                                <li styleName="link-item">
                                    <NavLink
                                        to='/discover'
                                        activeClassName={styles["link-active"]}
                                        styleName={`link${this.isBelongToDiscover() ? " link-active" : ""}`}
                                    >
                                        发现音乐
                                    </NavLink>
                                </li>
                                <li styleName="link-item">
                                    <NavLink to='/my/music' styleName="link" activeClassName={styles["link-active"]}>
                                        我的音乐
                                    </NavLink>
                                </li>
                                <li styleName="link-item">
                                    <NavLink to='/friend' styleName="link" activeClassName={styles["link-active"]}>
                                        朋友
                                    </NavLink>
                                </li>
                                <li styleName="link-item">
                                    <a href="https://music.163.com/store/product" target="_blank" rel="noreferrer" styleName="link">
                                        商城
                                    </a>
                                </li>
                                <li styleName="link-item">
                                    <a href="https://music.163.com/st/musician" target="_blank" rel="noreferrer" styleName="link">
                                        音乐人
                                    </a>
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
                                            <img src={getThumbnail(userInfo?.avatarUrl, 30)} alt="头像"/>
                                            {unreadCount ? <i styleName="login-badge">{unreadCount}</i> : null}
                                        </div>
                                        <div styleName="login-cont">
                                            <i styleName="arrow"/>
                                            <ul styleName="login-list">
                                                <li styleName="login-item">
                                                    <i styleName="login-icon login-icon-home"/>
                                                    <Link to={`/user/home/${userInfo?.userId}`} href={null}>我的主页</Link>
                                                </li>
                                                <li styleName="login-item">
                                                    <i styleName="login-icon login-icon-msg"/>
                                                    <a href={null}>我的消息{unreadCount ?
                                                        <span styleName="login-badge">{unreadCount}</span> : null}</a>
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
                                                <li styleName="login-item" onClick={this.handleLogout}>
                                                    <i styleName="login-icon login-icon-logout"/>退出
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    : <div styleName="login">
                                        <span className="link" styleName="login-status login-text"
                                              onClick={() => this.handleLogin(LOGIN_MODE.GUIDE.TYPE)}>登录</span>
                                        <div styleName="login-cont">
                                            <i styleName="arrow"/>
                                            <ul styleName="login-list">
                                                <li styleName="login-item"
                                                    onClick={() => this.handleLogin(LOGIN_MODE.MOBILE.TYPE)}>手机号登录
                                                </li>
                                                <li styleName="login-item"><a href={null}>微信登录</a></li>
                                                <li styleName="login-item"><a href={null}>QQ登录</a></li>
                                                <li styleName="login-item"><a href={null}>新浪微博登录</a></li>
                                                <li styleName="login-item"
                                                    onClick={() => this.handleLogin(LOGIN_MODE.EMAIL163.TYPE)}>网易邮箱账号登录
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                            }
                            <a href='https://music.163.com/login?targetUrl=%2Fst/creator' target='_blank'
                               styleName="video-creator">创作者中心</a>
                            <SearchBar/>
                        </div>
                        <div styleName="sub-nav-wrapper">
                            <div styleName="sub-nav">
                                {this.getRenderSubNav()}
                            </div>
                        </div>
                    </div>
                </div>
                {isLogin ? null : <LoginModal visible={loginVisible} mode={loginMode} onCancel={this.handleCancel}/>}
            </>
        )
    }
}

