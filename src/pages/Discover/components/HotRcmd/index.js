/**
 * 热门推荐
 */
import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import Play from 'components/Play'
import {PLAY_TYPE} from 'constants/play'
import {formatNumber} from 'utils'
import {requestPersonalized} from 'services/playlist'

import './index.scss'

let isMounted = false

function HotRcmd () {
    const [personalized, setPersonalized] = useState([])

    useEffect(() => {
        const fetchPersonalized = async () => {
            const res = await requestPersonalized({limit: 8})
            if(isMounted) {
                setPersonalized(res.result)
            }
        }

        isMounted = true
        fetchPersonalized()

        return () => {
            isMounted = false
        }
    }, [])

    return <ul styleName="list">
        {
            personalized.map((item) => {
                return <li key={item.id} styleName="item">
                    <div styleName="cover">
                        <img src={item.picUrl}/>
                        <Link to={`/playlist/${item.id}`} styleName="mask"/>
                        <div styleName="bottom">
                            <span className="fl" styleName="icon-headset"/>
                            <span className="fl" styleName="play-num">{formatNumber(item.playCount)}</span>
                            <Play type={PLAY_TYPE.PLAYLIST.TYPE} id={item.id}>
                                <span className="fr" styleName="icon-play"/>
                            </Play>
                        </div>
                    </div>
                    <p>
                        <Link to='/' styleName="des" alt={item.name}>{item.name}</Link>
                    </p>
                </li>
            })
        }
    </ul>
}

export default React.memo(HotRcmd)
