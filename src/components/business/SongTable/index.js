import {useCallback, useMemo, memo} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import ListLoading from 'components/ListLoading'
import Empty from 'components/Empty'
import SinglePlay from 'components/business/SinglePlay'
import SongActions from 'components/business/SongActions'
import {formatDuration} from 'utils'
import {getArtists} from 'utils/song'
import useShallowEqualSelector from 'utils/useShallowEqualSelector'

import './index.scss'

function SongTable(props) {
    const {loading = false, songs = [], isSelf = false, showDislike = false, onDislikeSuccess} = props
    const {currentSong = {}} = useShallowEqualSelector(({user}) => ({
        currentSong: user.player.currentSong,
    }))

    const handleDislike = useCallback((id) => {
        // todo 歌曲不感兴趣
        onDislikeSuccess && onDislikeSuccess(songs.filter(v => v.id !== id))
    }, [songs, onDislikeSuccess])

    const renderTip = useMemo(() => {
        if(loading) {
            return <ListLoading />
        }
        if(songs?.length) {
            return null
        }
        return <Empty tip="暂无音乐"/>
    }, [loading, songs])

    return Array.isArray(songs) && songs.length ? <>
        <table styleName="table">
            <thead>
            <tr>
                <th styleName="w1">
                    <div styleName="th first"/>
                </th>
                <th styleName="w2">
                    <div styleName="th">歌曲标题</div>
                </th>
                <th styleName="w3">
                    <div styleName="th">时长</div>
                </th>
                <th styleName="w4">
                    <div styleName="th">歌手</div>
                </th>
                <th styleName="w5">
                    <div styleName="th">专辑</div>
                </th>
            </tr>
            </thead>
            <tbody>
            {
                songs.map((item, index) => {
                    const order = index + 1
                    const {id, alia: alias} = item
                    const disabled = false // todo 没有播放权限
                    return <tr key={id}
                               styleName={`track${disabled ? ' disabled' : ''} ${order % 2 ? ' even' : ''}`}>
                        <td styleName="order">
                            <span styleName="number">{order}</span>
                            <span styleName="play"><SinglePlay id={id} active={currentSong?.id === id} disabled={disabled}/></span>
                        </td>
                        <td>
                            <div styleName="name">
                                <Link to={`/song/${id}`} title={item.name}>{item.name}</Link>
                                {alias && alias.length ?
                                    <span styleName="alias" title={alias.join('、')}> - ({alias.join('、')})</span> : ''}
                                {item.mv ? <Link to={`/mv/${item.mv}`} styleName="mv-icon"/> : null}
                            </div>
                        </td>
                        <td>
                            <div styleName="duration">
                                <span styleName="time">{formatDuration(item.duration)}</span>
                                <div styleName="actions">
                                    <SongActions id={id} isSelf={isSelf}/>
                                </div>
                            </div>
                        </td>
                        <td styleName="artists">
                            {
                                Array.isArray(item.artists) && item.artists.map((artist, i) => {
                                    return <span
                                        key={`${artist.id}-${i}`}
                                        title={getArtists(item.artists)}
                                    >
                                            <Link to={`/artist/${artist.id}`}>{artist.name}</Link>
                                        {i !== item.artists.length - 1 ? '/' : ''}
                                        </span>
                                })
                            }
                        </td>
                        <td styleName="album">
                            <Link to={`/album/${item.album?.id}`}>{item.album?.name}</Link>
                            {showDislike ?
                                <i styleName="dislike" title="不感兴趣" onClick={() => handleDislike(id)}/> : null}
                        </td>
                    </tr>
                })
            }
            </tbody>
        </table>
    </> : renderTip
}

SongTable.propTypes = {
    songs: PropTypes.array,
    isSelf: PropTypes.bool,
    showDislike: PropTypes.bool,
    onDislikeSuccess: PropTypes.func,
}

export default memo(SongTable)
