import {useEffect, useState, useCallback, useMemo, useRef} from 'react'
import PropTypes from 'prop-types'
import {Link, useHistory} from 'react-router-dom'
import Empty from 'components/Empty'
import SinglePlay from 'components/SinglePlay'
import SongActions from 'components/SongActions'
import ListLoading from 'components/ListLoading'
import SubTitle from 'components/SubTitle'
import QuestionPopover from 'components/Popover/QuestionPopover'
import {renderArtists} from 'utils/song'
import useShallowEqualSelector from 'utils/useShallowEqualSelector'
import {requestListeningRankingList} from 'services/user'

import './index.scss'

const ORDER_TYPES = {
    LAST_WEEK: {
        TYPE: 1,
        NAME: '最近一周'
    },
    ALL: {
        TYPE: 0,
        NAME: '所有时间'
    }
}

function ListenMusicRankingList(props) {
    const history = useHistory()

    const {userId, listenSongs, limit} = props

    const {currentSong} = useShallowEqualSelector(({user}) => ({
        currentSong: user.player.currentSong,
    }))

    const [loading, setLoading] = useState(false)
    const [orderType, setOrderType] = useState(ORDER_TYPES.LAST_WEEK.TYPE)
    const [originRankingList, setOriginRankingList] = useState([])
    const [rankingList, setRankingList] = useState([])
    const isMounted = useRef(false)

    useEffect(() => {
        isMounted.current = true

        fetchListeningRankingList(orderType)

        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchListeningRankingList = useCallback(async (type) => {
        try {
            setLoading(true)
            const res = await requestListeningRankingList({uid: userId, type})
            if (isMounted.current) {
                const dataKey = type === ORDER_TYPES.LAST_WEEK.TYPE ? 'weekData' : 'allData'
                const code = res?.code
                if(code === 200) {
                    const data = res?.[dataKey] || []
                    setOriginRankingList(data)
                    setRankingList(limit ? data.slice(0, limit) : data)
                } else if(code === -2){
                    if(!limit) {
                        history.push('/404')
                    }
                }
            }
        } finally {
            if(isMounted.current) {
                setLoading(false)
            }
        }
    }, [userId, limit, history])

    const handleChangeOrderType = useCallback((type) => {
        setOrderType(type)
        fetchListeningRankingList(type)
    }, [fetchListeningRankingList])

    const renderOrderTypes = useMemo(() => {
        const keys = Object.keys(ORDER_TYPES)
        return keys.map((key, index) => {
            const {TYPE: type, NAME: name} = ORDER_TYPES[key]
            const isActive = orderType === type
            return <span
                key={type}
                onClick={() => handleChangeOrderType(type)}
                styleName={`type ${isActive ? 'active' : ''}`}
            >
                {name}
                {index !== keys.length - 1 ? <span>|</span> : null}
            </span>
        })
    }, [orderType, handleChangeOrderType])

    const renderMore = useMemo(() => {
        if (limit && originRankingList?.length > limit) {
            return <div styleName="more"><Link to={`/user/songs/rank/${userId}`}>查看更多></Link></div>
        }
    }, [limit, originRankingList?.length, userId])

    const renderSongs = useMemo(() => {
        if (loading) {
            return <ListLoading/>
        }
        if (rankingList?.length) {
            return <div>
                <ul styleName="list">
                    {rankingList.map((rank, index) => {
                        const {song, playCount, score} = rank
                        const {id, name, ar} = song
                        const order = index + 1
                        const isEven = !!(order % 2)
                        const percent = score
                        return <div key={id} styleName={`item ${isEven ? 'even' : ''}`}>
                            <div styleName="order">
                                <span styleName="order-num">{order}.</span>
                                <SinglePlay id={id} active={currentSong?.id === id}/>
                            </div>
                            <div styleName="song">
                                <Link styleName="name" to={`/song/${id}`}>{name}</Link>
                                <span styleName="artists"><em>-</em>{renderArtists(ar)}</span>
                                <div styleName="actions">
                                    <SongActions id={id}/>
                                </div>
                            </div>
                            <div styleName="bar">
                                <div styleName="progress" style={{width: `${percent}%`}}/>
                                <span styleName="times">{playCount}次</span>
                            </div>
                        </div>
                    })}
                </ul>
                {renderMore}
            </div>
        }
        return <Empty tip="暂无听歌记录"/>
    }, [loading, rankingList, currentSong, renderMore])

    return <>
        <SubTitle
            title={<div styleName="subtitle">听歌排行<span styleName="total">累计听歌{listenSongs}首</span>
                <QuestionPopover
                    placement="bottomLeft"
                    trigger="hover"
                    style={{width: 300}}
                    content="实际播放时间过短的歌曲将不纳入计算。"
                />
            </div>}
            slot={<>{renderOrderTypes}</>}
        />
        {renderSongs}
    </>
}

ListenMusicRankingList.propTypes = {
    userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    listenSongs: PropTypes.number,
    limit: PropTypes.number,
}

export default ListenMusicRankingList
