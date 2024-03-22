import { Component, createRef } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PersonIcon from '@mui/icons-material/Person'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import SettingsIcon from '@mui/icons-material/Settings'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import withRouter from 'hoc/withRouter'
import NavLink from 'components/NavLink'
import pubsub from 'utils/pubsub'
import { LOGIN_MODE } from 'constants/login'
import LoginModal from 'components/business/LoginModal'
import { setNavHeight } from 'actions/base'
import { requestLogout } from 'services/user'
import { getThumbnail, deleteCookie } from 'utils'
import SearchBar from './components/SearchBar'

import styles from './index.scss'

const MAX_HEIGHT = 103

@withRouter
@connect(({ user }) => ({
  isLogin: user.isLogin,
  userInfo: user.userInfo
}))
export default class NavBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      style: {},
      loginVisible: false,
      loginMode: LOGIN_MODE.GUIDE.TYPE
    }
    this.navRef = createRef()
  }

  componentDidMount() {
    this.setNavHeight()
    pubsub.subscribe('login', (msg, mode = LOGIN_MODE.GUIDE.TYPE) => {
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
        style: { height: Math.min(navHeight, MAX_HEIGHT) }
      })
      this.props.dispatch(setNavHeight({ navHeight }))
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
      loginVisible: false
    })
  }

  handleLogout = () => {
    requestLogout().then(() => {
      // 删除自定义的cookie
      deleteCookie('CSRF')
      window.location.href = '/'
    })
  }

  isBelongToDiscover = () => {
    const { pathname } = this.props.location
    return (
      pathname.startsWith('/discover') ||
      pathname.startsWith('/song') ||
      pathname.startsWith('/playlist') ||
      pathname.startsWith('/album') ||
      pathname.startsWith('/mv') ||
      pathname.startsWith('/video') ||
      pathname.startsWith('/artist') ||
      pathname.startsWith('/radio') ||
      pathname.startsWith('/program')
    )
  }

  getRenderSubNav = () => {
    if (this.isBelongToDiscover()) {
      return (
        <ul className={styles['sub-nav-list']}>
          <li className={styles['sub-nav-item']}>
            <NavLink
              to="/discover"
              end
              activeClassName={styles['sub-nav-active']}
            >
              <em>推荐</em>
            </NavLink>
          </li>
          <li className={styles['sub-nav-item']}>
            <NavLink
              to="/discover/toplist"
              activeClassName={styles['sub-nav-active']}
            >
              <em>排行榜</em>
            </NavLink>
          </li>
          <li className={styles['sub-nav-item']}>
            <NavLink
              to="/discover/playlist"
              activeClassName={styles['sub-nav-active']}
            >
              <em>
                歌单
                <i />
              </em>
            </NavLink>
          </li>
          <li className={styles['sub-nav-item']}>
            <NavLink
              to="/discover/radio"
              activeClassName={styles['sub-nav-active']}
            >
              <em>主播电台</em>
            </NavLink>
          </li>
          <li className={styles['sub-nav-item']}>
            <NavLink
              to="/discover/4"
              activeClassName={styles['sub-nav-active']}
            >
              <em>歌手</em>
            </NavLink>
          </li>
          <li className={styles['sub-nav-item']}>
            <NavLink
              to="/discover/album"
              activeClassName={styles['sub-nav-active']}
            >
              <em>新碟上架</em>
            </NavLink>
          </li>
        </ul>
      )
    }
    return null
  }

  render() {
    const { style, loginVisible, loginMode } = this.state
    const { isLogin, userInfo } = this.props

    // todo 未读通知数
    const unreadCount = 0

    return (
      <>
        <div style={style}>
          <div className={styles.wrapper} ref={this.navRef}>
            <div className={styles.cont}>
              <Link to="/" className={styles.logo}>
                <span className={styles['logo-text']}>网易云音乐</span>
              </Link>
              <ul className={styles['link-list']}>
                <li className={styles['link-item']}>
                  <NavLink
                    to="/discover"
                    className={styles.link}
                    activeClassName={styles['link-active']}
                  >
                    发现音乐
                  </NavLink>
                </li>
                <li className={styles['link-item']}>
                  <NavLink
                    to="/my/music"
                    className={styles.link}
                    activeClassName={styles['link-active']}
                  >
                    我的音乐
                  </NavLink>
                </li>
                <li className={styles['link-item']}>
                  <NavLink
                    to="/friend"
                    className={styles.link}
                    activeClassName={styles['link-active']}
                  >
                    关注
                  </NavLink>
                </li>
                <li className={styles['link-item']}>
                  <NavLink
                    to="/download"
                    className={styles.link}
                    activeClassName={styles['link-active']}
                  >
                    下载客户端
                  </NavLink>
                </li>
              </ul>
              {isLogin ? (
                <div className={styles.login}>
                  <div className={`${styles['login-status']} ${styles.avatar}`}>
                    <img
                      src={getThumbnail(userInfo?.avatarUrl, 30)}
                      alt="头像"
                    />
                    {unreadCount ? (
                      <i className={styles['login-badge']}>{unreadCount}</i>
                    ) : null}
                  </div>
                  <div className={styles['login-cont']}>
                    <i className={styles.arrow} />
                    <ul className={styles['login-list']}>
                      <li className={styles['login-item']}>
                        <PersonIcon className={style.icon} />
                        <Link to={`/user/home/${userInfo?.userId}`} href={null}>
                          我的主页
                        </Link>
                      </li>
                      <li className={styles['login-item']}>
                        <MailOutlineIcon className={styles.icon} />
                        <a href={null}>
                          我的消息
                          {unreadCount ? (
                            <span className={styles['login-badge']}>
                              {unreadCount}
                            </span>
                          ) : null}
                        </a>
                      </li>
                      <li className={styles['login-item']}>
                        <CardMembershipIcon className={styles.icon} />
                        <a href={null}>我的等级</a>
                      </li>
                      <li className={styles['login-item']}>
                        <CardMembershipIcon className={styles.icon} />
                        <a href={null}>VIP会员</a>
                      </li>
                    </ul>
                    <ul className={styles['login-list']}>
                      <li className={styles['login-item']}>
                        <SettingsIcon className={styles.icon} />
                        <a href={null}>个人设置</a>
                      </li>
                      <li className={styles['login-item']}>
                        <VerifiedUserIcon className={styles.icon} />
                        <a href={null}>实名认证</a>
                      </li>
                    </ul>
                    <ul className={styles['login-list']}>
                      <li
                        className={styles['login-item']}
                        onClick={this.handleLogout}
                      >
                        <PowerSettingsNewIcon className={styles.icon} />
                        退出
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className={styles.login}>
                  <span
                    className={`link ${styles['login-status']} ${styles['login-text']}`}
                    onClick={() => this.handleLogin(LOGIN_MODE.GUIDE.TYPE)}
                  >
                    登录
                  </span>
                  <div className={styles['login-cont']}>
                    <i className={styles.arrow} />
                    <ul className={styles['login-list']}>
                      <li
                        className={styles['login-item']}
                        onClick={() => this.handleLogin(LOGIN_MODE.MOBILE.TYPE)}
                      >
                        手机号登录
                      </li>
                      <li className={styles['login-item']}>
                        <a href={null}>微信登录</a>
                      </li>
                      <li className={styles['login-item']}>
                        <a href={null}>QQ登录</a>
                      </li>
                      <li className={styles['login-item']}>
                        <a href={null}>新浪微博登录</a>
                      </li>
                      <li
                        className={styles['login-item']}
                        onClick={() =>
                          this.handleLogin(LOGIN_MODE.EMAIL163.TYPE)
                        }
                      >
                        网易邮箱账号登录
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              <SearchBar />
            </div>
            <div className={styles['sub-nav-wrapper']}>
              <div className={styles['sub-nav']}>{this.getRenderSubNav()}</div>
            </div>
          </div>
        </div>
        {isLogin ? null : (
          <LoginModal
            visible={loginVisible}
            mode={loginMode}
            onCancel={this.handleCancel}
          />
        )}
      </>
    )
  }
}
