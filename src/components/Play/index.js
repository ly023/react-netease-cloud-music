/**
 *  播放
 */
import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import emitter from 'utils/eventEmitter'
import {PLAY_TYPE} from 'constants/play'
import {requestDetail as requestPlaylistDetail} from 'services/playlist'
import {requestDetail as requestSongDetail} from 'services/song'

import './index.scss'

@connect(({user}) => ({
    user,
}))
export default class Play extends React.PureComponent {
    static propTypes = {
        type: PropTypes.oneOf([PLAY_TYPE.SINGLE.TYPE, PLAY_TYPE.PLAYLIST.TYPE]).isRequired,
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

    handlePlay = async () => {
        // 关闭面板
        emitter.emit('close')

        const {type, id} = this.props
        let trackQueue = []
        let tracks = []

        if (type === PLAY_TYPE.SINGLE.TYPE) {
            const localTrackQueue = this.props.user.trackQueue || []
            const trackIndex = localTrackQueue.findIndex((v) => v.id === id)
            if (trackIndex !== -1) {
                const data = {
                    trackQueue: localTrackQueue,
                    index: trackIndex,
                    hasChangeTrackQueue: true
                }
                emitter.emit('play', data)
            } else {
                const res = await requestSongDetail({ids: id})
                const song = res?.songs?.[0] || []
                const track = this.formatTrack(song)
                const newTrackQueue = localTrackQueue.concat([track])
                const data = {
                    trackQueue: newTrackQueue,
                    index: newTrackQueue.length - 1,
                    hasChangeTrackQueue: true
                }
                emitter.emit('play', data)
            }
        } else if (type === PLAY_TYPE.PLAYLIST.TYPE) {
            const res = await requestPlaylistDetail({id})
            tracks = res?.playlist?.tracks || []
            trackQueue = tracks.map((v) => {
                return this.formatTrack(v)
            })
            const data = {
                trackQueue,
                index: 0,
                hasChangeTrackQueue: true
            }
            emitter.emit('play', data)
        }
    }

    formatTrack = (song) => {
        return {
            id: song.id,
            name: song.name,
            duration: song.dt, // 单位ms
            album: song.al,
            artists: song.ar,
        }
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
