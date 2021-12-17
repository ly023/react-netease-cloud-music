import {memo} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import ListLoading from 'components/ListLoading'
import SongActions from 'components/SongActions'
import SinglePlay from 'components/SinglePlay'
import {formatDuration} from 'utils'
import {getArtists} from 'utils/song'
import useShallowEqualSelector from 'utils/useShallowEqualSelector'

import './index.scss'
import {getThumbnail} from "../../../../utils";

function SongTable(props) {
    const {loading, songs = [], isSelf = false} = props
    const {currentSong = {}} = useShallowEqualSelector(({user}) => ({
        currentSong: user.player.currentSong,
    }))

    return <>
        <table styleName="table">
            <thead>
            <tr>
                <th styleName="w1">
                    <div styleName="th first"/>
                </th>
                <th>
                    <div styleName="th">标题</div>
                </th>
                <th styleName="w3">
                    <div styleName="th">时长</div>
                </th>
                <th styleName="w4">
                    <div styleName="th">歌手</div>
                </th>
            </tr>
            </thead>
            {Array.isArray(songs) && <tbody>
            {
                songs.map((item, index) => {
                    const Top = 3
                    const order = index + 1
                    const {id, alia: alias, album} = item
                    const isTop = order <= Top
                    const disabled = false // todo 播放权限
                    return <tr key={id}
                               styleName={`track${disabled ? ' disabled' : ''} ${order % 2 ? ' even' : ''}`}>
                        <td styleName="order">
                            <span styleName="number">{order}</span>
                        </td>
                        <td>
                            {isTop ? <img src={getThumbnail(album?.picUrl, 50)} styleName="album-cover" alt=""/> : null}
                            <SinglePlay id={id} active={currentSong?.id === id} disabled={disabled}/>
                            <div styleName={`name ${isTop ? 'top' : ''}`}>
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
                    </tr>
                })
            }
            </tbody>}
        </table>
        <ListLoading loading={loading}/>
    </>
}

SongTable.propTypes = {
    songs: PropTypes.array,
    isSelf: PropTypes.bool,
}

export default memo(SongTable)
