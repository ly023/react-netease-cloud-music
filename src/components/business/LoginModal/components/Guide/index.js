import { Component } from 'react'
import PropTypes from 'prop-types'
import { LOGIN_MODE } from 'constants/login'
import styles from '../../index.scss'

export default class Guide extends Component {
  static propTypes = {
    changeMode: PropTypes.func
  }

  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  componentWillUnmount() {}

  changeMode = (mode) => {
    this.props.changeMode(mode)
  }

  render() {
    return (
        <div className="clearfix">
          <div className={`fl ${styles['login-guide']}`}>
            <div className={styles['login-guide-platform']} />
            <a
                href={null}
                className={styles['login-btn']}
                onClick={() => this.changeMode(LOGIN_MODE.MOBILE.TYPE)}
            >
              手机号登录
            </a>
            <a
                href={null}
                className={styles['sign-up-btn']}
                onClick={() => this.changeMode(LOGIN_MODE.SIGN_UP.TYPE)}
            >
              注册
            </a>
          </div>
          <ul className={styles['login-guide-other']}>
            <li className={styles['login-guide-item']}>
              <a
                  href="http://music.163.com/api/sns/authorize?snsType=10&amp;clientType=web2&amp;callbackType=Login&amp;forcelogin=true"
                  target="_blank"
                  rel="noreferrer"
              >
                <i className={styles['login-guide-item-wechat']} />
                微信登录
              </a>
            </li>
            <li className={styles['login-guide-item']}>
              <a
                  href="http://music.163.com/api/sns/authorize?snsType=5&amp;clientType=web2&amp;callbackType=Login&amp;forcelogin=true"
                  target="_blank"
                  rel="noreferrer"
              >
                <i className={styles['login-guide-item-qq']} />
                QQ登录
              </a>
            </li>
            <li className={styles['login-guide-item']}>
              <a
                  href="http://music.163.com/api/sns/authorize?snsType=2&amp;clientType=web2&amp;callbackType=Login&amp;forcelogin=true"
                  target="_blank"
                  rel="noreferrer"
              >
                <i className={styles['login-guide-item-blog']} />
                微博登录
              </a>
            </li>
            <li className={styles['login-guide-item']}>
              <a
                  href={null}
                  onClick={() => this.changeMode(LOGIN_MODE.EMAIL163.TYPE)}
              >
                <i className={styles['login-guide-item-email']} />
                网易邮箱帐号登录
              </a>
            </li>
          </ul>
        </div>
    )
  }
}
