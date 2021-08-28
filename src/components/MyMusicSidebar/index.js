import {useState, useEffect, useCallback, useRef} from 'react'
import {useHistory} from 'react-router-dom'
import ListLoading from 'components/ListLoading'
import useShallowEqualSelector from 'utils/useShallowEqualSelector'
import {requestPlaylist} from 'services/user'
import {getThumbnail, getUrlParameter} from 'utils'

import './index.scss'

function MyMusicSidebar(props) {
    const history = useHistory()

    const {userId} = useShallowEqualSelector(({user}) => ({userId: user.userInfo?.userId}))

    const reload = getUrlParameter('reload')

    const {playlistId, style} = props

    const [createdPlaylistsVisible, setCreatedPlaylistsVisible] = useState(true)
    const [collectedPlaylistsVisible, setCollectedPlaylistsVisible] = useState(true)
    const [playlistLoading, setPlaylistLoading] = useState(false)
    const [createdPlaylists, setCreatedPlaylists] = useState([])
    const [collectedPlaylists, setCollectedPlaylists] = useState([])

    const isMounted = useRef(false)

    const invalidPlaylistId = Number.isNaN(playlistId)

    const fetchPlaylists = useCallback(async () => {
        if (userId) {
            try {
                setPlaylistLoading(true)
                const res = await requestPlaylist({
                    limit: invalidPlaylistId ? 1 : 1000,
                    offset: 0,
                    uid: userId,
                })
                const data = res?.playlist || []
                if (invalidPlaylistId) {
                    const firstPlaylistId = data[0]?.id
                    if (firstPlaylistId) {
                        history.push(`/my/music/playlist/${firstPlaylistId}?reload=true`)
                        return
                    }
                }
                if (isMounted.current) {
                    const index = data.findIndex(item => item?.creator?.userId !== userId)
                    if (index === -1) {
                        setCreatedPlaylists(createdPlaylists.concat(data))
                    } else {
                        const createdList = data.slice(0, index)
                        const collectedList = data.slice(index)
                        if (createdList.length) {
                            setCreatedPlaylists(createdPlaylists.concat(createdList))
                        }
                        if (collectedList.length) {
                            setCollectedPlaylists(collectedPlaylists.concat(collectedList))
                        }
                    }
                }
            } finally {
                if (isMounted.current) {
                    setPlaylistLoading(false)
                }
            }
        }
    }, [history, invalidPlaylistId, userId, createdPlaylists, collectedPlaylists])

    useEffect(() => {
        isMounted.current = true

        if(!reload) {
            fetchPlaylists()
        }

        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (reload) {
            fetchPlaylists()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload])

    const handleSelectPlaylist = useCallback((item) => {
        const {id} = item
        const url = `/my/music/playlist/${id}`
        history.push(url)
    }, [history])

    const renderPlaylist = useCallback((data) => {
        return <ul>
            {
                data.map((item) => {
                    const {id, name, coverImgUrl, trackCount} = item
                    const selected = id === playlistId
                    return <li key={id} styleName={`item ${selected ? 'selected' : ''}`}
                               onClick={() => handleSelectPlaylist(item)}>
                        <img src={getThumbnail(coverImgUrl, 140)} alt="歌单封面" styleName="cover"/>
                        <div styleName="meta">
                            <div title={name} styleName="name">{name}</div>
                            <div styleName="count">{trackCount}首</div>
                        </div>
                    </li>
                })
            }
        </ul>
    }, [playlistId, handleSelectPlaylist])

    const handleChangeCreatedPlaylistsVisible = useCallback(() => {
        setCreatedPlaylistsVisible(!createdPlaylistsVisible)
    }, [createdPlaylistsVisible])

    const handleChangeCollectedPlaylistsVisible = useCallback(() => {
        setCollectedPlaylistsVisible(!collectedPlaylistsVisible)
    }, [collectedPlaylistsVisible])

    return <div styleName="wrapper" style={style}>
        <h2 styleName="subtitle">我的歌手</h2>
        <h2 styleName="subtitle">我的视频</h2>
        <div>
            <div styleName="summary" onClick={handleChangeCreatedPlaylistsVisible}>
                <span styleName={`arrow ${createdPlaylistsVisible ? 'down' : 'right'}`}/>
                <span styleName="summary-title">
                    <span styleName="text">创建的歌单<span styleName="reg">&reg;</span></span>
                    ({createdPlaylists.length})
                </span>
            </div>
            <ListLoading loading={playlistLoading}/>
            <div style={createdPlaylistsVisible ? {} : {height: 0}} styleName="detail">
                {renderPlaylist(createdPlaylists)}
            </div>
        </div>
        <div>
            <div styleName="summary" onClick={handleChangeCollectedPlaylistsVisible}>
                <span styleName={`arrow ${collectedPlaylistsVisible ? 'down' : 'right'}`}/>
                <span styleName="summary-title">
                    <span styleName="text">创建的歌单<span styleName="reg">&reg;</span></span>
                    ({collectedPlaylists.length})
                </span>
            </div>
            <ListLoading loading={playlistLoading}/>
            <div style={collectedPlaylistsVisible ? {} : {height: 0}} styleName="detail">
                {renderPlaylist(collectedPlaylists)}
            </div>
        </div>
    </div>
}

export default MyMusicSidebar
