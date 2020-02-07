/**
 * 个性化推荐
 */
import React, {useState, useEffect, useRef} from 'react'
import {useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import {PLAY_TYPE} from 'constants/play'
import Play from 'components/Play'
import {requestRcmdPlaylist} from 'services/rcmd'
import {formatNumber, getThumbnail} from 'utils'

import './index.scss'

const WEEKDAY = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']

function PersonalizedRcmd() {
    const isLogin = useSelector(({user}) => user.isLogin)
    const [playlist, setPlaylist] = useState([])
    const isMounted = useRef()

    useEffect(() => {
        const fetchRcmdPlaylist = async () => {
            const res = await requestRcmdPlaylist()
            if(isMounted.current) {
                setPlaylist(res.recommend.splice(0, 3))
            }
        }

        isMounted.current = true
        if(isLogin) {
            fetchRcmdPlaylist()
        }

        return () => {
            isMounted.current = false
        }
    }, [isLogin])

    const handleDislike = () => {
        // todo 不感兴趣
    }

    return <ul styleName="list">
        <li styleName="item">
            <Link to="discover/recommend/daily" styleName="item-date" title="每日歌曲推荐">
                <p styleName="day">{WEEKDAY[new Date().getDay() - 1]}</p>
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
                        <img src={getThumbnail(item.picUrl, 140)} alt=""/>
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
                        <span styleName="dislike" onClick={handleDislike}>不感兴趣</span>
                    </p>
                </li>
            })
        }
    </ul>
}

export default React.memo(PersonalizedRcmd)
