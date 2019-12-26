/**
 *  添加到播放列表
 */
import React from 'react'
import PropTypes from 'prop-types'
import {useDispatch} from 'react-redux'
import _ from 'lodash'
import emitter from 'utils/eventEmitter'
import {PLAY_TYPE} from 'constants/play'
import {setUserPlayer} from 'actions/user'
import {requestDetail as requestPlaylistDetail} from 'services/playlist'
import {requestDetail as requestSongDetail} from 'services/song'
import {requestDetail as requestAlbumDetail} from 'services/album'
import {setLocalStorage} from 'utils'
import useShallowEqualSelector from 'utils/useShallowEqualSelector'
import {hasPrivilege, isShuffleMode, formatTrack} from 'utils/song'

function Add(props) {
    const dispatch = useDispatch()
    const selectedState = useShallowEqualSelector(({user}) => ({
        playSetting: user.player.playSetting,
        trackQueue: user.player.trackQueue,
        shuffle: user.player.shuffle
    }))

    const setShuffle = (trackQueue, startIndex) => {
        const indexes = Array.from({length: trackQueue.length}, (_, i) => i)
        indexes.splice(startIndex, 1)
        const shuffle = [startIndex].concat(_.shuffle(indexes))
        dispatch(setUserPlayer({shuffle}))
    }

    /**
     * 添加规则：顺序添加，随机模式下重新排列shuffle
     */
    const handleAdd = async (e) => {
        e.stopPropagation()
        const {type, id, songs} = props
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
                emitter.emit('add')
            } else {
                const res = await requestSongDetail({ids: id})
                const song = res?.songs?.[0] || {}
                const privilege = res?.privileges?.[0] || {}

                if (hasPrivilege(privilege)) {
                    emitter.emit('add')
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
                            newShuffle = _.shuffle(shuffle.concat([newTrackIndex]))
                        }
                        dispatch(setUserPlayer({shuffle: newShuffle}))
                    }
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
                emitter.emit('add')
                hasChangeTrackQueue = true
                trackQueue = localTrackQueue.concat(additionalTrackQueue)
                // 随机模式下重新计算shuffle
                if (isShuffleMode(playSetting)) {
                    setShuffle(trackQueue, index)
                }
            } else {
                trackQueue = localTrackQueue
                if (songs.length) {
                    emitter.emit('add')
                }
            }
        }
        if (hasChangeTrackQueue) {
            setLocalStorage('trackQueue', trackQueue)
            dispatch(setUserPlayer({trackQueue}))
        }
    }

    const {children} = props
    const onlyChildren = React.Children.only(children)

    return (
        React.cloneElement(onlyChildren, {
            onClick: handleAdd
        })
    )
}

Add.propTypes = {
    type: PropTypes.oneOf([PLAY_TYPE.SINGLE.TYPE, PLAY_TYPE.PLAYLIST.TYPE, PLAY_TYPE.ALBUM.TYPE]).isRequired,
    id: PropTypes.number,
    songs: PropTypes.array,
}

Add.defaultProps = {
    type: PLAY_TYPE.SINGLE.TYPE,
    songs: [],
}

export default React.memo(Add)
