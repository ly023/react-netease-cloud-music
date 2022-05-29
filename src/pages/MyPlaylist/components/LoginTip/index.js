import pubsub from 'utils/pubsub'
import './index.scss'

function LoginTip() {
    const handleLogin = () => {
        pubsub.publish('login')
    }

    return <div className="main">
        <div styleName="wrapper">
            <h2 styleName="title">登录网易云音乐</h2>
            <p styleName="tip">查看并管理你收藏的私房音乐，</p>
            <p styleName="tip">随时随地收听</p>
            <button styleName="login-btn" onClick={handleLogin}>立即登录</button>
        </div>
    </div>
}

export default LoginTip
