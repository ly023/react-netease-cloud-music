import {useState, useEffect, useCallback, useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import useShallowEqualSelector from 'hook/useShallowEqualSelector'
import ListLoading from 'components/ListLoading'
import Confirm from 'components/Confirm'
import {requestPlaylist} from 'services/user'
import {deleteUserPlaylist} from 'services/playlist'
import {DEFAULT_PLAYLIST_TYPE} from 'constants/music'
import {getThumbnail, getUrlParameter} from 'utils'

import './index.scss'

function MyMusicSidebar(props) {
    const navigate = useNavigate()

    const {userId} = useShallowEqualSelector(({user}) => ({userId: user.userInfo?.userId}))

    const reload = getUrlParameter('reload')

    const {playlistId, style} = props

    const [createdPlaylistsVisible, setCreatedPlaylistsVisible] = useState(true)
    const [collectedPlaylistsVisible, setCollectedPlaylistsVisible] = useState(true)
    const [playlistLoading, setPlaylistLoading] = useState(false)
    const [createdPlaylists, setCreatedPlaylists] = useState([])
    const [collectedPlaylists, setCollectedPlaylists] = useState([])
    const [confirmVisible, setConfirmVisible] = useState(false)
    const [activePlaylistId, setActivePlaylistId] = useState()
    const [deleteLoading, setDeleteLoading] = useState(false)

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
                if (invalidPlaylistId || !data.find(v => v.id === playlistId)) {
                    const firstPlaylistId = data[0]?.id
                    if (firstPlaylistId) {
                        navigate(`/my/music/playlist/${firstPlaylistId}?reload=true`)
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
    }, [navigate, invalidPlaylistId, playlistId, userId, createdPlaylists, collectedPlaylists])

    useEffect(() => {
        isMounted.current = true

        if (!reload) {
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

    const handleSelectPlaylist = useCallback((id) => {
        const url = `/my/music/playlist/${id}`
        navigate(url)
    }, [navigate])

    const handleChangeCreatedPlaylistsVisible = () => {
        setCreatedPlaylistsVisible(!createdPlaylistsVisible)
    }

    const handleChangeCollectedPlaylistsVisible = () => {
        setCollectedPlaylistsVisible(!collectedPlaylistsVisible)
    }

    const handleShowDeleteConfirm = useCallback((e, id) => {
        e.stopPropagation()
        setActivePlaylistId(id)
        setConfirmVisible(true)
    }, [])

    const handleCancelDeleteConfirm = useCallback(() => {
        setActivePlaylistId()
        setConfirmVisible(false)
    }, [])

    const replaceUrl = useCallback((activeIndex, playlists) => {
        if (playlistId === activePlaylistId) {
            const nextPlaylistId = playlists[activeIndex] ? playlists[activeIndex].id :  playlists[0].id
            const url = `/my/music/playlist/${nextPlaylistId}`
            navigate(url, {replace: true})
        }
    }, [navigate, playlistId, activePlaylistId])

    const filterPlaylists = useCallback((id) => {
        let activeIndex = -1
        const newCreatedPlaylist = createdPlaylists.filter((v, i) => {
            if (v.id === id) {
                activeIndex = i
            }
            return v.id !== id
        })
        if (newCreatedPlaylist.length === createdPlaylists.length) {
            const newCollectedPlaylists = collectedPlaylists.filter((v, i) => {
                if (v.id === id) {
                    activeIndex = i
                }
                return v.id !== id
            })
            setCollectedPlaylists(newCollectedPlaylists)
            replaceUrl(activeIndex, newCollectedPlaylists)
            return
        }
        replaceUrl(activeIndex, newCreatedPlaylist)
        setCreatedPlaylists(newCreatedPlaylist)
    }, [createdPlaylists, collectedPlaylists, replaceUrl])

    const handleDeletePlaylist = useCallback(async () => {
        try {
            setDeleteLoading(true)
            const res = await deleteUserPlaylist({
                id: activePlaylistId,
            })
            if (res?.code === 200) {
                filterPlaylists(activePlaylistId)
                handleCancelDeleteConfirm()
            }
        } finally {
            if (isMounted.current) {
                setDeleteLoading(false)
            }
        }
    }, [activePlaylistId, filterPlaylists, handleCancelDeleteConfirm])

    const renderPlaylist = useCallback((data) => {
        return <ul>
            {
                data.map((item) => {
                    const {id, specialType, name, coverImgUrl, trackCount} = item
                    const selected = id === playlistId

                    return <li key={id} styleName={`item ${selected ? 'selected' : ''}`}
                               onClick={() => handleSelectPlaylist(id)}>
                        <img src={getThumbnail(coverImgUrl, 140)} alt="歌单封面" styleName="cover"/>
                        <div styleName="meta">
                            <div title={name} styleName="name">{name}</div>
                            <div styleName="count">{trackCount}首</div>
                            {specialType === DEFAULT_PLAYLIST_TYPE ? null : <div styleName="actions">
                                <span styleName="edit"/>
                                <span styleName="delete" onClick={(e) => handleShowDeleteConfirm(e, id)}/>
                            </div>}
                        </div>
                    </li>
                })
            }
        </ul>
    }, [playlistId, handleSelectPlaylist, handleShowDeleteConfirm])

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
        <Confirm
            visible={confirmVisible}
            confirmLoading={deleteLoading}
            content='确定删除歌单？'
            onCancel={handleCancelDeleteConfirm}
            onOk={handleDeletePlaylist}
        />
    </div>
}

export default MyMusicSidebar
