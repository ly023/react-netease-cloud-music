/**
 * 热门推荐
 */
import {useState, useEffect, useRef, memo} from 'react'
import {Link} from 'react-router-dom'
import Play from 'components/Play'
import {PLAY_TYPE} from 'constants/music'
import ListLoading from 'components/ListLoading'
import {formatNumber, getThumbnail} from 'utils'
import {requestPersonalized} from 'services/playlist'

import './index.scss'

function HotRcmd() {
    const [personalized, setPersonalized] = useState([])
    const [loading, setLoading] = useState(false)
    const isMounted = useRef(false)

    useEffect(() => {
        const fetchPersonalized = async () => {
            setLoading(true)
            const res = await requestPersonalized({limit: 8})
            if (isMounted.current) {
                const data = res?.result || []
                setLoading(false)
                setPersonalized(data)
            }
        }

        isMounted.current = true
        fetchPersonalized()

        return () => {
            isMounted.current = false
        }
    }, [])

    return <>
        <ListLoading loading={loading}/>
        <ul styleName="list">
            {
                personalized.map((item) => {
                    const {id, name} = item
                    const detailLink = `/playlist/${id}`
                    return <li key={id} styleName="item">
                        <div styleName="cover">
                            <img src={getThumbnail(item.picUrl, 140)}/>
                            <Link to={detailLink} styleName="mask"/>
                            <div styleName="bottom">
                                <span className="fl" styleName="icon-headset"/>
                                <span className="fl" styleName="play-num">{formatNumber(item.playCount, 1)}</span>
                                <Play type={PLAY_TYPE.PLAYLIST.TYPE} id={id}>
                                    <span className="fr" styleName="icon-play"/>
                                </Play>
                            </div>
                        </div>
                        <p>
                            <Link to={detailLink} styleName="des" alt={name}>{name}</Link>
                        </p>
                    </li>
                })
            }
        </ul>
    </>
}

export default memo(HotRcmd)
