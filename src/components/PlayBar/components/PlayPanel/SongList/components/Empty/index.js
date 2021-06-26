import {Link} from 'react-router-dom'

import './index.scss'

const Empty = () => {
    return <div styleName="empty">
        <i styleName="icon-face"/>
        你还没有添加任何歌曲
        <p>
            去首页<Link to="/discover">发现音乐</Link>，或在<Link to="/my">我的音乐</Link>收听自己收藏的歌单。
        </p>
    </div>
}
export default Empty
