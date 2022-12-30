/**
 *  榜单
 */
import {useState, useEffect, useCallback, useRef, memo} from 'react'
import {Link} from 'react-router-dom'
import {cloneDeep} from 'lodash'
import PlayCircleOutlineIcon  from '@mui/icons-material/PlayCircleOutline'
import AddIcon from '@mui/icons-material/Add'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import Add from 'components/business/Add'
import Play from 'components/business/Play'
import ListLoading from 'components/ListLoading'
import SubscribePlaylist from 'components/business/SubscribePlaylist'
import AddToPlaylist from 'components/business/AddToPlaylist'
import {PLAYLIST_COLLECTION_TYPE} from 'constants'
import {PLAY_TYPE} from 'constants/music'
import {requestRankList} from 'services/toplist'
import {getThumbnail} from 'utils'

import './index.scss'

function Rank() {
    const [loading, setLoading] = useState(false)
    const [rankList, setRankList] = useState([])
    const isMounted = useRef(false)

    useEffect(() => {
        isMounted.current = true

        const fetchRankList = async () => {
            try {
                setLoading(true)
                // const {playlist: soaringRank} = await requestRankList({id: 19723756}) // 飙升榜
                const {playlist: hotRank} = await requestRankList({id: 3778678}) // 热歌榜
                const {playlist: newRank} = await requestRankList({id: 3779629}) // 新歌榜
                const {playlist: originalRank} = await requestRankList({id: 2884035}) // 原创榜

                if(isMounted.current) {
                    setRankList([hotRank, newRank, originalRank])
                }
            } finally {
                if(isMounted.current) {
                    setLoading(false)
                }
            }
        }

        fetchRankList()

        return () => {
            isMounted.current = false
        }
    }, [])

    const handleSubscribeSuccess = useCallback((index) => {
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
                                                title="播放"
                                            >
                                                <PlayCircleOutlineIcon styleName='top-play-icon'/>
                                            </a>
                                        </Play>
                                        <SubscribePlaylist
                                            id={id}
                                            type={rank.subscribed ? PLAYLIST_COLLECTION_TYPE.OK : PLAYLIST_COLLECTION_TYPE.CANCEL}
                                            onSuccess={() => handleSubscribeSuccess(index)}
                                        >
                                            <a
                                                href={null}
                                                title="收藏"
                                            >
                                                <LibraryAddIcon styleName='top-subscribe-icon'/>
                                            </a>
                                        </SubscribePlaylist>
                                    </div>
                                </div>
                            </div>
                            <ul styleName='list'>
                                {
                                    rank.tracks && rank.tracks.slice(0, 10).map((track, idx) => {
                                        let no = idx + 1
                                        const {id, name} = track
                                        return <li key={id}
                                            styleName={`item${no % 2 === 1 ? ' item-event' : ''}`}>
                                            <span
                                                styleName={`no ${no <= 3 ? 'no-top' : ''}`}>{no}</span>
                                            <Link to={`/song/${id}`} styleName='item-name' title={name}>{name}</Link>
                                            <div styleName='item-operation'>
                                                <Play
                                                    type={PLAY_TYPE.SINGLE.TYPE}
                                                    id={id}
                                                >
                                                    <a
                                                        href={null}
                                                        title="播放"
                                                    >
                                                        <PlayCircleOutlineIcon styleName='icon' />
                                                    </a>
                                                </Play>
                                                <Add type={PLAY_TYPE.SINGLE.TYPE} id={id}>
                                                    <a
                                                        href={null}
                                                        title="添加到播放列表"
                                                    >
                                                        <AddIcon styleName='icon'/>
                                                    </a>
                                                </Add>
                                                <AddToPlaylist songIds={[id]}>
                                                    <a href={null} title="收藏">
                                                        <LibraryAddIcon styleName='icon' />
                                                    </a>
                                                </AddToPlaylist>
                                            </div>
                                        </li>
                                    })
                                }
                                <li styleName="item-more">
                                    <a href={`/discover/toplist?id=${id}`} styleName="item-all">查看全部&nbsp;></a>
                                </li>
                            </ul>
                        </>
                    }
                </div>
            })
        }
    </div>
}

export default memo(Rank)
