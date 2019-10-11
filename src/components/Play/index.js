/**
 *  播放
 */
import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import _ from 'lodash'
import emitter from 'utils/eventEmitter'
import {PLAY_TYPE} from 'constants/play'
import {setUserShuffle} from 'actions/user'
import {requestDetail as requestPlaylistDetail} from 'services/playlist'
import {requestDetail as requestSongDetail} from 'services/song'
import {requestDetail as requestAlbumDetail} from 'services/album'
import {hasPrivilege, isShuffleMode} from 'utils/song'

import './index.scss'

@connect(({user}) => ({
    user,
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

    componentDidMount() {
    }

    /**
     * 播放规则：
     * 播放歌单和专辑，随机播放模式下也是从第一首个开始
     * 插入单曲，添加到播放列表尾部，随机播放模式下将index插入shuffle剩余的部分重新排序
     */
    handlePlay = async () => {
        // 关闭面板
        emitter.emit('close')

        const {type, id} = this.props
        const playSetting = this.props.user.playSetting || {}
        const localTrackQueue = this.props.user.trackQueue || []
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
                if (hasPrivilege(song.privilege)) {
                    const track = this.formatTrack(song)
                    trackQueue = localTrackQueue.concat([track])
                    const newTrackIndex = trackQueue.length - 1
                    index = newTrackIndex
                    // 随机模式重新计算shuffle
                    if (isShuffleMode(playSetting)) {
                        const {shuffle} = this.props.user
                        const currentIndex = playSetting.index
                        const shuffleIndex = shuffle.findIndex((v) => v === currentIndex)
                        if (shuffleIndex !== -1) {
                            let restShuffle = shuffle.slice(shuffleIndex + 1)
                            restShuffle.push(newTrackIndex)
                            const newRestShuffle = _.shuffle(restShuffle)
                            const newShuffle = shuffle.slice(0, shuffleIndex + 1).concat(newRestShuffle)
                            this.props.dispatch(setUserShuffle(newShuffle))
                        }
                    }
                } else {
                    emitPlay = false
                }
            }
        } else if (type === PLAY_TYPE.PLAYLIST.TYPE) {
            const res = await requestPlaylistDetail({id})
            const tracks = res?.playlist?.tracks || []
            const privileges = res?.privileges || []
            let newTrackQueue = []
            for (let i = 0; i < tracks.length; i++) {
                const item = tracks[i]
                const privilege = privileges[i]
                if (hasPrivilege(privilege)) {
                    newTrackQueue.push(this.formatTrack(item))
                }
            }
            if (newTrackQueue.length) {
                trackQueue = newTrackQueue
                // 随机模式下重新计算shuffle
                if(isShuffleMode(playSetting)) {
                    this.setShuffle(trackQueue, index)
                }
            } else {
                trackQueue = localTrackQueue
                hasChangeTrackQueue = false
                emitPlay = false
            }
        } else if (type === PLAY_TYPE.ALBUM.TYPE) {
            const res = await requestAlbumDetail({id})
            const tracks = res?.songs || []
            let newTrackQueue = []
            for (let i = 0; i < tracks.length; i++) {
                const item = tracks[i]
                const {privilege = {}} = item
                if (hasPrivilege(privilege)) {
                    newTrackQueue.push(this.formatTrack(item))
                }
            }
            if (newTrackQueue.length) {
                trackQueue = newTrackQueue
                // 随机模式下重新计算shuffle
                if(isShuffleMode(playSetting)) {
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
        this.props.dispatch(setUserShuffle(shuffle))
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
