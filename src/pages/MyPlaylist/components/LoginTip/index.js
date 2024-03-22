import pubsub from 'utils/pubsub'
import styles from './index.scss'

function LoginTip() {
  const handleLogin = () => {
    pubsub.publish('login')
  }

  return (
    <div className="main">
      <div className={styles.wrapper}>
        <h2 className={styles.title}>登录网易云音乐</h2>
        <p className={styles.tip}>查看并管理你收藏的私房音乐，</p>
        <p className={styles.tip}>随时随地收听</p>
        <button className={styles['login-btn']} onClick={handleLogin}>
          立即登录
        </button>
      </div>
    </div>
  )
}

export default LoginTip
