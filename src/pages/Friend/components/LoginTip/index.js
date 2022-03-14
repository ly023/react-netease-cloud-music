import {useCallback} from 'react'
import pubsub from 'utils/pubsub'
import './index.scss'

function LoginTip() {
    const handleLogin = useCallback(() => {
        pubsub.publish('login')
    }, [])

    return <div className="main">
        <div styleName="wrapper">
            <h2 styleName="title">关注明星 发现精彩</h2>
            <p styleName="tip">你可以关注明星和好友品味他们的私房歌单</p>
            <p styleName="tip">通过他们的动态发现更多精彩音乐</p>
            <button styleName="login-btn" onClick={handleLogin}>立即登录</button>
        </div>
    </div>
}

export default LoginTip
