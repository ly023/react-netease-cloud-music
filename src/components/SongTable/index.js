import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import ListLoading from 'components/ListLoading'
import Play from 'components/Play'
import SongActions from 'components/SongActions'
import {PLAY_TYPE} from 'constants/play'
import {formatDuration} from 'utils'
import {getArtists} from 'utils/song'
import useShallowEqualSelector from 'utils/useShallowEqualSelector'

import './index.scss'

function SongTable(props) {
    const {loading, detail, isSelf, showDislike, onDislikeSuccess} = props
    const {currentSong={}} = useShallowEqualSelector(({user}) => ({
        currentSong: user.player.currentSong,
    }))

    const handleDislike = useCallback((id) => {
        // todo 歌曲不感兴趣
        const {songs=[]} =  detail
        onDislikeSuccess(songs.filter(v => v.id !== id))
    }, [detail, onDislikeSuccess])

    return <>
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
            {Array.isArray(detail.songs) && <tbody>
                {
                    detail.songs.map((item, index) => {
                        const order = index + 1
                        const {id, alia: alias, privilege} = item

                        return <tr key={id}
                            styleName={`track${privilege?.st === -200 ? ' disabled' : ''} ${order % 2 ? ' even' : ''}`}>
                            <td styleName="order">
                                <span styleName="number">{order}</span>
                                {/*{item.publishTime ? <i styleName="new"/> : null}*/}
                                <Play id={id} type={PLAY_TYPE.SINGLE.TYPE}>
                                    {
                                        currentSong?.id === id
                                            ? <span styleName="ply ply-active"/>
                                            : <span styleName="ply"/>
                                    }
                                </Play>
                            </td>
                            <td>
                                <div styleName="name">
                                    <Link to={`/song/${id}`}>{item.name}</Link>
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
                                {showDislike ? <i styleName="dislike" title="不感兴趣" onClick={() => handleDislike(id)}/> : null}
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
    detail: PropTypes.object,
    isSelf: PropTypes.bool,
    showDislike: PropTypes.bool,
    onDislikeSuccess: PropTypes.func,
}

SongTable.defaultProps = {
    detail: {},
    isSelf: false,
    showDislike: false,
    onDislikeSuccess(){}
}

export default React.memo(SongTable)
