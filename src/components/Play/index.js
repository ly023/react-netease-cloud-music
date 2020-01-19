/**
 *  播放
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
import {requestDetail as requestRadioDetail} from 'services/radio'
import useShallowEqualSelector from 'utils/useShallowEqualSelector'
import {hasPrivilege, isShuffleMode, formatTrack} from 'utils/song'

function Play(props) {
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
     * 播放规则：
     * 播放歌单和专辑，随机播放模式下也是从第一首开始
     * 插入单曲，添加到播放列表尾部，随机播放模式下重新排列shuffle
     */
    const handlePlay = async (e) => {
        e.stopPropagation()
        const {type, id, songs} = props
        const playSetting = selectedState.playSetting || {}
        const localTrackQueue = selectedState.trackQueue || []
        let trackQueue = []
        let index = 0
        let hasChangeTrackQueue = true
        let emitPlay = true
        // 单曲
        if (type === PLAY_TYPE.SINGLE.TYPE) {
            const trackIndex = localTrackQueue.findIndex((v) => v.id === id)
            if (trackIndex !== -1) {
                trackQueue = localTrackQueue
                index = trackIndex
            } else {
                const res = await requestSongDetail({ids: id})
                const song = res?.songs?.[0] || {}
                const privilege = res?.privileges?.[0] || {}

                if (hasPrivilege(privilege)) {
                    const track = formatTrack(song)
                    trackQueue = localTrackQueue.concat([track])
                    index = trackQueue.length - 1
                    // 随机模式重新计算shuffle
                    if (isShuffleMode(playSetting)) {
                        const {shuffle} = selectedState
                        const shuffleIndex = shuffle.findIndex((v) => v === index)
                        let newShuffle = [...shuffle]
                        if (shuffleIndex === -1) {
                            newShuffle = _.shuffle(shuffle.concat([index]))
                        }
                        dispatch(setUserPlayer({shuffle: newShuffle}))
                    }
                } else {
                    emitPlay = false
                }
            }
        // 电台节目
        } else if(type === PLAY_TYPE.PROGRAM.TYPE) {
            const trackIndex = localTrackQueue.findIndex((v) => v.id === id)
            if (trackIndex !== -1) {
                trackQueue = localTrackQueue
                index = trackIndex
            } else {
                const res = await requestRadioDetail({id})
                const track = formatTrack(res?.program, true)
                trackQueue = localTrackQueue.concat([track])
                index = trackQueue.length - 1
                // 随机模式重新计算shuffle
                if (isShuffleMode(playSetting)) {
                    const {shuffle} = selectedState
                    const shuffleIndex = shuffle.findIndex((v) => v === index)
                    let newShuffle = [...shuffle]
                    if (shuffleIndex === -1) {
                        newShuffle = _.shuffle(shuffle.concat([index]))
                    }
                    dispatch(setUserPlayer({shuffle: newShuffle}))
                }
            }
        } else {
            // 歌单、专辑
            let newTrackQueue = []
            if (type === PLAY_TYPE.PLAYLIST.TYPE) {
                if (id && !Number.isNaN(id)) {
                    const res = await requestPlaylistDetail({id})
                    const tracks = res?.playlist?.tracks || []
                    const privileges = res?.privileges || []
                    for (let i = 0; i < tracks.length; i++) {
                        const item = tracks[i]
                        const privilege = privileges[i]
                        if (hasPrivilege(privilege)) {
                            newTrackQueue.push(formatTrack(item))
                        }
                    }
                } else if (songs.length) {
                    for (let i = 0; i < songs.length; i++) {
                        const item = songs[i]
                        if (hasPrivilege(item.privilege)) {
                            newTrackQueue.push(formatTrack(item))
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
                        newTrackQueue.push(formatTrack(item))
                    }
                }
            }
            if (newTrackQueue.length) {
                trackQueue = newTrackQueue
                // 随机模式下重新计算shuffle
                if (isShuffleMode(playSetting)) {
                    setShuffle(trackQueue, index)
                }
            } else {
                trackQueue = localTrackQueue
                hasChangeTrackQueue = false
                emitPlay = false
            }
        }


        if (emitPlay) {
            const emitData = {
                trackQueue: trackQueue,
                index: index,
                hasChangeTrackQueue: hasChangeTrackQueue,
                autoPlay: true
            }
            emitter.emit('play', emitData)
        }
    }

    const {children} = props
    const onlyChildren = React.Children.only(children)

    return (
        React.cloneElement(onlyChildren, {
            onClick: handlePlay
        })
    )
}

const types = Object.keys(PLAY_TYPE).map((key)=> PLAY_TYPE[key].TYPE)

Play.propTypes = {
    type: PropTypes.oneOf(types).isRequired,
    id: PropTypes.number,
    songs: PropTypes.array,
}

Play.defaultProps = {
    type: PLAY_TYPE.SINGLE.TYPE,
    songs: [],
}

export default React.memo(Play)
