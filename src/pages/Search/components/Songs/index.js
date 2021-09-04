import {memo} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {PLAY_TYPE} from 'constants/music'
import Add from 'components/Add'
import SinglePlay from 'components/SinglePlay'
import AddToPlaylist from 'components/AddToPlaylist'
import {formatDuration} from 'utils'
import {getRenderKeyword} from 'utils/song'
import useShallowEqualSelector from 'utils/useShallowEqualSelector'

import './index.scss'

function Songs(props) {
    const {keyword = '', list = []} = props
    const {currentSong = {}} = useShallowEqualSelector(({user}) => ({
        currentSong: user.player.currentSong,
    }))

    return <div styleName="list">
        {
            list.map((item, index)=>{
                const {id, name, alias} = item
                const isEven = (index + 1) % 2 === 0

                return <div key={id} styleName={`item${isEven ? ' even' : ''}`}>
                    <span styleName="play-icon">
                        <SinglePlay id={id} active={currentSong?.id === id}/>
                    </span>
                    <div styleName="td name">
                        <Link to={`/song/${id}`}>
                            {getRenderKeyword(name, keyword)}
                        </Link>
                        {
                            alias && alias.length
                                ?
                                <span styleName="alias" title={alias.join('、')}> - ({alias.join('、')})</span>
                                : ''
                        }
                        {item.mvid ? <Link to={`/mv/${item.mvid}`} styleName="icon mv-icon"/> : null}
                    </div>
                    <div styleName="td operation">
                        <Add id={id} type={PLAY_TYPE.SINGLE.TYPE}>
                            <a href={null} styleName="icon add-icon" title="添加到播放列表"/>
                        </Add>
                        <AddToPlaylist songIds={[id]}>
                            <a href={null} styleName="icon favorite-icon" title="收藏"/>
                        </AddToPlaylist>
                        <a href={null} styleName="icon share-icon" title="分享"/>
                        <a href={null} styleName="icon download-icon" title="下载"/>
                    </div>
                    <span styleName="td artist">
                        {
                            Array.isArray(item.artists) && item.artists.map((artist, i) => {
                                return <span key={`${artist.id}-${i}`}>
                                    <Link to={`/artist/${artist.id}`}>{getRenderKeyword(artist.name, keyword)}</Link>
                                    {i !== item.artists.length - 1 ? '/' : ''}
                                </span>
                            })
                        }
                    </span>
                    <a href={null} styleName="td album">《{getRenderKeyword(item.album?.name, keyword)}》</a>
                    <span styleName="td">{formatDuration(item.duration)}</span>
                </div>
            })
        }
    </div>
}

Songs.propTypes = {
    keyword: PropTypes.string,
    list: PropTypes.array,
}

export default memo(Songs)
