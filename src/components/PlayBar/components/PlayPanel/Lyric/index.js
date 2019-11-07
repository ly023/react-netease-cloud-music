/**
 * 歌词
 */
import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {requestLyric} from 'services/song'
import VerticalScrollbar from 'components/VerticalScrollbar'
import {DEFAULT_SECOND} from 'constants/play'
import {getLyric} from 'utils/song'
import {CONTENT_HEIGHT} from '../../../constants'

import './index.scss'

const DURATION = 1000 // 动画执行时间

@connect(({user}) => ({
    isDragProgress: user.isDragProgress,
    isPlaying: user.isPlaying,
    currentPlayedTime: user.currentPlayedTime
}))
export default class Lyric extends React.Component {
    static propTypes = {
        visible: PropTypes.bool,
        height: PropTypes.number,
        songId: PropTypes.number,
    }

    static defaultProps = {
        visible: false,
        height: CONTENT_HEIGHT,
    }

    constructor(props) {
        super(props)
        this.state = {
            lyric: {},
            reportPopoverVisible: false
        }
        this.requestedSongId = 0
        this.requestAnimationFrameId = 0
    }

    componentDidMount() {
        this._isMounted = true
        if (this.verticalScrollbarRef) {
            this.scrollbarRef = this.verticalScrollbarRef.getScrollbarRef()
        }
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.visible
    }

    componentDidUpdate(prevProps) {
        const {visible, songId, isDragProgress} = this.props
        if (visible && songId && (songId !== prevProps.songId || this.requestedSongId !== songId)) {
            this.fetchLyric(songId)
            return
        }
        if(this.requestedSongId === songId) {
            // 非拖拽/有歌词/有歌词时间，才滚动
            if (!isDragProgress && this.hasLyric && this.hasTime) {
                this.scrollToCurrentTime()
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    setVerticalScrollbarRef = (ref) => {
        this.verticalScrollbarRef = ref
    }

    scrollToTop = () => {
        this.scrollbarRef && this.scrollbarRef.scrollToTop()
    }

    scrollToCurrentTime = () => {
        if (this.scrollbarRef) {
            if (this.convertedLyric) {
                const seconds = Object.keys(this.convertedLyric).map(key => this.convertedLyric[key].second)
                const currentTime = this.props.currentPlayedTime
                let activeTime
                for (let i = 0; i < seconds.length; i++) {
                    const time = seconds[i]
                    const nextTime = seconds[i + 1]
                    if (currentTime >= time) {
                        if (i !== seconds.length - 1) {
                            if (currentTime < nextTime) {
                                activeTime = time
                                break
                            }
                        } else {
                            activeTime = time
                        }
                    }
                }
                if (typeof activeTime === 'undefined' || activeTime === this.prevActiveTime) {
                    return
                }

                const activeEle = document.querySelector(`.lyric-line[data-seconds="${activeTime}"]`)
                if (activeEle) {
                    const activeEleHeight = activeEle.offsetHeight
                    const offset = activeEle.offsetTop - (this.props.height - activeEleHeight) / 2
                    const scrollTop = offset < 0 ? 0 : offset
                    const currentScrollTop = this.scrollbarRef.getScrollTop()
                    const duration = DURATION
                    const intervalTime = 50
                    const intervalHeight = Math.round(Math.abs((scrollTop - currentScrollTop) / (duration / intervalTime)))
                    let intervalScrollTop = currentScrollTop

                    this.prevActiveTime = activeTime

                    // 向下滚动
                    if (currentScrollTop < scrollTop) {
                        const scrollDown = () => {
                            intervalScrollTop += intervalHeight
                            if (intervalScrollTop >= scrollTop) {
                                intervalScrollTop = scrollTop
                                window.cancelAnimationFrame(this.requestAnimationFrameId)
                            } else {
                                this.requestAnimationFrameId = window.requestAnimationFrame(scrollDown)
                            }
                            this.scrollbarRef.scrollTop(intervalScrollTop)
                        }
                        this.requestAnimationFrameId = window.requestAnimationFrame(scrollDown)
                    } else {
                        // 向上滚动
                        const scrollUp = () => {
                            intervalScrollTop -= intervalHeight
                            if (intervalScrollTop <= scrollTop) {
                                intervalScrollTop = scrollTop
                                window.cancelAnimationFrame(this.requestAnimationFrameId)
                            } else {
                                this.requestAnimationFrameId = window.requestAnimationFrame(scrollUp)
                            }
                            this.scrollbarRef.scrollTop(intervalScrollTop)
                        }
                        this.requestAnimationFrameId = window.requestAnimationFrame(scrollUp)
                    }
                }
            }
        }
    }

    fetchLyric = async (id) => {
        const res = await requestLyric({id: id})
        if (this._isMounted) {
            this.requestedSongId = id
            this.setState({
                lyric: res
            })
            this.scrollToTop()
        }
    }

    getRenderLyric = (lyric) => {
        if (!this.props.songId) {
            return ''
        }
        this.hasLyric = false
        if (lyric && Object.keys(lyric).length) {
            const {nolyric, tlyric = {}, lrc = {}} = lyric
            if (nolyric) {
                return <div styleName="no-lyric">纯音乐，无歌词</div>
            }
            if (!tlyric.lyric && !lrc.lyric) {
                return <div styleName="no-lyric">
                    <span>暂时没有歌词</span>
                    <a>求歌词</a>
                </div>
            }
            this.hasLyric = true
            return this.getLyricElement(lyric)
        }
        return ''
    }

    getLyricElement = (lyric) => {
        let lyricElement = []
        this.hasTime = false
        const convertedLyric = getLyric(lyric)
        this.convertedLyric = convertedLyric
        convertedLyric.forEach((item, index) => {
            const {origin, transform} = item
            let innerTime = origin.second
            let originLyrics = origin.lyrics
            if (innerTime !== DEFAULT_SECOND) {
                this.hasTime = true
            }

            // 拖拽播放条时不改变
            const {isDragProgress, isPlaying, currentPlayedTime: currentTime} = this.props
            const activeTime = isDragProgress ? this.prevActiveTime : currentTime

            let isActive = false
            if (isPlaying || (activeTime !== DEFAULT_SECOND && activeTime !== 0)) {
                const nextItem = convertedLyric[index + 1]
                if (activeTime >= innerTime) {
                    if (index === convertedLyric.length - 1) {
                        isActive = true
                    } else if (activeTime < nextItem.origin.second) {
                        isActive = true
                    }
                }
            }

            if (transform) {
                let transformLyrics = transform.lyrics
                originLyrics.forEach((v, i) => {
                    let innerText = ''
                    if (transformLyrics[i]) {
                        innerText = `${v}<br/>${transformLyrics[i]}`
                    } else {
                        innerText = v
                    }
                    lyricElement.push(
                        <p className="lyric-line"
                            styleName={isActive && i === originLyrics.length - 1 ? 'active' : ''}
                            key={`${innerTime}-${index}-${i}`}
                            data-seconds={innerTime}
                            dangerouslySetInnerHTML={{__html: innerText}}
                        />
                    )
                })

            } else {
                originLyrics.forEach((v, i) => {
                    if (innerTime !== DEFAULT_SECOND || v) {
                        lyricElement.push(
                            <p className="lyric-line"
                                styleName={isActive && i === originLyrics.length - 1 ? 'active' : ''}
                                key={`${innerTime}-${index}-${i}`}
                                data-seconds={innerTime}
                            >
                                {v}
                            </p>
                        )
                    }
                })
            }
        })
        if (!this.hasTime) {
            lyricElement.unshift(<p key="tip">*该歌词不支持自动滚动* <a>求滚动歌词</a></p>)
        }
        return lyricElement
    }

    handleClickAsk = () => {
        this.setState((prevState) => {
            return {
                reportPopoverVisible: !prevState.reportPopoverVisible
            }
        })
    }

    render() {
        const {height} = this.props
        const {lyric, reportPopoverVisible} = this.state

        return (
            <div styleName="lyric-wrapper" style={{height: height}}>
                <div styleName="ask-icon" onClick={this.handleClickAsk}><span/></div>
                <div styleName="report-popover" style={{display: reportPopoverVisible ? 'block' : 'none'}}>
                    <Link to="/">报错</Link>
                </div>
                <VerticalScrollbar ref={this.setVerticalScrollbarRef}>
                    <div styleName="lyric">
                        {this.getRenderLyric(lyric)}
                    </div>
                </VerticalScrollbar>
            </div>
        )
    }
}
