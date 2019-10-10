/**
 * 歌词
 */
import React from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import {requestLyric} from 'services/song'
import VerticalScrollbar from 'components/VerticalScrollbar'

import './index.scss'

const DEFAULT_SECOND = -1

export default class Lyric extends React.PureComponent {
    static propTypes = {
        height: PropTypes.number,
        songId: PropTypes.number,
    }

    static defaultProps = {
        height: 260,
    }

    constructor(props) {
        super(props)
        this.state = {
            lyric: {},
            reportPopoverVisible: false
        }
    }

    componentDidMount() {
        this.mounted = true
    }

    componentDidUpdate(prevProps) {
        const {songId} = this.props
        if (songId && songId !== prevProps.songId) {
            this.fetchLyric(songId)
        }
    }

    componentWillUnmount() {
        this.mounted = false
    }

    setVerticalScrollbarRef = (ref) => {
        this.verticalScrollbarRef = ref
    }

    scrollToTop = () => {
        if (this.verticalScrollbarRef) {
            const scrollbarRef = this.verticalScrollbarRef.getScrollbarRef()
            scrollbarRef && scrollbarRef.scrollToTop()
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
        if(times) {
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
                    lyric.push(temp)
                }
            })
            return lyric
        }
        return []
    }

    getRenderLyric = (lyric) => {
        if(!this.props.songId) {
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
        convertedLyric.forEach((item, index) => {
            const {origin, transform} = item
            let innerTime = origin.second
            let originLyrics = origin.lyrics
            if(innerTime !== DEFAULT_SECOND) {
                hasTime = true
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
                    lyricElement.push(<p key={`${innerTime}-${index}-${i}`} data-seconds={innerTime} dangerouslySetInnerHTML={{__html: innerText}}/>)
                })

            } else {
                originLyrics.forEach((v, i) => {
                    if(innerTime !== DEFAULT_SECOND || v) {
                        lyricElement.push(<p key={`${innerTime}-${index}-${i}`} data-seconds={innerTime}>{v}</p>)
                    }
                })
            }
        })
        if(!hasTime) {
            lyricElement.unshift(<p key="tip">*该歌词不支持自动滚动* <a>求滚动歌词</a></p>)
        }
        // console.log('lyricElement', lyricElement)
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
