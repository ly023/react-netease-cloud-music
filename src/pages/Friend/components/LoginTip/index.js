import pubsub from 'utils/pubsub'
import styles from './index.scss'

function LoginTip() {
  const handleLogin = () => {
    pubsub.publish('login')
  }

  return (
    <div className="main">
      <div className="wrapper">
        <h2 className={styles.title}>关注明星 发现精彩</h2>
        <p className={styles.tip}>你可以关注明星和好友品味他们的私房歌单</p>
        <p className={styles.tip}>通过他们的动态发现更多精彩音乐</p>
        <button className={styles['login-btn']} onClick={handleLogin}>
          立即登录
        </button>
      </div>
    </div>
  )
}

export default LoginTip
