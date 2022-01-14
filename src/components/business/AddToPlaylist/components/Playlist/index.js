import {useState, useEffect, useCallback, useRef} from 'react'
import PropTypes from 'prop-types'
import {FixedSizeList as List} from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import ListLoading from 'components/ListLoading'
import {requestUserPlaylist} from 'services/playlist'
import {getThumbnail} from 'utils'

import './index.scss'

const ItemSize = 54
const DefaultPlaylistType = 5

const Row = (props) => {
    const {index, style, list, userId, extraItem, onItemClick} = props
    const item = list[index]
    const {id, name, creator} = item
    if (!id) {
        return <div style={style}>
            {extraItem}
        </div>
    }

    const itemClick = (e, id) => {
        e.stopPropagation()
        onItemClick && onItemClick(id)
    }

    return <div style={style} styleName="item" onClick={(e) => itemClick(e, id)}>
        <div styleName="box">
            <div styleName="left">
                <img src={getThumbnail(item.coverImgUrl, 40)} styleName="cover" alt=""/>
            </div>
            <div styleName="meta">
                <p styleName="name">
                    {userId === creator?.userId && item.specialType === DefaultPlaylistType ? '我喜欢的音乐' : name}
                </p>
                {item.trackCount ? <p styleName="track-count">{item.trackCount}首</p> : null}
            </div>
        </div>
    </div>
}

const plusItem = {id: 0}

function Playlist(props) {
    const {userId} = props

    const [params, setParams] = useState({
        uid: userId,
        limit: 30,
        offset: 0,
    })
    const [playlist, setPlaylist] = useState([plusItem])
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const isMounted = useRef(false)

    const fetchPlaylist = useCallback(async (offset = 0) => {
        try {
            setLoading(true)
            const query = {
                ...params,
                offset
            }
            const res = await requestUserPlaylist(query)
            if (isMounted.current) {
                const data = res?.playlist || []
                let currentList = []
                if (offset === 0) {
                    currentList = [plusItem].concat(data)
                } else {
                    currentList = playlist.concat(data)
                }
                setPlaylist(currentList)
                setParams(query)
                setHasMore(res?.hasMore || false)
            }
        } finally {
            setLoading(false)
        }
    }, [params, playlist])

    const scroll = useCallback(() => {
        if (loading) {
            return
        }
        const {limit, offset} = params
        if (hasMore) {
            fetchPlaylist(offset + limit)
        }
    }, [loading, params, hasMore, fetchPlaylist])

    useEffect(() => {
        isMounted.current = true

        fetchPlaylist()

        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <>
        <AutoSizer>
            {({height, width}) => (
                <List
                    height={height}
                    itemCount={playlist.length}
                    itemSize={ItemSize}
                    width={width}
                    onScroll={scroll}
                >
                    {(rowProps) => <Row {...props} {...rowProps} list={playlist}/>}
                </List>
            )}
        </AutoSizer>
        <ListLoading loading={loading}/>
    </>
}

Playlist.propTypes = {
    userId: PropTypes.number,
    extraItem: PropTypes.node,
    onItemClick: PropTypes.func,
}

export default Playlist
