/**
 * 个性化推荐
 */
import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import Play from 'components/Play'
import {PLAY_TYPE} from 'constants/play'
import {requestRcmdPlaylist} from 'services/rcmd'
import {formatNumber} from 'utils'
import './index.scss'

const Weekday = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']

export default class PersonalizedRcmd extends React.PureComponent {

    static propTypes = {
        userId: PropTypes.number.isRequired,
    }

    constructor(props) {
        super(props)
        this.state = {
            playlist: []
        }
        this._isMounted = false
    }

    componentDidMount() {
        this._isMounted = true
        this.fetchRcmdPlaylist()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    fetchRcmdPlaylist = () => {
        requestRcmdPlaylist()
            .then((res) => {
                if (this._isMounted) {
                    this.setState({
                        playlist: res.recommend.splice(0, 3)
                    })
                }
            })
    }

    handleDislike = () => {
        // todo 不感兴趣
    }

    render() {
        const {playlist} = this.state

        return (
            <ul styleName="list">
                <li styleName="item">
                    <Link to="discover/recommend/daily" styleName="item-date" title="每日歌曲推荐">
                        <p styleName="day">{Weekday[new Date().getDay() - 1]}</p>
                        <p styleName="date">{new Date().getDate()}</p>
                        <div styleName="date-mask"/>
                    </Link>
                    <Link to="discover/recommend/daily" styleName="desc" title="每日歌曲推荐">
                        每日歌曲推荐
                    </Link>
                    <p styleName="sub-desc">
                        根据你的口味生成，<br/>
                        每天6:00更新
                    </p>
                </li>
                {
                    playlist.map((item)=>{
                        return <li key={item.id} styleName="item">
                            <div styleName="cover">
                                <img src={item.picUrl} alt=""/>
                                <Link to={`/playlist/${item.id}`} title={item.name} styleName="mask"/>
                                <div styleName="bottom">
                                    <Play type={PLAY_TYPE.PLAYLIST.TYPE} id={item.id}>
                                        <a title="播放" styleName="icon-play"/>
                                    </Play>
                                    <a styleName="icon-headset"/>
                                    <span styleName="play-count">{formatNumber(item.playcount)}</span>
                                </div>
                            </div>
                            <Link to={`/playlist/${item.id}`} styleName="desc" title={item.name}>{item.name}</Link>
                            <p styleName="sub-desc">
                                <em>{item.copywriter}</em>
                                <span styleName="dislike" onClick={this.handleDislike}>不感兴趣</span>
                            </p>
                        </li>
                    })
                }
            </ul>
        )
    }
}
