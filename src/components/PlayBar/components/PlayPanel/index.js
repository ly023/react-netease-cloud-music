import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import emitter from 'utils/eventEmitter'
import {setUserPlayInfo} from 'actions/user'
import {getThumbnail} from 'utils'
import {isShuffleMode} from 'utils/song'
import {CONTENT_HEIGHT} from '../../constants'
import SongList from './SongList'
import Lyric from './Lyric'

import './index.scss'

@connect(({user}) => ({
    playSetting: user.playSetting,
    shuffle: user.shuffle
}))
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
        // 随机模式下清空shuffle
        const {playSetting} = this.props
        if (isShuffleMode(playSetting)) {
            this.props.dispatch(setUserPlayInfo({shuffle: []}))
        }
        emitter.emit('play', {
            trackQueue: [],
            index: 0,
            hasChangeTrackQueue: true
        })
    }

    handleRemove = (id) => {
        const {trackQueue, index: playIndex} = this.props
        const {playSetting} = this.props
        let deleteIndex = 0
        const newTrackQueue = trackQueue.filter((track, i) => {
            if (track.id === id) {
                deleteIndex = i
            }
            return track.id !== id
        })
        // 列表为空
        if (!newTrackQueue.length) {
            // 随机模式下清空shuffle
            if (isShuffleMode(playSetting)) {
                this.props.dispatch(setUserPlayInfo({shuffle: []}))
            }
            emitter.emit('play', {
                trackQueue: [],
                index: 0,
                hasChangeTrackQueue: true
            })
            return
        }
        let newPlayIndex
        // 删除的是当前定位的歌曲
        if (deleteIndex === playIndex) {
            if (deleteIndex !== trackQueue.length - 1) {
                newPlayIndex = playIndex
            } else {
                // 如果删除的是最后一行
                newPlayIndex = playIndex - 1 >= 0 ? playIndex - 1 : 0
            }
            const emitData = {
                trackQueue: newTrackQueue,
                index: newPlayIndex,
                hasChangeTrackQueue: true
            }
            emitter.emit('play', emitData)
        } else {
            newPlayIndex = playIndex
            if (deleteIndex < playIndex) {
                // 重新计算当前的播放index
                newPlayIndex = playIndex - 1
            }
            const newPlaySetting = {
                ...playSetting,
                index: newPlayIndex
            }
            this.props.dispatch(setUserPlayInfo({
                trackQueue: newTrackQueue,
                playSetting: newPlaySetting
            }))
        }
        // 随机模式下，重新计算shuffle
        if (isShuffleMode(playSetting)) {
            const shuffle = [...this.props.shuffle]
            const deletedShuffleIndex = shuffle.findIndex(v => v === deleteIndex)

            const restShuffle = shuffle
                .filter((v) => {
                    return v !== deleteIndex
                })
                .map((v) => {
                    if (v > deleteIndex) {
                        return v - 1
                    }
                    return v
                })

            let newShuffle = []
            for (let i = 0; i < restShuffle.length; i++) {
                const v = restShuffle[i]
                if(v !== newPlayIndex) {
                    if(i !== deletedShuffleIndex) {
                        newShuffle.push(v)
                    } else {
                        newShuffle.push(newPlayIndex)
                        newShuffle.push(v)
                    }
                }
            }
            this.props.dispatch(setUserPlayInfo({shuffle: newShuffle}))
        }
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

        return (
            <div styleName="panel" style={panelStyle}>
                <img
                    styleName="img-bg"
                    style={{top: "-360px"}}
                    src={this.getPanelBackgroundImage()}
                />
                <div styleName="content" style={{height: CONTENT_HEIGHT}}/>
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
                        <div styleName="mask" style={{height: CONTENT_HEIGHT}}/>
                        <SongList
                            visible={visible}
                            height={CONTENT_HEIGHT}
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
                        <Lyric visible={visible} height={CONTENT_HEIGHT} songId={trackQueue[index]?.id}/>
                    </div>
                </div>
            </div>
        )
    }
}
