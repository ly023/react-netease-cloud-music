/**
 * 底部播放条
 */
import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import _ from 'lodash'
import emitter from 'utils/eventEmitter'
import {PLAY_MODE} from 'constants/play'
import KEY_CODE from 'constants/keyCode'
import {setLocalStorage, getLocalStorage, formatDuration, getThumbnail, disableTextSelection} from 'utils'
import {setUserPlayInfo} from 'actions/user'
import {isShuffleMode, getArtists} from 'utils/song'
import PlayPanel from './components/PlayPanel'

import './index.scss'

const SHOW_BOTTOM = 0
const HIDE_BOTTOM = -47
const TIMEOUT = 500
const PLAYED_INTERVAL = 200
const INTERVAL = {
    SHOW: 10,
    HIDE: 3,
    TIME: 20
}

@connect(({user}) => ({
    user,
}))
export default class PlayBar extends React.PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            playPanelVisible: false,

            playBarStyle: {},

            loading: false,
            readyPercent: 0,
            playedPercent: 0,
            playedLength: 0,

            volumeVisible: false,
            volumeLength: 0,
            volumeDotStyle: {},

        }

        this.timeoutId = 0
        this.songPlayedIntervalId = 0
        this.autoPlay = false

        this.audio = new Audio()
        // this.songUrls = {} // {id: url}

        this.isDragVolume = false
        this.startVolumeY = 0
        this.endVolumeY = 0
        this.volumeHeight = 0
        this.endVolumeLength = 0

        this.startProgressX = 0
        this.endProgressX = 0
        this.endPlayedLength = 0
        this.progressWidth = 0
    }

    componentDidMount() {
        this.getInitialSetting()

        emitter.on('play', ({trackQueue, index, hasChangeTrackQueue, autoPlay}) => {
            if (autoPlay) {
                this.autoPlay = true
            }
            this.play(trackQueue, index, hasChangeTrackQueue)
        })

        emitter.on('close', () => {
            if (this.state.playPanelVisible) {
                this.setState({playPanelVisible: false})
            }
        })

        this.volumeHeight = parseInt(window.getComputedStyle(this.volumeLineRef).height, 10)
        this.volumeDotR = parseInt(window.getComputedStyle(this.volumeDotRef).height, 10) / 2
        this.progressWidth = this.progressRef.offsetWidth
    }

    componentWillUnmount() {
    }

    getInitialSetting = () => {
        let playSetting
        let trackQueue
        const localPlaySetting = getLocalStorage('playSetting')
        if (localPlaySetting) {
            playSetting = localPlaySetting
            this.props.dispatch(setUserPlayInfo({playSetting}))
        } else {
            playSetting = this.props.user.playSetting
            setLocalStorage('playSetting', playSetting)
        }
        const localTrackQueue = getLocalStorage('trackQueue')
        if (localTrackQueue) {
            trackQueue = localTrackQueue
            this.props.dispatch(setUserPlayInfo({trackQueue}))
        } else {
            trackQueue = []
            setLocalStorage('trackQueue', trackQueue)
        }

        // 事件监听
        this.keyEventListener()
        this.audioListener()

        // 初始化播放进度条
        const song = trackQueue[playSetting.index]
        if (song) {
            const {id} = song
            this.fetchSongUrl(id)
        }

        // 随机播放模式，初始化随机播放索引
        if (isShuffleMode(playSetting)) {
            this.createShuffle(playSetting.index, trackQueue)
        }
    }

    createShuffle = (index, trackQueue) => {
        const indexes = Array.from({length: trackQueue.length}, (_, i) => i)
        indexes.splice(index, 1)
        const shuffle = [index].concat(_.shuffle(indexes))
        this.props.dispatch(setUserPlayInfo({shuffle}))
    }

    play = (trackQueue, index, hasChangeTrackQueue) => {
        if (hasChangeTrackQueue) {
            this.props.dispatch(setUserPlayInfo({trackQueue}))
            setLocalStorage('trackQueue', trackQueue)
        }
        // index: 当前播放的index
        const playSetting = {...this.props.user.playSetting, index: index}
        setLocalStorage('playSetting', playSetting)

        // 暂停上一个音频, 重置播放进度条，重置加载进度
        if (!this.audio.paused) {
            this.audio.pause()
        }
        this.props.dispatch(setUserPlayInfo({
            playSetting,
            isPlaying: false,
            currentPlayedTime: 0,
        }))
        this.setState({
            readyPercent: 0,
            playedPercent: 0,
            playedLength: 0,
        })

        // 根据歌曲id请求歌曲url
        if (trackQueue.length) {
            const song = trackQueue[index]
            if (song) {
                const {id} = song
                this.fetchSongUrl(id)
            }
        }
    }

    fetchSongUrl = (id) => {
        // 解决部分url 403
        this.audio.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
        // const cachedUrl = this.songUrls[id]
        // if(cachedUrl) {
        //     this.audio.src = cachedUrl
        //     return
        // }
        // requestResource({id: id})
        //     .then((res) => {
        //         if (res && res.code === 200) {
        //             const song = res.data?.[0] || {}
        //             const url = song.url
        //             if (url) {
        //                 this.songUrls[id] = url
        //                 this.audio.src = url
        //             }
        //         }
        //     })
    }

    playAudio = () => {
        const promise = this.audio.play()
        if (promise !== undefined) {
            promise
                .then(() => {
                })
                .catch(() => {
                })
        }
    }

    playedInterval = () => {
        if (this.songPlayedIntervalId) {
            window.clearInterval(this.songPlayedIntervalId)
        }
        this.songPlayedIntervalId = window.setInterval(() => {
            const {buffered, currentTime, duration} = this.audio

            console.log('playedInterval', currentTime)

            if (buffered.length) {
                let playedPercent = (100 * currentTime / duration).toFixed(2)
                this.setState({
                    playedPercent: playedPercent,
                })
                this.props.dispatch(setUserPlayInfo({currentPlayedTime: currentTime}))
            }
        }, PLAYED_INTERVAL)
    }

    /** 监听键盘事件 */
    keyEventListener = () => {
        document.addEventListener('keydown', (e) => {
            const {keyCode} = e
            if (keyCode === KEY_CODE.F8) { // 暂停
                this.handlePlay()
            }
        })
    }

    /** 音频相关事件 */
    audioListener = () => {
        this.loadstartListener()
        this.loadedListener()
        this.progressListener()
        this.playListener()
        this.pauseListener()
        this.endedListener()
        this.errorListener()
    }

    loadstartListener = () => {
        this.audio.addEventListener('loadstart', () => {
            // console.log('loadstart')

            this.setState({
                loading: true
            })
        })
    }

    loadedListener = () => {
        this.audio.addEventListener('loadeddata', () => {
            // console.log('loadeddata')

            if (this.autoPlay) {
                this.playAudio()
            }

            this.setState({
                loading: false,
            })
        })
    }

    progressListener = () => {
        this.audio.addEventListener('progress', () => {
            // console.log('progress')
            const {buffered, duration} = this.audio

            if (buffered.length) {
                let readyPercent = (100 * buffered.end(0) / duration).toFixed(2)
                this.setState({
                    readyPercent: readyPercent,
                })
            }
        })
    }

    playListener = () => {
        this.audio.addEventListener('play', () => {
            // console.log('play')

            this.props.dispatch(setUserPlayInfo({isPlaying: true}))
            this.playedInterval()
        })
    }

    pauseListener = () => {
        this.audio.addEventListener('pause', () => {
            window.clearInterval(this.songPlayedIntervalId)
            this.props.dispatch(setUserPlayInfo({isPlaying: false}))
        })
    }

    endedListener = () => {
        this.audio.addEventListener('ended', () => {
            window.clearInterval(this.songPlayedIntervalId)
            this.props.dispatch(setUserPlayInfo({isPlaying: false}))

            // 当前正在播放，加载下一个
            if (this.autoPlay) {
                const {trackQueue} = this.props.user
                const nextIndex = this.getNextIndex(true)
                this.play(trackQueue, nextIndex)
            }
        })
    }

    errorListener = () => {
        this.audio.addEventListener('error', () => {

        })
    }

    /** 点击上一首 */
    handlePlayPrev = () => {
        const {trackQueue} = this.props.user
        const prevIndex = this.getPrevIndex()
        this.play(trackQueue, prevIndex)
    }

    /** 点击下一首 */
    handlePlayNext = () => {
        const {trackQueue} = this.props.user
        const nextIndex = this.getNextIndex(false)
        this.play(trackQueue, nextIndex)
    }

    /** 获取前一个播放的队列索引 */
    getPrevIndex = () => {
        const {trackQueue, playSetting} = this.props.user
        const {mode, index} = playSetting
        let prevIndex = index
        if (mode === PLAY_MODE.LOOP || mode === PLAY_MODE.ORDER) { // 单曲循环和顺序播放
            prevIndex = index - 1
            if (prevIndex < 0) {
                prevIndex = trackQueue.length - 1
            }
        } else if (mode === PLAY_MODE.SHUFFLE) {  // 随机播放
            const {shuffle} = this.props.user
            const shuffleIndex = shuffle.findIndex((v) => v === index)
            let prevShuffleIndex = shuffleIndex - 1
            if (prevShuffleIndex < 0) {
                prevShuffleIndex = shuffle.length - 1
            }
            prevIndex = shuffle[prevShuffleIndex]
        }
        return prevIndex
    }

    /** 获取后一个播放的队列索引 */
    getNextIndex = (autoPlay) => {
        const {trackQueue, playSetting} = this.props.user
        const {mode, index} = playSetting
        let nextIndex = index
        if (mode === PLAY_MODE.LOOP) { // 单曲循环
            if (autoPlay) {
                nextIndex = index
            } else {
                nextIndex = index + 1
            }
        } else if (mode === PLAY_MODE.ORDER) { // 顺序播放
            nextIndex = index + 1
            if (nextIndex > trackQueue.length - 1) {
                nextIndex = 0
            }
        } else if (mode === PLAY_MODE.SHUFFLE) {
            const {shuffle} = this.props.user
            const shuffleIndex = shuffle.findIndex((v) => v === index)
            let nextShuffleIndex = shuffleIndex + 1
            if (nextShuffleIndex > (shuffle.length - 1)) {
                nextShuffleIndex = 0
            }
            nextIndex = shuffle[nextShuffleIndex]
        }
        return nextIndex
    }

    handlePlay = () => {
        if (this.audio.paused) {
            this.autoPlay = true
            this.playAudio()
        } else {
            this.autoPlay = false
            this.audio.pause()
        }
    }

    playPanelItem = (trackQueue, index) => {
        this.autoPlay = true
        this.play(trackQueue, index)
        // 随机模式下手动点击播放，重新计算shuffle
        const {playSetting} = this.props.user
        if (isShuffleMode(playSetting)) {
            this.createShuffle(index, trackQueue)
        }
    }

    handleSwitchPlayPanel = () => {
        this.setState((prevState) => {
            return {
                playPanelVisible: !prevState.playPanelVisible
            }
        })
    }

    showPlayBar = () => {
        const {playSetting} = this.props.user

        if (playSetting.isLocked) {
            return
        }

        window.clearTimeout(this.timeoutId)

        let timer = window.setInterval(() => {
            let bottom = this.state.playBarStyle.bottom || ''

            if (bottom + INTERVAL.SHOW >= SHOW_BOTTOM) {
                bottom = SHOW_BOTTOM
                window.clearInterval(timer)
            } else {
                bottom += INTERVAL.SHOW
            }

            this.setState({
                playBarStyle: {bottom},
            })
        }, INTERVAL.TIME)
    }

    hidePlayBar = () => {
        const {playSetting} = this.props.user

        if (playSetting.isLocked) {
            return
        }

        this.timeoutId = setTimeout(() => {
            let timer = setInterval(() => {
                let bottom = this.state.playBarStyle.bottom || 0

                if (bottom - INTERVAL.HIDE <= HIDE_BOTTOM) {
                    bottom = HIDE_BOTTOM
                    window.clearInterval(timer)
                } else {
                    bottom -= INTERVAL.HIDE
                }

                this.setState({
                    playBarStyle: {bottom},
                })
            }, INTERVAL.TIME)
        }, TIMEOUT)
    }

    handleLock = () => {
        let playSetting = {...this.props.user.playSetting}
        playSetting.isLocked = !playSetting.isLocked
        this.props.dispatch(setUserPlayInfo({playSetting}))
        setLocalStorage('playSetting', playSetting)
    }

    handleProgressClick = (e) => {
        if (!this.getSong()) {
            return
        }
        const boundingClientRect = this.progressRef.getBoundingClientRect()
        const {left} = boundingClientRect
        const clientX = e.clientX
        const playedLength = clientX - left

        const played = playedLength / this.progressWidth
        const playedPercent = (played * 100).toFixed(2)

        this.seekPlay(played)

        this.setState({
            playedLength,
            playedPercent: playedPercent,
        })
    }

    handleProgressMouseDown = (e) => {
        if (!this.getSong()) {
            return
        }
        this.props.dispatch(setUserPlayInfo({isDragProgress: true}))
        this.startProgressX = e.clientX
        this.endPlayedLength = this.state.playedLength
        this.bindProgressEvent()
    }

    bindProgressEvent = (remove) => {
        let functionName = 'addEventListener'
        if (remove) {
            functionName = 'removeEventListener'
        }
        document[functionName]('mousemove', this.handleProgressMouseMove, false)
        document[functionName]('mouseup', this.handleProgressMouseUp, false)
    }

    handleProgressMouseMove = (e) => {
        if (!this.props.user.isDragProgress) {
            return
        }
        disableTextSelection()
        this.endProgressX = e.clientX
        let moveX = this.endProgressX - this.startProgressX
        let playedLength = this.endPlayedLength + moveX
        if (playedLength > this.progressWidth) {
            playedLength = this.progressWidth
        } else if (playedLength < 0) {
            playedLength = 0
        }

        const played = playedLength / this.progressWidth
        const playedPercent = (played * 100).toFixed(2)

        this.seekPlay(played)

        this.setState({
            playedLength: playedLength,
            playedPercent: playedPercent,
        })
    }

    seekPlay = (played) => {
        const {duration, buffered} = this.audio
        let currentTime = played * duration

        // 清除当前播放计时
        if (this.songPlayedIntervalId) {
            window.clearInterval(this.songPlayedIntervalId)
        }

        if (!this.audio.paused) {
            this.playedInterval()
        }

        // 音频跳跃播放
        // Safari浏览器
        if ('fastSeek' in this.audio) {
            // 改变audio.currentTime的值
            this.audio.fastSeek(currentTime)
        } else {
            // 回到缓冲的最大位置处
            if (buffered.length) {
                const endBufferedTime = buffered.end(buffered.length - 1)
                if (currentTime > endBufferedTime) {
                    currentTime = endBufferedTime < 0 ? 0 : endBufferedTime
                }
                this.audio.currentTime = currentTime
            }
        }
        this.props.dispatch(setUserPlayInfo({currentPlayedTime: currentTime}))
    }

    handleProgressMouseUp = () => {
        if (!this.props.user.isDragProgress) {
            return
        }
        this.props.dispatch(setUserPlayInfo({isDragProgress: false}))
        this.bindProgressEvent(true)
    }

    /** 音量控制 */
    handleVolumeControl = () => {
        this.setState((prevState) => {
            return {
                volumeVisible: !prevState.volumeVisible
            }
        }, () => {
            const {playSetting} = this.props.user
            const {volumeVisible} = this.state
            if (volumeVisible) {
                const volumeLength = playSetting.volume * this.volumeHeight
                this.setVolumeStyle(volumeLength)
            }
        })
    }

    setVolume = (volume) => {
        this.audio.volume = volume
    }

    setVolumeStyle = (volumeLength) => {
        let volumeTop = parseFloat(Number(Math.min(this.volumeHeight - volumeLength, this.volumeHeight - this.volumeDotR)).toFixed(1))
        const volumeDotStyle = {top: `${volumeTop}px`}
        this.setState({
            volumeLength,
            volumeDotStyle
        })
    }

    handleVolumeMouseDown = (e) => {
        this.isDragVolume = true
        this.startVolumeY = e.clientY
        this.endVolumeLength = this.state.volumeLength
        this.bindVolumeEvent()
    }

    bindVolumeEvent = (remove) => {
        let functionName = 'addEventListener'
        if (remove) {
            functionName = 'removeEventListener'
        }
        document[functionName]('mousemove', this.handleVolumeMouseMove, false)
        document[functionName]('mouseup', this.handleVolumeMouseUp, false)
    }

    handleVolumeMouseMove = (e) => {
        if (!this.isDragVolume) {
            return
        }
        disableTextSelection()
        const playSetting = {...this.props.user.playSetting}
        this.endVolumeY = e.clientY
        let moveY = this.startVolumeY - this.endVolumeY
        let volumeLength = this.endVolumeLength + moveY
        let volume = playSetting.volume
        if (volumeLength >= this.volumeHeight) {
            volume = 1
            volumeLength = this.volumeHeight
        } else if (volumeLength < 0) {
            volume = 0
            volumeLength = 0
        } else {
            volume = parseFloat(Number(volumeLength / this.volumeHeight).toFixed(1))
        }
        playSetting.volume = volume
        this.setVolumeStyle(volumeLength)
        this.setVolume(volume)
        this.props.dispatch(setUserPlayInfo({playSetting}))
        setLocalStorage('playSetting', playSetting)
    }

    handleVolumeMouseUp = () => {
        this.isDragVolume = false
        this.bindVolumeEvent(true)
    }

    /** 点击音量条调节 */
    handleVolumeClick = (e) => {
        const boundingClientRect = this.volumeLineRef.getBoundingClientRect()
        const {bottom} = boundingClientRect
        const clientY = e.clientY
        const volumeLength = bottom - clientY
        this.setVolumeStyle(volumeLength)
    }

    /** 更改播放模式 */
    changeMode = () => {
        let playSetting = {...this.props.user.playSetting}
        let modes = Object.keys(PLAY_MODE).map((k) => PLAY_MODE[k])
        let currentModeIndex = modes.indexOf(playSetting.mode)
        if (currentModeIndex < modes.length - 1) {
            ++currentModeIndex
        } else {
            currentModeIndex = 0
        }
        const currentMode = modes[currentModeIndex]
        // 切换为随机模式，计算shuffle
        if (currentMode === PLAY_MODE.SHUFFLE) {
            this.createShuffle(playSetting.index, this.props.user.trackQueue)
        }
        playSetting.mode = modes[currentModeIndex]
        this.props.dispatch(setUserPlayInfo({playSetting}))
        setLocalStorage('playSetting', playSetting)
    }

    getRenderMode = (mode) => {
        switch (mode) {
            case PLAY_MODE.LOOP:
                return <a styleName="icon loop" title="单曲循环">单曲循环</a>
            case PLAY_MODE.SHUFFLE:
                return <a styleName="icon shuffle" title="随机">随机</a>
            default:
                return <a styleName="icon order" title="列表循环">列表循环</a>
        }
    }

    getSong = () => {
        const {playSetting, trackQueue} = this.props.user
        return trackQueue[playSetting.index]
    }

    setPlayBarRef = (el) => {
        this.playBarRef = el
    }

    setProgressRef = (el) => {
        this.progressRef = el
    }

    setVolumeDotRef = (el) => {
        this.volumeDotRef = el
    }

    setVolumeLine = (el) => {
        this.volumeLineRef = el
    }

    render() {
        const {trackQueue, playSetting, isPlaying, currentPlayedTime} = this.props.user

        const {
            playBarStyle,
            playPanelVisible,
            loading,
            readyPercent,
            playedPercent,
            volumeVisible,
            volumeLength,
            volumeDotStyle,
        } = this.state

        const song = this.getSong() || {}

        return (
            <div
                ref={this.setPlayBarRef}
                styleName={`wrapper ${playSetting.isLocked ? "locked" : "unlock"}`}
                style={playBarStyle}
                onMouseEnter={this.showPlayBar}
                onMouseLeave={this.hidePlayBar}>
                <div styleName="cont">
                    <div styleName="btn">
                        <a
                            styleName="prev"
                            title="上一首(ctrl+←)"
                            onClick={this.handlePlayPrev}
                        >上一首</a>
                        {
                            isPlaying
                                ? <a styleName="play" title="播放/暂停(p)" onClick={this.handlePlay}>播放/暂停</a>
                                : <a styleName="pause" title="播放/暂停(p)" onClick={this.handlePlay}>播放/暂停</a>
                        }
                        <a
                            styleName="next"
                            title="下一首(ctrl+→)"
                            onClick={this.handlePlayNext}
                        >下一首</a>
                    </div>
                    <Link to="" styleName="cover">
                        <img
                            src={getThumbnail(song.album?.picUrl, 68)}
                            onError={(e) => {
                                e.target.src = 'http://s4.music.126.net/style/web2/img/default/default_album.jpg'
                            }}
                            alt="封面"
                        />
                    </Link>
                    {/* 歌曲进度条 */}
                    <div
                        styleName="progress"
                    >
                        <div styleName="song-info">
                            <Link to={`/song/${song.id}`} styleName="song-name">{song.name}</Link>
                            {song.mvid ? <Link to={`/mv/${song.mvid}`} styleName="mv"/> : null}
                            {
                                Array.isArray(song.artists)
                                    ? <div styleName="singer" title={getArtists(song.artists)}>
                                        {
                                            song.artists.map((artist, i) => {
                                                return <span key={artist.id}><Link
                                                    to={`/artist/${artist.id}`}>{artist.name}</Link>{i !== song.artists.length - 1 ? '/' : ''}</span>
                                            })
                                        }
                                    </div>
                                    : null
                            }
                            {song.id ? <Link to="/link" styleName="song-source"/> : null}
                        </div>
                        <div
                            ref={this.setProgressRef}
                            styleName="progress-cont"
                            onClick={this.handleProgressClick}
                        >
                            <div styleName="ready" style={{width: `${readyPercent}%`}}/>
                            <div styleName="current" style={{width: `${playedPercent}%`}}/>
                            <div
                                styleName="dot"
                                style={{left: playedPercent + '%'}}
                                onMouseDown={this.handleProgressMouseDown}
                            >
                                <span styleName={`loading ${loading ? 'visible' : 'hidden'}`}/>
                            </div>
                        </div>
                    </div>
                    <div styleName="time">
                        <em>{formatDuration(currentPlayedTime * 1000)}</em> / {formatDuration(song.duration)}
                    </div>
                    <div styleName="operation">
                        <span styleName="icon collect">收藏</span>
                        <span styleName="icon share">分享</span>
                    </div>
                    <div styleName="setting">
                        <div styleName="volume">
                            {/* 音量图标 */}
                            <div onClick={this.handleVolumeControl}>
                                {
                                    playSetting.volume
                                        ?
                                        <span styleName="icon volume-icon volume-sound"/>
                                        :
                                        <span styleName="icon volume-icon volume-mute"/>
                                }
                            </div>
                            {/* 音量控制 */}
                            <div
                                style={{display: volumeVisible ? 'inline-block' : 'none'}}
                                styleName="volume-ctrl"
                            >
                                <div
                                    ref={this.setVolumeLine}
                                    styleName="volume-line"
                                    onClick={this.handleVolumeClick}
                                >
                                    <div styleName="volume-current" style={{height: volumeLength + 'px'}}/>
                                    <span
                                        ref={this.setVolumeDotRef}
                                        style={volumeDotStyle}
                                        styleName="volume-dot"
                                        onMouseDown={this.handleVolumeMouseDown}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* 播放模式 */}
                        <div styleName="mode" onClick={this.changeMode}>
                            {this.getRenderMode(playSetting.mode)}
                        </div>
                        <div styleName="icon playlist-icon" onClick={this.handleSwitchPlayPanel}>
                            {trackQueue.length}
                        </div>
                    </div>
                </div>
                {/* 锁定 */}
                <div styleName="lock">
                    <span styleName="lock-icon" onClick={this.handleLock}/>
                </div>
                <PlayPanel
                    dispatch={this.props.dispatch}
                    visible={playPanelVisible}
                    trackQueue={trackQueue}
                    index={playSetting.index}
                    onPlay={this.playPanelItem}
                    onClose={this.handleSwitchPlayPanel}
                />
            </div>
        )
    }
}
