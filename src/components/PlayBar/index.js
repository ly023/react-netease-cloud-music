/**
 * 底部播放条
 */
import {PureComponent, createRef} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {shuffle as _shuffle} from 'lodash'
import pubsub from 'utils/pubsub'
import {TIP_TIMEOUT} from 'constants'
import {PLAY_MODE} from 'constants/music'
import KEY from 'constants/keyboardEventKey'
import {setUserPlayer} from 'actions/user'
// import {requestDetail as requestSongDetail} from 'services/song'
import {
    setLocalStorage,
    getLocalStorage,
    formatDuration,
    getThumbnail,
    disableTextSelection,
    click,
} from 'utils'
import {isShuffleMode, getArtists} from 'utils/song'
import AddToPlaylist from 'components/business/AddToPlaylist'
import {isPlaying} from './utils'
import PlayPanel from './components/PlayPanel'

import './index.scss'

const SHOW_BOTTOM = 0
const HIDE_BOTTOM = -47
const TIMEOUT = 500
const PLAYED_INTERVAL = 250
const INTERVAL = {
    SHOW: 10,
    HIDE: 3,
    TIME: 20
}

const PLAY_BAR_DOM_ID = 'play-bar'

@connect(({user}) => ({
    player: user.player
}))
export default class PlayBar extends PureComponent {
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

            playedTipVisible: false,
            addedTipVisible: false,
        }

        this.progressRef = createRef()
        this.volumeDotRef = createRef()
        this.volumeLineRef = createRef()

        this.timeoutId = 0
        this.songPlayedIntervalId = 0
        this.autoPlay = false

        this.audio = new Audio()
        // this.cachedSongs = {} // {id: {song}}

        this.isDragVolume = false
        this.startVolumeY = 0
        this.endVolumeY = 0
        this.volumeHeight = 0
        this.endVolumeLength = 0

        this.startProgressX = 0
        this.endProgressX = 0
        this.endPlayedLength = 0
        this.progressWidth = 0

        this.tipTimeout = 0
    }

    componentDidMount() {
        document.addEventListener('click', this.handleDocumentClick)

        this.getInitialSetting()

        this.playSubscribeId = pubsub.subscribe('play', this.emitterOnPlay)
        this.addSubscribeId = pubsub.subscribe('add', this.emitterOnAdd)
        this.closeSubscribeId = pubsub.subscribe('close', this.emitterOnClose)

        this.progressWidth = this.progressRef.current.offsetWidth
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleDocumentClick)
        document.removeEventListener('keydown', this.keyDownEventListener)

        window.clearTimeout(this.timeoutId)
        window.clearInterval(this.songPlayedIntervalId)

        pubsub.unsubscribe(this.playSubscribeId, this.addSubscribeId, this.closeSubscribeId)
    }

    handleDocumentClick = (e) => {
        click(e, PLAY_BAR_DOM_ID, () => {
            this.closePanel()
        })
    }

    closePanel = () => {
        this.setState({
            playPanelVisible: false,
            volumeVisible: false
        })
    }

    getInitialSetting = () => {
        let playSetting
        let trackQueue
        const localPlaySetting = getLocalStorage('playSetting')
        if (localPlaySetting) {
            playSetting = localPlaySetting
            this.props.dispatch(setUserPlayer({playSetting}))
        } else {
            playSetting = this.props.player.playSetting
            setLocalStorage('playSetting', playSetting)
        }
        const localTrackQueue = getLocalStorage('trackQueue')
        if (localTrackQueue) {
            trackQueue = localTrackQueue
            this.props.dispatch(setUserPlayer({trackQueue}))
        } else {
            trackQueue = []
            setLocalStorage('trackQueue', trackQueue)
        }

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

        // 事件监听
        this.keyEventListener()
        this.audioListener()
    }

    createShuffle = (index, trackQueue) => {
        const indexes = Array.from({length: trackQueue.length}, (_, i) => i)
        indexes.splice(index, 1)
        const shuffle = [index].concat(_shuffle(indexes))
        this.props.dispatch(setUserPlayer({shuffle}))
    }

    emitterOnPlay = (eventType, emitData) => {
        const {trackQueue, index, hasChangeTrackQueue, autoPlay} = emitData
        if (autoPlay) {
            this.autoPlay = true
        }
        this.play(trackQueue, index, hasChangeTrackQueue)

        // 播放提示
        if (trackQueue.length) {
            this.setState({playedTipVisible: true, addedTipVisible: false})
            if (this.tipTimeout) {
                window.clearTimeout(this.tipTimeout)
            }
            this.tipTimeout = setTimeout(() => {
                this.setState({playedTipVisible: false})
            }, TIP_TIMEOUT)
        }
    }

    emitterOnAdd = () => {
        // 添加到播放列表提示
        this.setState({playedTipVisible: false, addedTipVisible: true})
        if (this.tipTimeout) {
            window.clearTimeout(this.tipTimeout)
        }
        this.tipTimeout = setTimeout(() => {
            this.setState({addedTipVisible: false})
        }, TIP_TIMEOUT)
    }

    emitterOnClose = () => {
        this.closePanel()
    }

    play = (trackQueue, index, hasChangeTrackQueue) => {
        if (hasChangeTrackQueue) {
            this.props.dispatch(setUserPlayer({trackQueue}))
            setLocalStorage('trackQueue', trackQueue)
        }
        // index: 当前播放的index
        const playSetting = {...this.props.player.playSetting, index: index}
        setLocalStorage('playSetting', playSetting)

        // 暂停上一个音频, 重置播放进度条，重置加载进度
        if (isPlaying(this.audio)) {
            this.audio.pause()
        }
        this.props.dispatch(setUserPlayer({
            playSetting,
            isPlaying: false,
            currentPlayedTime: 0,
            currentSong: trackQueue[index]
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

    getSongUrlById = (id) => {
        if (id) {
            return `https://music.163.com/song/media/outer/url?id=${id}.mp3`
        }
    }

    fetchSongUrl = (id) => {
        this.audio.src = this.getSongUrlById(id)
        // const cachedSong = this.cachedSongs[id]
        // if (cachedSong) {
        //     return
        // }
        // requestSongDetail({ids: id})
        //     .then((res) => {
        //             const song = res.songs?.[0]
        //             if (song) {
        //                 this.props.dispatch(setUserPlayer({currentSong: song}))
        //                 this.cachedSongs[id] = song
        //             }
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

            // console.log('playedInterval', currentTime)

            if (buffered.length) {
                let playedPercent = (100 * currentTime / duration).toFixed(2)
                this.setState({
                    playedPercent: playedPercent,
                })
                this.props.dispatch(setUserPlayer({currentPlayedTime: currentTime}))
            }
        }, PLAYED_INTERVAL)
    }

    /** 监听键盘事件 */
    keyEventListener = () => {
        document.addEventListener('keydown', this.keyDownEventListener)
    }

    keyDownEventListener = (e) => {
        // todo 目前加shift才有效
        const {key} = e
        if (key === KEY.F8) { // 播放 暂停
            this.handlePlay()
            return
        }
        if(key === KEY.F7) {
            this.handlePlayPrev()
            return
        }
        if(key === KEY.F9) {
            this.handlePlayNext()
        }
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
            this.setState({
                loading: true
            })
        })
    }

    loadedListener = () => {
        this.audio.addEventListener('loadeddata', () => {
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
            this.props.dispatch(setUserPlayer({isPlaying: true}))
            this.playedInterval()
        })
    }

    pauseListener = () => {
        this.audio.addEventListener('pause', () => {
            window.clearInterval(this.songPlayedIntervalId)
            this.props.dispatch(setUserPlayer({isPlaying: false}))
        })
    }

    endedListener = () => {
        this.audio.addEventListener('ended', () => {
            window.clearInterval(this.songPlayedIntervalId)
            this.props.dispatch(setUserPlayer({isPlaying: false}))

            // 当前正在播放，加载下一个
            if (this.autoPlay) {
                const {trackQueue} = this.props.player
                const nextIndex = this.getNextIndex(true)
                this.play(trackQueue, nextIndex)
            }
        })
    }

    errorListener = () => {
        this.audio.addEventListener('error', () => {
            // 音频错误
        })
    }

    /** 点击上一首 */
    handlePlayPrev = () => {
        const {trackQueue} = this.props.player
        const prevIndex = this.getPrevIndex()
        this.play(trackQueue, prevIndex)
    }

    /** 点击下一首 */
    handlePlayNext = () => {
        const {trackQueue} = this.props.player
        const nextIndex = this.getNextIndex(false)
        this.play(trackQueue, nextIndex)
    }

    /** 获取前一个播放的队列索引 */
    getPrevIndex = () => {
        const {trackQueue, playSetting} = this.props.player
        const {mode, index} = playSetting
        let prevIndex = index
        if (mode === PLAY_MODE.LOOP || mode === PLAY_MODE.ORDER) { // 单曲循环和顺序播放
            prevIndex = index - 1
            if (prevIndex < 0) {
                prevIndex = trackQueue.length - 1
            }
        } else if (mode === PLAY_MODE.SHUFFLE) {  // 随机播放
            const {shuffle} = this.props.player
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
        const {trackQueue, playSetting} = this.props.player
        const {mode, index} = playSetting
        let nextIndex = index
        if (mode === PLAY_MODE.LOOP) { // 单曲循环
            if (autoPlay) {
                nextIndex = index
            } else {
                nextIndex = trackQueue.length > 1 ? index + 1 : index
            }
        } else if (mode === PLAY_MODE.ORDER) { // 顺序播放
            nextIndex = index + 1
            if (nextIndex > trackQueue.length - 1) {
                nextIndex = 0
            }
        } else if (mode === PLAY_MODE.SHUFFLE) {
            const {shuffle} = this.props.player
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
        const {trackQueue} = this.props.player
        if(trackQueue.length) {
            if (isPlaying(this.audio)) {
                this.autoPlay = false
                this.audio.pause()
                return
            }
            this.autoPlay = true
            this.playAudio()
        }
    }

    playPanelItem = (trackQueue, index) => {
        // 暂停上一个音频
        if (isPlaying(this.audio)) {
            this.audio.pause()
        }
        this.autoPlay = true
        this.play(trackQueue, index)
        // 随机模式下手动点击播放，重新计算shuffle
        const {playSetting} = this.props.player
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
        const {playSetting} = this.props.player

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
        const {playSetting} = this.props.player

        if (playSetting.isLocked) {
            return
        }

        this.timeoutId = window.setTimeout(() => {
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
        let playSetting = {...this.props.player.playSetting}
        playSetting.isLocked = !playSetting.isLocked
        this.props.dispatch(setUserPlayer({playSetting}))
        setLocalStorage('playSetting', playSetting)
    }

    handleProgressClick = (e) => {
        if (!this.getSong()) {
            return
        }
        const boundingClientRect = this.progressRef.current.getBoundingClientRect()
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
        this.props.dispatch(setUserPlayer({isDragProgress: true}))
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
        if (!this.props.player.isDragProgress) {
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

        // 清除当前播放interval id
        if (this.songPlayedIntervalId) {
            window.clearInterval(this.songPlayedIntervalId)
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
        this.props.dispatch(setUserPlayer({currentPlayedTime: currentTime}))

        if (isPlaying(this.audio)) {
            this.playedInterval()
        }
    }

    handleProgressMouseUp = () => {
        if (!this.props.player.isDragProgress) {
            return
        }
        this.props.dispatch(setUserPlayer({isDragProgress: false}))
        this.bindProgressEvent(true)
    }

    /** 音量控制 */
    handleVolumeControl = () => {
        this.setState((prevState) => {
            return {
                volumeVisible: !prevState.volumeVisible
            }
        }, () => {
            if (this.state.volumeVisible) {
                if (!this.volumeDotR) {
                    this.volumeDotR = this.volumeDotRef.current.offsetHeight / 2
                }
                if (!this.volumeHeight) {
                    this.volumeHeight = parseInt(window.getComputedStyle(this.volumeLineRef.current).height, 10)
                }
                const volumeLength = this.props.player.playSetting.volume * this.volumeHeight
                this.setVolumeStyle(volumeLength)
            }
        })
    }

    setVolume = (volume) => {
        this.audio.volume = volume
    }

    setVolumeStyle = (volumeLength) => {
        const offset = 4
        const maxTop = this.volumeHeight - (this.volumeDotR - offset) * 2
        let volumeTop
        if (!volumeLength) {
            volumeTop = maxTop
        } else {
            volumeTop = this.volumeHeight - volumeLength - (this.volumeDotR - offset) * 2
        }
        if (volumeTop < -offset) {
            volumeTop = -offset
        }
        if (volumeTop > maxTop) {
            volumeTop = maxTop
        }
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
        const playSetting = {...this.props.player.playSetting}
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
            volume = volumeLength / this.volumeHeight
        }
        playSetting.volume = volume
        this.setVolumeStyle(volumeLength)
        this.setVolume(volume)
        this.props.dispatch(setUserPlayer({playSetting}))
        setLocalStorage('playSetting', playSetting)
    }

    handleVolumeMouseUp = () => {
        this.isDragVolume = false
        this.bindVolumeEvent(true)
    }

    /** 点击音量条调节 */
    handleVolumeClick = (e) => {
        const boundingClientRect = this.volumeLineRef.current.getBoundingClientRect()
        const {bottom} = boundingClientRect
        const clientY = e.clientY
        const volumeLength = bottom - clientY
        this.setVolumeStyle(volumeLength)
    }

    /** 更改播放模式 */
    changeMode = () => {
        let playSetting = {...this.props.player.playSetting}
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
            this.createShuffle(playSetting.index, this.props.player.trackQueue)
        }
        playSetting.mode = modes[currentModeIndex]
        this.props.dispatch(setUserPlayer({playSetting}))
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
        const {playSetting, trackQueue} = this.props.player
        return trackQueue[playSetting.index]
    }

    render() {
        const {trackQueue, playSetting, isPlaying, currentPlayedTime} = this.props.player

        const {
            playBarStyle,
            playPanelVisible,
            loading,
            readyPercent,
            playedPercent,
            volumeVisible,
            volumeLength,
            volumeDotStyle,
            playedTipVisible,
            addedTipVisible,
        } = this.state

        const song = this.getSong() || {}
        const {id, artists, radio} = song

        return (
            <div
                id={PLAY_BAR_DOM_ID}
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
                    <Link to={`/song/${id}`} styleName="cover" onClick={this.closePanel}>
                        <img
                            src={getThumbnail(song?.picUrl || song?.album?.picUrl, 68)}
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
                            <Link to={`/song/${id}`} styleName="song-name"
                                  onClick={this.closePanel}>{song.name}{song.program ? '[电台节目]' : ''}</Link>
                            {song.mvid ?
                                <Link to={`/mv/${song.mvid}`} styleName="mv" onClick={this.closePanel}/> : null}
                            {
                                Array.isArray(artists)
                                    ? <div styleName="singer" title={getArtists(artists)}>
                                        {
                                            artists.map((artist, i) => {
                                                return <span key={artist.id}>
                                                    <Link to={`/artist/${artist.id}`}
                                                          onClick={this.closePanel}>{artist.name}</Link>
                                                    {i !== artists.length - 1 ? '/' : ''}
                                                </span>
                                            })
                                        }
                                    </div>
                                    : null
                            }
                            {
                                radio ? <div styleName="singer"><Link to={`/radio/${radio.id}`}
                                                                      onClick={this.closePanel}>{radio.name}</Link>
                                </div> : null
                            }
                        </div>
                        <div
                            ref={this.progressRef}
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
                        <AddToPlaylist songIds={[id]}>
                            <span styleName="icon collect" title="收藏"/>
                        </AddToPlaylist>
                        <span styleName="icon share" title="分享"/>
                    </div>
                    <div styleName="setting">
                        <div styleName="volume">
                            {/* 音量图标 */}
                            <div onClick={this.handleVolumeControl}>
                                {
                                    playSetting.volume
                                        ? <span styleName="icon volume-icon volume-sound"/>
                                        : <span styleName="icon volume-icon volume-mute"/>
                                }
                            </div>
                            {/* 音量控制 */}
                            <div
                                style={{display: volumeVisible ? 'inline-block' : 'none'}}
                                styleName="volume-ctrl"
                            >
                                <div
                                    ref={this.volumeLineRef}
                                    styleName="volume-line"
                                    onClick={this.handleVolumeClick}
                                >
                                    <div styleName="volume-current" style={{height: volumeLength + 'px'}}/>
                                    <span
                                        ref={this.volumeDotRef}
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
                            <div style={{display: playedTipVisible ? 'block' : 'none'}}
                                 styleName="operation-tip">已开始播放
                            </div>
                            <div style={{display: addedTipVisible ? 'block' : 'none'}}
                                 styleName="operation-tip">已添加到播放列表
                            </div>
                            {trackQueue.length}
                        </div>
                    </div>
                </div>
                {/* 锁定 */}
                <div styleName="lock">
                    <span styleName="lock-icon" onClick={this.handleLock}/>
                </div>
                <PlayPanel
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
