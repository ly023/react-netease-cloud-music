/**
 *  榜单
 */
import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import Add from 'components/Add'
import Play from 'components/Play'
import {PLAY_TYPE} from 'constants/play'
import {requestRankList} from 'services/toplist'

import './index.scss'

function Rank() {
    const [rankList, setRankList] = useState([])
    let isMounted = false

    const fetchRankList = async () => {
        try {
            const {playlist: soaringRank} = await requestRankList({idx: 3})
            const {playlist: newRank} = await requestRankList({idx: 0})
            const {playlist: hotRank} = await requestRankList({idx: 2})

            if(isMounted) {
                setRankList([soaringRank, newRank, hotRank])
            }
        } catch (e) {}
    }

    useEffect(() => {
        isMounted = true
        fetchRankList()
        return () => {
            isMounted = false
        }
    }, [])

    return <div styleName="wrapper">
        {
            rankList.map((rank) => {
                return <div key={rank.id} styleName='column'>
                    <div styleName='top'>
                        <a styleName='cover'>
                            <img className='fl'
                                src={rank.coverImgUrl}
                                alt={rank.name}
                            />
                        </a>
                        <div styleName='text'>
                            <a href={null}><h3>{rank.name}</h3></a>
                            <div styleName='top-btns'>
                                <Play
                                    type={PLAY_TYPE.PLAYLIST.TYPE}
                                    id={rank.id}
                                >
                                    <a
                                        href={null}
                                        styleName='icon top-play-icon'
                                        title="播放"
                                    >播放</a>
                                </Play>
                                <a
                                    href={null}
                                    styleName='icon top-subscribe-icon'
                                    title="收藏"
                                >
                                    收藏
                                </a>
                            </div>
                        </div>
                    </div>
                    <ul styleName='list'>
                        {
                            rank.tracks && rank.tracks.slice(0, 10).map((track, idx) => {
                                let no = idx + 1
                                return <li key={track.id}
                                    styleName={`item${no % 2 === 1 ? ' item-event' : ''}`}>
                                    <span
                                        styleName={`no ${no <= 3 ? 'no-top' : ''}`}>{no}</span>
                                    <Link to={`song/${track.id}`}
                                        styleName='item-name'>{track.name}</Link>
                                    <div styleName='item-operation'>
                                        <Play
                                            type={PLAY_TYPE.SINGLE.TYPE}
                                            id={track.id}
                                        >
                                            <a
                                                href={null}
                                                title={'播放'}
                                                styleName='icon play-icon'
                                            />
                                        </Play>
                                        <Add type={PLAY_TYPE.SINGLE.TYPE} id={track.id}>
                                            <a
                                                href={null}
                                                title={'添加到播放列表'}
                                                styleName='icon add-icon'
                                            />
                                        </Add>
                                        <a href={null} title={'收藏'}
                                            styleName='icon subscribe-icon'/>
                                    </div>
                                </li>
                            })
                        }
                        <li styleName="item-more">
                            <a href={null} styleName="item-all">查看全部></a>
                        </li>
                    </ul>
                </div>
            })
        }
    </div>
}

export default React.memo(Rank)
