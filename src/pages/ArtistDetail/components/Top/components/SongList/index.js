import {memo} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import ListLoading from 'components/ListLoading'
import SinglePlay from 'components/SinglePlay'
import SongActions from 'components/SongActions'
import Empty from 'components/Empty'
import {formatDuration} from 'utils'
import useShallowEqualSelector from 'utils/useShallowEqualSelector'

import './index.scss'

function SongList(props) {
    const {loading = false, songs = [], isSelf = false} = props

    const {currentSong = {}} = useShallowEqualSelector(({user}) => ({
        currentSong: user.player.currentSong,
    }))

    return <>{Array.isArray(songs) && songs.length ? <table styleName="table">
            <tbody>
            {
                songs.map((item, index) => {
                    const order = index + 1
                    const {id, alia: alias} = item
                    const disabled = false // todo 没有播放权限
                    return <tr key={id} styleName={`track${disabled ? ' disabled' : ''} ${order % 2 ? ' even' : ''}`}>
                        <td styleName="order">
                            <span styleName="number">{order}</span>
                            <span styleName="play">
                            <SinglePlay id={id} active={currentSong?.id === id} disabled={disabled}/>
                            </span>
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
                        <td styleName="album">
                            <Link to={`/album/${item.al?.id}`}>{item.al?.name}</Link>
                        </td>
                    </tr>
                })
            }
            </tbody>
        </table>
        : <Empty tip="暂无音乐"/>}
        <ListLoading loading={loading}/>
    </>

}

SongList.propTypes = {
    songs: PropTypes.array,
    isSelf: PropTypes.bool,
}

export default memo(SongList)
