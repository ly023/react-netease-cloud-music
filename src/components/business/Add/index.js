/**
 *  添加到播放列表
 */
import {useCallback, cloneElement, Children, memo} from 'react'
import PropTypes from 'prop-types'
import {useDispatch} from 'react-redux'
import {shuffle as _shuffle} from 'lodash'
import pubsub from 'utils/pubsub'
import {PLAY_TYPE} from 'constants/music'
import {setUserPlayer} from 'actions/user'
import {requestDetail as requestPlaylistDetail} from 'services/playlist'
import {requestDetail as requestSongDetail} from 'services/song'
import {requestDetail as requestAlbumDetail} from 'services/album'
import {requestDetail as requestProgramDetail} from 'services/program'
import {setLocalStorage} from 'utils'
import useShallowEqualSelector from 'utils/useShallowEqualSelector'
import {hasPrivilege, isShuffleMode, formatTrack} from 'utils/song'

const types = Object.keys(PLAY_TYPE).map((key) => PLAY_TYPE[key].TYPE)

function Add(props) {
    const dispatch = useDispatch()

    const selectedState = useShallowEqualSelector(({user}) => ({
        playSetting: user.player.playSetting,
        trackQueue: user.player.trackQueue,
        shuffle: user.player.shuffle
    }))

    const setShuffle = useCallback((trackQueue, startIndex) => {
        const indexes = Array.from({length: trackQueue.length}, (_, i) => i)
        indexes.splice(startIndex, 1)
        const shuffle = [startIndex].concat(_shuffle(indexes))
        dispatch(setUserPlayer({shuffle}))
    }, [dispatch])

    const {type = PLAY_TYPE.SINGLE.TYPE, id, songs = []} = props

    /**
     * 添加规则：顺序添加，随机模式下重新排列shuffle
     */
    const handleAdd = useCallback(async (e) => {
        e.stopPropagation()
        const playSetting = selectedState.playSetting || {}
        const localTrackQueue = selectedState.trackQueue || []
        let trackQueue = []
        let index = 0
        let hasChangeTrackQueue = false
        if (type === PLAY_TYPE.SINGLE.TYPE) {
            const trackIndex = localTrackQueue.findIndex((v) => v.id === id)
            if (trackIndex !== -1) {
                trackQueue = localTrackQueue
                // 提示
                pubsub.publish('add')
            } else {
                const res = await requestSongDetail({ids: id})
                const song = res?.songs?.[0] || {}
                const privilege = res?.privileges?.[0] || {}

                if (hasPrivilege(privilege)) {
                    pubsub.publish('add')
                    hasChangeTrackQueue = true
                    const track = formatTrack(song)
                    trackQueue = localTrackQueue.concat([track])
                    const newTrackIndex = trackQueue.length - 1
                    // 随机模式重新计算shuffle
                    if (isShuffleMode(playSetting)) {
                        const {shuffle} = selectedState
                        const shuffleIndex = shuffle.findIndex((v) => v === newTrackIndex)
                        let newShuffle = [...shuffle]
                        if (shuffleIndex === -1) {
                            newShuffle = _shuffle(shuffle.concat([newTrackIndex]))
                        }
                        dispatch(setUserPlayer({shuffle: newShuffle}))
                    }
                }
            }
        }// 电台节目
        else if (type === PLAY_TYPE.PROGRAM.TYPE) {
            const trackIndex = localTrackQueue.findIndex((v) => v.program.id === id)
            if (trackIndex !== -1) {
                trackQueue = localTrackQueue
                pubsub.publish('add')
            } else {
                const res = await requestProgramDetail({id})
                pubsub.publish('add')
                hasChangeTrackQueue = true
                const track = formatTrack(res?.program, true)
                trackQueue = localTrackQueue.concat([track])
                const newTrackIndex = trackQueue.length - 1
                // 随机模式重新计算shuffle
                if (isShuffleMode(playSetting)) {
                    const {shuffle} = selectedState
                    const shuffleIndex = shuffle.findIndex((v) => v === newTrackIndex)
                    let newShuffle = [...shuffle]
                    if (shuffleIndex === -1) {
                        newShuffle = _shuffle(shuffle.concat([newTrackIndex]))
                    }
                    dispatch(setUserPlayer({shuffle: newShuffle}))
                }
            }
        } else {
            let additionalTrackQueue = []
            if (type === PLAY_TYPE.PLAYLIST.TYPE) {
                if (id && !Number.isNaN(id)) {
                    const res = await requestPlaylistDetail({id})
                    const tracks = res?.playlist?.tracks || []
                    const privileges = res?.privileges || []
                    for (let i = 0; i < tracks.length; i++) {
                        const item = tracks[i]
                        const privilege = privileges[i]
                        if (hasPrivilege(privilege)) {
                            additionalTrackQueue.push(formatTrack(item))
                        }
                    }
                } else if (songs.length) {
                    for (let i = 0; i < songs.length; i++) {
                        const item = songs[i]
                        const index = localTrackQueue.findIndex(v => v.id === item.id)
                        if (index === -1 && hasPrivilege(item.privilege)) {
                            additionalTrackQueue.push(formatTrack(item))
                        }
                    }
                }
            } else if (type === PLAY_TYPE.ALBUM.TYPE) {
                const res = await requestAlbumDetail({id})
                const tracks = res?.songs || []
                for (let i = 0; i < tracks.length; i++) {
                    const item = tracks[i]
                    const {privilege = {}} = item
                    if (hasPrivilege(privilege)) {
                        additionalTrackQueue.push(formatTrack(item))
                    }
                }
            }
            if (additionalTrackQueue.length) {
                pubsub.publish('add')
                hasChangeTrackQueue = true
                trackQueue = localTrackQueue.concat(additionalTrackQueue)
                // 随机模式下重新计算shuffle
                if (isShuffleMode(playSetting)) {
                    setShuffle(trackQueue, index)
                }
            } else {
                trackQueue = localTrackQueue
                if (songs.length) {
                    pubsub.publish('add')
                }
            }
        }
        if (hasChangeTrackQueue) {
            setLocalStorage('trackQueue', trackQueue)
            dispatch(setUserPlayer({trackQueue}))
        }
    }, [dispatch, type, id, songs, selectedState, setShuffle])

    const {children} = props
    const onlyChildren = Children.only(children)

    return (
        cloneElement(onlyChildren, {
            onClick: handleAdd
        })
    )
}

Add.propTypes = {
    type: PropTypes.oneOf(types).isRequired,
    id: PropTypes.number,
    songs: PropTypes.array,
}

export default memo(Add)
