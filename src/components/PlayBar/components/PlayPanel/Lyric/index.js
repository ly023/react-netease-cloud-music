/**
 * 歌词
 */
import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {requestLyric} from 'services/song'
import VerticalScrollbar from 'components/VerticalScrollbar'

import './index.scss'

const DEFAULT_SECOND = -1
// const DELAYED_MILLISECONDS = 100 // 延迟执行的毫秒数
const DURATION = 1000 // 动画执行时间

@connect(({user}) => ({user}))
export default class Lyric extends React.Component {
    static propTypes = {
        visible: PropTypes.bool,
        height: PropTypes.number,
        songId: PropTypes.number,
        currentTime: PropTypes.number,
    }

    static defaultProps = {
        visible: false,
        height: 260,
        currentTime: DEFAULT_SECOND
    }

    constructor(props) {
        super(props)
        this.state = {
            lyric: {},
            reportPopoverVisible: false
        }
        this.requestId = 0
    }

    componentDidMount() {
        this.mounted = true
        if (this.verticalScrollbarRef) {
            this.scrollbarRef = this.verticalScrollbarRef.getScrollbarRef()
        }
    }

    componentDidUpdate(prevProps) {
        const {visible, songId, currentTime, user} = this.props
        if (songId && songId !== prevProps.songId) {
            this.fetchLyric(songId)
            return
        }
        if (visible && !user.isDragProgress && currentTime !== prevProps.currentTime) {
            this.scrollToCurrentTime()
        }
    }

    componentWillUnmount() {
        this.mounted = false
    }

    setVerticalScrollbarRef = (ref) => {
        this.verticalScrollbarRef = ref
    }

    scrollToTop = () => {
        this.scrollbarRef && this.scrollbarRef.scrollToTop()
    }

    scrollToCurrentTime = () => {
        if (this.scrollbarRef) {
            const {convertedLyric} = this
            if (convertedLyric) {
                const seconds = Object.keys(convertedLyric).map(key => convertedLyric[key].second)
                const currentTime = this.props.user.currentPlayedTime
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
                                window.cancelAnimationFrame(this.requestId)
                            } else {
                                this.requestId = window.requestAnimationFrame(scrollDown)
                            }
                            this.scrollbarRef.scrollTop(intervalScrollTop)
                        }
                        this.requestId = window.requestAnimationFrame(scrollDown)
                    } else {
                        // 向上滚动
                        const scrollUp = () => {
                            intervalScrollTop -= intervalHeight
                            if (intervalScrollTop <= scrollTop) {
                                intervalScrollTop = scrollTop
                                window.cancelAnimationFrame(this.requestId)
                            } else {
                                this.requestId = window.requestAnimationFrame(scrollUp)
                            }
                            this.scrollbarRef.scrollTop(intervalScrollTop)
                        }
                        this.requestId = window.requestAnimationFrame(scrollUp)
                    }
                }
            }
        }
    }

    fetchLyric = (id) => {
        requestLyric({id: id})
            .then((res) => {
                if (this.mounted && res) {
                    this.setState({
                        lyric: res
                    })
                    this.scrollToTop()
                }
            })
    }

    getLyricLines = (lyric, timePattern) => {
        const times = lyric.match(timePattern)
        if (times) {
            const lyrics = lyric.split(timePattern).slice(1)
            return times.map((time, i) => {
                const text = lyrics[i].replace('\n', '')
                return `${time}${text}`
            })
        }
        const lyrics = lyric.replace(/(\n)+/g, '\n').split('\n')
        return lyrics.map((text) => {
            return text.replace('\n', '')
        })
    }

    formatLyric = (lines, timePattern) => {
        let formattedLyric = {}
        lines.forEach((item, i) => {
            // [mm:ss.fff]转秒数
            const parts = item.match(timePattern)
            if (parts) {
                const time = parts[0]
                const second = Number(parts[1] || 0) * 60 + Number(parts[2] || 0) + Number(parts[3] || 0)
                const lyric = item.replace(timePattern, '')

                if (second || lyric) {
                    let lyrics = []

                    if (formattedLyric[time]) {
                        lyrics = formattedLyric[time].lyrics.concat([lyric])
                    } else {
                        lyrics = [lyric]
                    }
                    formattedLyric[time] = {
                        second: second,
                        lyrics: lyrics
                    }
                }
            } else {
                formattedLyric[-i] = {
                    second: DEFAULT_SECOND,
                    lyrics: [item]
                }
            }
        })
        return formattedLyric
    }

    getLyric = (lyricData) => {
        if (lyricData && Object.keys(lyricData)) {
            const timeGroupPattern = /\[(\d{2}):(\d{2})(\.\d{1,3})*\]/
            const timePattern = /\[\d{2}:\d{2}[\.\d{1,3}]*\]/g
            const {tlyric, lrc} = lyricData
            let originLyricLines = []
            let transformLyricLines = []
            let lyric = []

            if (tlyric && tlyric.lyric) {
                transformLyricLines = this.getLyricLines(tlyric.lyric, timePattern)
            }
            if (lrc && lrc.lyric) {
                originLyricLines = this.getLyricLines(lrc.lyric, timePattern)
            }

            let transformLyric = this.formatLyric(transformLyricLines, timeGroupPattern)
            let originLyric = this.formatLyric(originLyricLines, timeGroupPattern)

            Object.keys(originLyric).forEach((key) => {
                let temp
                const originObj = originLyric[key]
                const transformObj = transformLyric[key]

                // 原歌词与翻译合并
                if (transformObj) {
                    temp = {
                        origin: originObj,
                        transform: transformObj
                    }
                } else {
                    temp = {
                        origin: originObj
                    }
                }
                if (temp) {
                    lyric.push({
                        second: temp.origin.second,
                        ...temp
                    })
                }
            })
            return lyric
        }
        return []
    }

    getRenderLyric = (lyric) => {
        if (!this.props.songId) {
            return ''
        }
        if (lyric && Object.keys(lyric).length) {
            const {nolyric, tlyric = {}, lrc = {}} = lyric
            if (nolyric) {
                return <div styleName="no-lyric">纯音乐，无歌词</div>
            }
            if (!tlyric.lyric && !lrc.lyric) {
                return <div styleName="no-lyric">
                    <span className="s-fc4">暂时没有歌词</span>
                    <a>求歌词</a>
                </div>
            }
            return this.getLyricElement(lyric)
        }
        return ''
    }

    getLyricElement = (lyric) => {
        let lyricElement = []
        let hasTime = false
        const convertedLyric = this.getLyric(lyric)
        this.convertedLyric = convertedLyric
        convertedLyric.forEach((item, index) => {
            const {origin, transform} = item
            let innerTime = origin.second
            let originLyrics = origin.lyrics
            if (innerTime !== DEFAULT_SECOND) {
                hasTime = true
            }

            // 拖拽播放条时不改变
            const {user} = this.props
            const currentTime = this.props.user.currentPlayedTime
            const activeTime = user.isDragProgress ? this.prevActiveTime : currentTime
            let styleName = ''
            if (user.isPlaying || (activeTime !== DEFAULT_SECOND && activeTime !== 0)) {
                const nextItem = convertedLyric[index + 1]
                if (activeTime >= innerTime) {
                    if (index === convertedLyric.length - 1) {
                        styleName = 'active'
                    } else if (activeTime < nextItem.origin.second) {
                        styleName = 'active'
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
                            styleName={styleName}
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
                                styleName={styleName}
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
        if (!hasTime) {
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
