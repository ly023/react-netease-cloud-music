import {PureComponent, createRef} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import VerticalScrollbar from 'components/VerticalScrollbar'
import Download from 'components/business/Download'
import AddToPlaylist from 'components/business/AddToPlaylist'
import {formatDuration} from 'utils'
import emitter from 'utils/eventEmitter'
import {getArtists} from 'utils/song'
import Empty from './components/Empty'
import {CONTENT_HEIGHT} from '../../../constants'

import './index.scss'

const ITEM_HEIGHT = 28

export default class SongList extends PureComponent {
    static propTypes = {
        height: PropTypes.number,
        trackQueue: PropTypes.array,
        index: PropTypes.number,
        onPlay: PropTypes.func,
        onRemove: PropTypes.func
    }

    static defaultProps = {
        height: CONTENT_HEIGHT,
        trackQueue: [],
        index: 0,
    }

    constructor(props) {
        super(props)
        this.state = {}
        this.scrollbarRef = createRef()
    }

    componentDidUpdate(prevProps) {
        if (this.props.visible && !prevProps.visible) {
            this.scrollToMiddle()
            return
        }
        if (this.props.visible && this.props.index !== prevProps.index) {
            this.scroll()
        }
    }

    scrollToMiddle = () => {
        if (this.scrollbarRef.current) {
            let scrollTop = 0
            const {height, index} = this.props

            const perPageLines = Math.floor(height / ITEM_HEIGHT)
            const halfLines = Math.ceil(perPageLines / 2)
            const offsetLines = (index + 1) - halfLines <= 0 ? 0 : ((index + 1) - halfLines)
            if (index >= halfLines + 1) {
                scrollTop = ITEM_HEIGHT * offsetLines
            }

            this.scrollbarRef.current.scrollTop(scrollTop)
        }
    }

    scroll = () => {
        if (this.scrollbarRef.current) {
            let scrollTop = 0
            const {trackQueue, height, index} = this.props

            const perPageLines = Math.floor(height / ITEM_HEIGHT)
            const currentScrollTop = this.scrollbarRef.current.getScrollTop()
            if (index === 0) {
                scrollTop = 0
            } else if (index === trackQueue.length - 1) {
                scrollTop = this.scrollbarRef.current.getScrollHeight() - height
            } else {
                const currentPageStartIndex = Math.ceil(currentScrollTop / ITEM_HEIGHT)
                const currentPageEndIndex = Math.floor((currentScrollTop + height) / ITEM_HEIGHT) - 1

                // 如果index在可见范围内，就不进行定位
                if (index <= currentPageEndIndex && index >= currentPageStartIndex) {
                    return
                }
                if (index <= currentPageStartIndex - 1) {  // 上
                    scrollTop = ITEM_HEIGHT * index
                } else if (index >= currentPageEndIndex + 1) {  // 下
                    scrollTop = ITEM_HEIGHT * (index - (perPageLines - 1))
                }
            }
            this.scrollbarRef.current.scrollTop(scrollTop)
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

    handleRedirect = (e) => {
        e.stopPropagation()
        emitter.emit('close')
    }

    render() {
        const {height, trackQueue, index} = this.props
        const style = {
            height: height
        }

        return (
            <div style={style}>
                <VerticalScrollbar ref={this.scrollbarRef}>
                    {
                        trackQueue.length
                            ? <ul>
                                {
                                    trackQueue.map((item, idx) => {
                                        const {id, artists, radio} = item
                                        return <li
                                            key={`${id}-${idx}`}
                                            styleName={`item${idx === index ? " active" : ''}`}
                                            onClick={() => this.handlePlay(idx)}
                                        >
                                            <div styleName="arrow-play-icon"/>
                                            <div styleName="name">{item.name}</div>
                                            <div styleName="operation">
                                                <span
                                                    styleName="icon delete-icon"
                                                    onClick={(e) => this.handleRemove(e, id)}
                                                >
                                                    删除
                                                </span>
                                                <Download id={id}>
                                                    <span styleName="icon download-icon">下载</span>
                                                </Download>
                                                <span styleName="icon share-icon">分享</span>
                                                <AddToPlaylist songIds={[id]}>
                                                    <span styleName="icon add-icon">收藏</span>
                                                </AddToPlaylist>
                                            </div>
                                            {
                                                Array.isArray(artists) ? <div styleName="artists" title={getArtists(artists)} onClick={this.handleRedirect}>
                                                    {
                                                        artists.map((artist, i) => {
                                                            return <span key={`${artist.id}-${i}`}><Link
                                                                to={`/artist/${artist.id}`}>{artist.name}</Link>{i !== artists.length - 1 ? '/' : ''}</span>
                                                        })
                                                    }
                                                </div> : null
                                            }
                                            {
                                                radio ? <div styleName="artists" title={radio.name} onClick={this.handleRedirect}>
                                                    <Link to={`/radio/${radio.id}`}>{radio.name}</Link>
                                                </div> : null
                                            }
                                            <span styleName="duration">{formatDuration(item.duration)}</span>
                                            <span styleName="link" onClick={this.handleRedirect}><Link to="/">来源</Link></span>
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
