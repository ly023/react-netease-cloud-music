import {memo} from 'react'
import Proptypes from 'prop-types'
import {Link} from 'react-router-dom'
import dayjs from 'dayjs'
import Play from 'components/Play'
import {PLAY_TYPE} from 'constants/play'
import {getThumbnail} from 'utils'

import './index.scss'

function AlbumItem(props) {
    const {item = {}, smallSize = false, showArtistName = false, showDate = false} = props
    const {id, name, artist} = item
    const albumLink = `/album/${id}`

    return <div styleName="box">
        <div styleName="cover">
            <Link to={albumLink}>
                <img
                    src={getThumbnail(item.picUrl, smallSize ? 120 : 130)}
                    alt={name}
                />
                <span styleName={`mask${smallSize ? ' small' : ''}`}/>
            </Link>
            <Play id={id} type={PLAY_TYPE.ALBUM.TYPE}>
                <span styleName="play-icon"/>
            </Play>
        </div>
        <Link to={albumLink} styleName="title" title={name}>{name}</Link>
        {showArtistName ? <Link to="/" styleName="name" title={artist?.name}>{artist?.name}</Link> : null}
        {showDate ? <div styleName="name">{dayjs(item.publishTime).format('YYYY.MM.DD')}</div> : null}
    </div>
}

AlbumItem.propTypes = {
    item: Proptypes.object,
    smallSize: Proptypes.bool,
    showArtistName: Proptypes.bool,
    showDate: Proptypes.bool,
}

export default memo(AlbumItem)
