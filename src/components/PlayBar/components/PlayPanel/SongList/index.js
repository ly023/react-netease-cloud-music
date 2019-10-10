import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import VerticalScrollbar from 'components/VerticalScrollbar'
import {formatDuration} from 'utils'
import {getArtists} from 'utils/song'
import Empty from './Empty'

import './index.scss'

export default class SongList extends React.Component {
    static propTypes = {
        height: PropTypes.number,
        trackQueue: PropTypes.array,
        index: PropTypes.number,
        onPlay: PropTypes.func,
        onRemove: PropTypes.func
    }

    static defaultProps = {
        height: 260,
        trackQueue: [],
        index: 0,
    }

    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        if (this.verticalScrollbarRef) {
            this.scrollbarRef = this.verticalScrollbarRef.getScrollbarRef()
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.visible && !prevProps.visible) {
            this.scrollToMiddle()
        }
        if(this.props.visible && this.props.index !== prevProps.index) {
            this.scroll()
        }
    }

    setItemRef = (el) => {
        this.itemRef = el
    }

    setVerticalScrollbarRef = (ref) => {
        this.verticalScrollbarRef = ref
    }

    scrollToMiddle = () => {
        if (this.scrollbarRef) {
            let scrollTop = 0
            const {height, index} = this.props
            if (this.itemRef) {
                const itemHeight = parseInt(window.getComputedStyle(this.itemRef, null).height, 10)
                const perPageLines = Math.floor(height / itemHeight)
                const halfLines = Math.ceil(perPageLines / 2)
                const offsetLines = (index + 1) - halfLines <= 0 ? 0 : ((index + 1) - halfLines)
                if (index >= halfLines + 1) {
                    scrollTop = itemHeight * offsetLines
                }
            }
            this.scrollbarRef.scrollTop(scrollTop)
        }
    }

    scroll = () => {
        if (this.scrollbarRef) {
            let scrollTop = 0
            const {trackQueue, height, index} = this.props
            if (this.itemRef) {
                const itemHeight = parseInt(window.getComputedStyle(this.itemRef, null).height, 10)
                const perPageLines = Math.floor(height / itemHeight)
                const currentScrollTop = this.scrollbarRef.getScrollTop()
                if(index === 0) {
                    scrollTop = 0
                } else if(index === trackQueue.length - 1) {
                    scrollTop = this.scrollbarRef.getScrollHeight() - height
                } else {
                    const currentPageStartIndex = Math.ceil(currentScrollTop / itemHeight)
                    const currentPageEndIndex = Math.floor((currentScrollTop + height) / itemHeight) - 1

                    // 如果index在可见范围内，就不进行定位
                    if (index <= currentPageEndIndex && index >= currentPageStartIndex) {
                        return
                    }
                    if (index <= currentPageStartIndex - 1) {  // 上
                        scrollTop = itemHeight * index
                    } else if (index >= currentPageEndIndex + 1) {  // 下
                        scrollTop = itemHeight * (index - (perPageLines - 1))
                    }
                }
            }
            this.scrollbarRef.scrollTop(scrollTop)
        }
    }

    handlePlay = (index) => {
        const {onPlay, trackQueue} = this.props
        onPlay && onPlay(trackQueue, index)
    }

    handleRemove = (e, id) => {
        e.stopPropagation()
        const {onRemove} = this.props
        onRemove && onRemove(id)
    }

    render() {
        const {height, trackQueue, index} = this.props
        const style = {
            height: height
        }

        return (
            <div style={style}>
                <VerticalScrollbar ref={this.setVerticalScrollbarRef}>
                    {
                        trackQueue.length
                            ? <ul>
                                {
                                    trackQueue.map((item, idx) => {
                                        const {artists = []} = item
                                        return <li
                                            ref={this.setItemRef}
                                            key={`${item.id}-${idx}`}
                                            styleName={`item${idx === index ? " active" : ''}`}
                                            onClick={() => this.handlePlay(idx)}
                                        >
                                            <div styleName="arrow-play-icon"/>
                                            <div styleName="name">{idx}{item.name}</div>
                                            <div styleName="operation">
                                                <span
                                                    styleName="icon delete-icon"
                                                    onClick={(e) => this.handleRemove(e, item.id)}
                                                >
                                                    删除
                                                </span>
                                                <span styleName="icon download-icon">下载</span>
                                                <span styleName="icon share-icon">分享</span>
                                                <span styleName="icon add-icon">收藏</span>
                                            </div>
                                            <div styleName="artists" titlr={getArtists(artists)}>
                                                {
                                                    artists.map((artist, i) => {
                                                        return <span key={artist.id}><Link
                                                            to={`/artist/${artist.id}`}>{artist.name}</Link>{i !== artists.length - 1 ? '/' : ''}</span>
                                                    })
                                                }
                                            </div>
                                            <span styleName="duration">{formatDuration(item.duration)}</span>
                                            <span styleName="link"><a>来源</a></span>
                                        </li>
                                    })
                                }
                            </ul>
                            : <Empty/>
                    }
                </VerticalScrollbar>
            </div>

        )
    }
}
