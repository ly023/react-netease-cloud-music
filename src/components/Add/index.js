/**
 *  添加到播放列表
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
import {setLocalStorage} from 'utils'
import {hasPrivilege, isShuffleMode} from 'utils/song'

@connect(({user}) => ({
    playSetting: user.playSetting,
    trackQueue: user.trackQueue,
    shuffle: user.shuffle
}))
export default class Add extends React.PureComponent {
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
     * 添加规则：顺序添加，随机模式下重新排列shuffle
     */
    handleAdd = async () => {
        const {type, id} = this.props
        const playSetting = this.props.playSetting || {}
        const localTrackQueue = this.props.trackQueue || []
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
                    const track = this.formatTrack(song)
                    trackQueue = localTrackQueue.concat([track])
                    const newTrackIndex = trackQueue.length - 1
                    // 随机模式重新计算shuffle
                    if (isShuffleMode(playSetting)) {
                        const {shuffle} = this.props
                        const shuffleIndex = shuffle.findIndex((v) => v === newTrackIndex)
                        let newShuffle = [...shuffle]
                        if (shuffleIndex === -1) {
                            newShuffle = _.shuffle(shuffle.concat([newTrackIndex]))
                        }
                        this.props.dispatch(setUserPlayInfo({shuffle: newShuffle}))
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
                        additionalTrackQueue.push(this.formatTrack(item))
                    }
                }
            } else if (type === PLAY_TYPE.ALBUM.TYPE) {
                const res = await requestAlbumDetail({id})
                const tracks = res?.songs || []
                for (let i = 0; i < tracks.length; i++) {
                    const item = tracks[i]
                    const {privilege = {}} = item
                    if (hasPrivilege(privilege)) {
                        additionalTrackQueue.push(this.formatTrack(item))
                    }
                }
            }
            if (additionalTrackQueue.length) {
                emitter.emit('add')
                hasChangeTrackQueue = true
                trackQueue = localTrackQueue.concat(additionalTrackQueue)
                // 随机模式下重新计算shuffle
                if (isShuffleMode(playSetting)) {
                    this.setShuffle(trackQueue, index)
                }
            } else {
                trackQueue = localTrackQueue
            }
        }
        if (hasChangeTrackQueue) {
            setLocalStorage('trackQueue', trackQueue)
            this.props.dispatch(setUserPlayInfo({trackQueue}))
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
                onClick: this.handleAdd
            })
        )
    }
}
