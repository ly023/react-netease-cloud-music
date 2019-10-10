import React from 'react'
import PropTypes from 'prop-types'
import emitter from 'utils/eventEmitter'
import {getThumbnail} from 'utils'
import SongList from './SongList'
import Lyric from './Lyric'

import './index.scss'

export default class PlayPanel extends React.Component {

    static propTypes = {
        visible: PropTypes.bool,
        trackQueue: PropTypes.array,
        index: PropTypes.number,
        onPlay: PropTypes.func,
        onClose: PropTypes.func,
    }

    static defaultProps = {
        visible: false,
        trackQueue: [],
        index: 0,
    }

    constructor(props) {
        super(props)
        this.state = {}
    }

    handleClose = () => {
        const {onClose} = this.props
        onClose && onClose()
    }

    handlePlay = (trackQueue, index) => {
        const {onPlay} = this.props
        onPlay && onPlay(trackQueue, index)
    }

    handleClear = () => {
        emitter.emit('play', {
            trackQueue: [],
            index: 0,
            hasChangeTrackQueue: true
        })
    }

    handleRemove = (id) => {
        const {trackQueue, index: playIndex} = this.props
        let deleteIndex = 0
        let newPlayIndex = playIndex
        const newTrackQueue = trackQueue.filter((track, i) => {
            if (track.id === id) {
                deleteIndex = i
            }
            return track.id !== id
        })

        if (deleteIndex < playIndex) {
            // 重新计算当前的播放index
            newPlayIndex = playIndex - 1
        }
        emitter.emit('play', {
            trackQueue: newTrackQueue,
            index: newPlayIndex,
            hasChangeTrackQueue: true
        })
    }

    // 取当前播放的歌曲作为背景图
    getPanelBackgroundImage = () => {
        const {trackQueue, index} = this.props
        const song = trackQueue[index]
        return getThumbnail(song?.album?.picUrl, 640)
    }

    render() {
        const {visible, trackQueue, index} = this.props
        const panelStyle = visible ? {} : {height: 0}
        const height = 260

        return (
            <div styleName="panel" style={panelStyle}>
                <img
                    styleName="img-bg"
                    style={{top: "-360px"}}
                    src={this.getPanelBackgroundImage()}
                />
                <div styleName="content"/>
                <div styleName="song-list-wrapper">
                    <div styleName="title">
                        <h4>播放列表({trackQueue.length})</h4>
                        <div styleName="operation">
                            <span styleName="add-all"><i/>收藏</span>
                            <span styleName="line"/>
                            <span styleName="clear" onClick={this.handleClear}><i/>清除</span>
                        </div>
                    </div>
                    <div styleName="song-list">
                        <div styleName="mask"/>
                        <SongList
                            visible={visible}
                            height={height}
                            trackQueue={trackQueue}
                            index={index}
                            onPlay={this.handlePlay}
                            onRemove={this.handleRemove}
                        />
                    </div>
                </div>
                <div styleName="lyric-wrapper">
                    <div styleName="title">
                        <h4>{trackQueue[index]?.name}</h4>
                        <span styleName="close" onClick={this.handleClose}/>
                    </div>
                    <div styleName="lyric">
                        <div styleName="mask"/>
                        <Lyric height={height} songId={trackQueue[index]?.id}/>
                    </div>
                </div>
            </div>
        )
    }
}
