/**
 *  榜单
 */
import React, {useState, useEffect, useCallback, useRef} from 'react'
import {Link} from 'react-router-dom'
import {cloneDeep} from 'lodash'
import Add from 'components/Add'
import Play from 'components/Play'
import CollectPlaylist from 'components/CollectPlaylist'
import {PLAYLIST_COLLECTION_TYPE} from 'constants'
import {PLAY_TYPE} from 'constants/play'
import {requestRankList} from 'services/toplist'
import {getThumbnail} from 'utils'

import './index.scss'
import ListLoading from "components/ListLoading";

function Rank() {
    const [loading, setLoading] = useState([])
    const [rankList, setRankList] = useState(Array.from(new Array(3)))
    const isMounted = useRef()

    useEffect(() => {
        const fetchRankList = async () => {
            try {
                setLoading(true)
                const {playlist: soaringRank} = await requestRankList({idx: 3})
                const {playlist: newRank} = await requestRankList({idx: 0})
                const {playlist: hotRank} = await requestRankList({idx: 2})

                if(isMounted.current) {
                    setRankList([soaringRank, newRank, hotRank])
                }
            } finally {
                setLoading(false)
            }
        }

        isMounted.current = true
        fetchRankList()

        return () => {
            isMounted.current = false
        }
    }, [])

    const handleCollectSuccess = useCallback((index) => {
        const list = cloneDeep(rankList)
        const rank = list[index]
        rank.subscribed = !rank.subscribed
        list[index] = rank
        setRankList(list)
    }, [rankList])

    return <div styleName="wrapper">
        {
            rankList.map((rank={}, index) => {
                const {id} = rank
                const link = `/playlist/${id}`
                return <div key={`${index}-${id}`} styleName='column'>
                    {
                        loading ? <ListLoading/> : <>
                            <div styleName='top'>
                                <Link to={link} styleName='cover'>
                                    <img className='fl'
                                        src={getThumbnail(rank.coverImgUrl, 100)}
                                        alt={rank.name}
                                    />
                                </Link>
                                <div styleName='text'>
                                    <Link to={link}><h3>{rank.name}</h3></Link>
                                    <div styleName='top-btns'>
                                        <Play
                                            type={PLAY_TYPE.PLAYLIST.TYPE}
                                            id={id}
                                        >
                                            <a
                                                href={null}
                                                styleName='icon top-play-icon'
                                                title="播放"
                                            >播放</a>
                                        </Play>
                                        <CollectPlaylist
                                            id={id}
                                            type={rank.subscribed ? PLAYLIST_COLLECTION_TYPE.CANCEL : PLAYLIST_COLLECTION_TYPE.OK}
                                            onSuccess={() => handleCollectSuccess(index)}
                                        >
                                            <a
                                                href={null}
                                                styleName='icon top-subscribe-icon'
                                                title="收藏"
                                            >
                                                收藏
                                            </a>
                                        </CollectPlaylist>
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
                        </>
                    }
                </div>
            })
        }
    </div>
}

export default React.memo(Rank)
