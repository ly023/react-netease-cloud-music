/**
 * 个性化推荐
 */
import {useState, useEffect, useRef, memo} from 'react'
import {Link} from 'react-router-dom'
import ListLoading from 'components/ListLoading'
import PlaylistItem from 'components/business/PlaylistItem'
import {requestRcmdPlaylist} from 'services/rcmd'
import useShallowEqualSelector from 'utils/useShallowEqualSelector'

import './index.scss'

const WEEKDAY = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']

function PersonalizedRcmd() {
    const isLogin = useShallowEqualSelector(({user}) => user.isLogin)
    const [playlist, setPlaylist] = useState([])
    const [loading, setLoading] = useState(false)
    const isMounted = useRef(false)

    useEffect(() => {
        isMounted.current = true

        return () => {
            isMounted.current = false
        }
    }, [])

    useEffect(() => {
        const fetchRcmdPlaylist = async () => {
            try {
                setLoading(true)
                const res = await requestRcmdPlaylist()
                if (isMounted.current) {
                    const data = res?.recommend || []
                    setLoading(false)
                    setPlaylist(data.slice(0, 3))
                }
            } catch (e) {
            }
        }

        if (isLogin) {
            fetchRcmdPlaylist()
        }

    }, [isLogin])

    const handleDislike = () => {
        // todo 不感兴趣
    }

    return loading ? <ListLoading loading={loading}/>
        : <ul styleName="list">
            <li styleName="item">
                <Link to="/discover/recommend/daily" styleName="item-date" title="每日歌曲推荐">
                    <p styleName="day">{WEEKDAY[new Date().getDay() - 1]}</p>
                    <p styleName="date">{new Date().getDate()}</p>
                    <div styleName="date-mask"/>
                </Link>
                <Link to="/discover/recommend/daily" styleName="desc" title="每日歌曲推荐">
                    每日歌曲推荐
                </Link>
                <p styleName="sub-desc">
                    根据你的口味生成，<br/>
                    每天6:00更新
                </p>
            </li>
            {
                playlist.map((item) => {
                    const parseItem = {
                        ...item,
                        coverUrl: item.picUrl,
                        playCount: item.playcount,
                    }
                    return <li key={item.id} styleName="item">
                        <PlaylistItem item={parseItem}/>
                        <p styleName="sub-desc">
                            <em>{item.copywriter}</em>
                            <span styleName="dislike" onClick={handleDislike}>不感兴趣</span>
                        </p>
                    </li>
                })
            }
        </ul>
}

export default memo(PersonalizedRcmd)
