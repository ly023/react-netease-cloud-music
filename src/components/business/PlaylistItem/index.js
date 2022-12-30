import {useMemo, memo} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import HeadsetIcon from '@mui/icons-material/Headset'
import PlayCircleOutlineIcon  from '@mui/icons-material/PlayCircleOutline'
import Play from 'components/business/Play'
import {PLAY_TYPE} from 'constants/music'
import {formatNumber, getThumbnail} from 'utils'

import './index.scss'

function PlaylistItem(props) {
    const {item, showCreator = false, ellipsis = false} = props
    const {id, name, creator = {}} = item
    const detailLink = useMemo(() => `/playlist/${id}`, [id])

    return <>
        <div styleName="cover-wrapper">
            <Link to={detailLink} styleName="cover">
                <img src={getThumbnail(item.coverUrl, 140)} alt="歌单封面"/>
            </Link>
            <div styleName="bottom">
                <HeadsetIcon className="fl" styleName="icon-headset"/>
                <span className="fl">{formatNumber(item.playCount, 1)}</span>
                <Play type={PLAY_TYPE.PLAYLIST.TYPE} id={id}>
                    <PlayCircleOutlineIcon className="fr" styleName="icon-play"/>
                </Play>
            </div>
        </div>
        <Link to={detailLink} styleName={`name${ellipsis ? ' ellipsis' : ''}`} title={name}>{name}</Link>
        {
            showCreator ? <div styleName="creator">
                by <Link to={`/user/home/${creator.userId}`} styleName="nickname"
                         title={creator.nickname}>{creator.nickname}</Link>
            </div> : null
        }
    </>
}

PlaylistItem.propTypes = {
    item: PropTypes.object,
    showCreator: PropTypes.bool, // 是否显示创建者
    ellipsis: PropTypes.bool, // 文字溢出省略
}

export default memo(PlaylistItem)
