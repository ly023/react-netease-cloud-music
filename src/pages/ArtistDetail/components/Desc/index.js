/**
 * 艺人介绍
 */
import Empty from 'components/Empty'
import './index.scss'

function Desc(props) {
    const {artist} = props
    return artist?.briefDesc ? <div styleName="box">
        <div styleName="subtitle">{artist?.name}简介</div>
        <div styleName="desc">{artist?.briefDesc}</div>
    </div> : <Empty tip="暂无介绍"/>
}

export default Desc

