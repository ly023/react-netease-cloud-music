import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {PLAY_TYPE} from 'constants/play'
import Play from 'components/Play'
import {formatDuration} from 'utils'
import {getRenderKeyword} from 'utils/song'

import './index.scss'

export default class Songs extends React.Component {
    static propTypes = {
        keyword: PropTypes.string,
        list: PropTypes.array,
    }

    static defaultProps = {
        keyword: '',
        list: []
    }

    getRenderKeyword = (text) => {
        const {keyword} = this.props
        if(keyword) {
            return getRenderKeyword(text, keyword)
        }
        return text
    }

    render() {
        const {list} = this.props

        return list.map((item, index)=>{
            const isEven = (index + 1) % 2 === 0
            return <div key={item.id} styleName={`item${isEven ? ' even' : ''}`}>
                <Play id={item.id} type={PLAY_TYPE.SINGLE.TYPE}>
                    <i styleName="icon play-icon"/>
                </Play>
                <Link to={`/song/${item.id}`} styleName="td name">{this.getRenderKeyword(item.name)}{item.mvid ? <i styleName="icon mv-icon"/> : null}</Link>
                <div styleName="td operation">
                    <a href={null} styleName="icon add-icon" title="添加到播放列表"/>
                    <a href={null} styleName="icon favorite-icon" title="收藏"/>
                    <a href={null} styleName="icon share-icon" title="分享"/>
                    <a href={null} styleName="icon download-icon" title="下载"/>
                </div>
                <span styleName="td artist">
                    {
                        item.artists.map((artist, i) => {
                            return <span key={`${artist.id}-${i}`}>
                                <Link to={`/artist/${artist.id}`}>{this.getRenderKeyword(artist.name)}</Link>
                                {i !== item.artists.length - 1 ? '/' : ''}
                            </span>
                        })
                    }
                </span>
                <a href={null} styleName="td album">《{this.getRenderKeyword(item.album.name)}》</a>
                <span styleName="td">{formatDuration(item.duration)}</span>
            </div>
        })
    }
}
