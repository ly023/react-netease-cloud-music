/**
 *  播放
 */
import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import _ from 'lodash'
import emitter from 'utils/eventEmitter'
import {PLAY_TYPE} from 'constants/play'
import {setUserPlayInfo} from 'actions/user'
import {requestDetail as requestPlaylistDetail} from 'services/playlist'
import {requestDetail as requestSongDetail} from 'services/song'
import {requestDetail as requestAlbumDetail} from 'services/album'
import {hasPrivilege, isShuffleMode} from 'utils/song'

@connect(({user}) => ({
    playSetting: user.playSetting,
    trackQueue: user.trackQueue,
    shuffle: user.shuffle
}))
export default class Play extends React.PureComponent {
    static propTypes = {
        type: PropTypes.oneOf([PLAY_TYPE.SINGLE.TYPE, PLAY_TYPE.PLAYLIST.TYPE, PLAY_TYPE.ALBUM.TYPE]).isRequired,
        id: PropTypes.number.isRequired,
    }

    static defaultProps = {
        type: PLAY_TYPE.SINGLE.TYPE,
    }

    constructor(props) {
        super(props)
        this.state = {}
    }

    /**
     * 播放规则：
     * 播放歌单和专辑，随机播放模式下也是从第一首开始
     * 插入单曲，添加到播放列表尾部，随机播放模式下重新排列shuffle
     */
    handlePlay = async () => {
        const {type, id} = this.props
        const playSetting = this.props.playSetting || {}
        const localTrackQueue = this.props.trackQueue || []
        let trackQueue = []
        let index = 0
        let hasChangeTrackQueue = true
        let emitPlay = true
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
                    const track = this.formatTrack(song)
                    trackQueue = localTrackQueue.concat([track])
                    index = trackQueue.length - 1
                    // 随机模式重新计算shuffle
                    if (isShuffleMode(playSetting)) {
                        const {shuffle} = this.props
                        const shuffleIndex = shuffle.findIndex((v) => v === index)
                        let newShuffle = [...shuffle]
                        if (shuffleIndex === -1) {
                            newShuffle = _.shuffle(shuffle.concat([index]))
                        }
                        this.props.dispatch(setUserPlayInfo({shuffle: newShuffle}))
                    }
                } else {
                    emitPlay = false
                }
            }
        } else {
            let newTrackQueue = []
            if (type === PLAY_TYPE.PLAYLIST.TYPE) {
                const res = await requestPlaylistDetail({id})
                const tracks = res?.playlist?.tracks || []
                const privileges = res?.privileges || []
                for (let i = 0; i < tracks.length; i++) {
                    const item = tracks[i]
                    const privilege = privileges[i]
                    if (hasPrivilege(privilege)) {
                        newTrackQueue.push(this.formatTrack(item))
                    }
                }
            } else if (type === PLAY_TYPE.ALBUM.TYPE) {
                const res = await requestAlbumDetail({id})
                const tracks = res?.songs || []
                for (let i = 0; i < tracks.length; i++) {
                    const item = tracks[i]
                    const {privilege = {}} = item
                    if (hasPrivilege(privilege)) {
                        newTrackQueue.push(this.formatTrack(item))
                    }
                }
            }
            if (newTrackQueue.length) {
                trackQueue = newTrackQueue
                // 随机模式下重新计算shuffle
                if (isShuffleMode(playSetting)) {
                    this.setShuffle(trackQueue, index)
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

    formatTrack = (song) => {
        return {
            id: song.id,
            name: song.name,
            duration: song.dt, // 单位ms
            album: song.al,
            artists: song.ar,
            mvid: song.mv || song.mvid, // mv id
            privilege: song.privilege, // 特权
            st: song.st, // 是否可用（有版权），不为0不可播放
        }
    }

    setShuffle = (trackQueue, startIndex) => {
        const indexes = Array.from({length: trackQueue.length}, (_, i) => i)
        indexes.splice(startIndex, 1)
        const shuffle = [startIndex].concat(_.shuffle(indexes))
        this.props.dispatch(setUserPlayInfo({shuffle}))
    }

    render() {
        const {children} = this.props
        const onlyChildren = React.Children.only(children)

        return (
            React.cloneElement(onlyChildren, {
                onClick: this.handlePlay
            })
        )
    }
}
