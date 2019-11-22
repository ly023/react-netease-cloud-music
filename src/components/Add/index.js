/**
 *  添加到播放列表
 */
import React from 'react'
import PropTypes from 'prop-types'
import {useDispatch} from 'react-redux'
import _ from 'lodash'
import emitter from 'utils/eventEmitter'
import {PLAY_TYPE} from 'constants/play'
import {setUserPlayInfo} from 'actions/user'
import {requestDetail as requestPlaylistDetail} from 'services/playlist'
import {requestDetail as requestSongDetail} from 'services/song'
import {requestDetail as requestAlbumDetail} from 'services/album'
import {setLocalStorage} from 'utils'
import useShallowEqualSelector from 'utils/useShallowEqualSelector'
import {hasPrivilege, isShuffleMode, formatTrack} from 'utils/song'

function Add(props) {
    const dispatch = useDispatch()
    const selectedState = useShallowEqualSelector(({user}) => ({
        playSetting: user.playSetting,
        trackQueue: user.trackQueue,
        shuffle: user.shuffle
    }))

    const setShuffle = (trackQueue, startIndex) => {
        const indexes = Array.from({length: trackQueue.length}, (_, i) => i)
        indexes.splice(startIndex, 1)
        const shuffle = [startIndex].concat(_.shuffle(indexes))
        dispatch(setUserPlayInfo({shuffle}))
    }

    /**
     * 添加规则：顺序添加，随机模式下重新排列shuffle
     */
    const handleAdd = async () => {
        const {type, id} = props
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
                        dispatch(setUserPlayInfo({shuffle: newShuffle}))
                    }
                }
            }
        } else {
            let additionalTrackQueue = []
            if (type === PLAY_TYPE.PLAYLIST.TYPE) {
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
            }
        }
        if (hasChangeTrackQueue) {
            setLocalStorage('trackQueue', trackQueue)
            dispatch(setUserPlayInfo({trackQueue}))
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
    id: PropTypes.number.isRequired,
}

Add.defaultProps = {
    type: PLAY_TYPE.SINGLE.TYPE,
}

export default Add
