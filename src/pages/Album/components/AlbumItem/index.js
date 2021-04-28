import {memo} from 'react'
import Proptypes from 'prop-types'
import {Link} from 'react-router-dom'
import Play from 'components/Play'
import {PLAY_TYPE} from 'constants/play'
import {getThumbnail} from 'utils'

import './index.scss'

function AlbumItem(props) {
    const {item = {}} = props
    const {id, name, artist} = item
    const albumLink = `/album/${id}`

    return <div styleName="box">
        <div styleName="cover">
            <Link to={albumLink}>
                <img
                    src={getThumbnail(item.picUrl, 130)}
                    alt={name}
                />
                <span styleName="mask"/>
            </Link>
            <Play id={id} type={PLAY_TYPE.ALBUM.TYPE}>
                <span styleName="play-icon"/>
            </Play>
        </div>
        <Link to={albumLink} styleName="title">{name}</Link>
        <Link to="/" styleName="name">{artist && artist.name}</Link>
    </div>
}

AlbumItem.propTypes = {
    item: Proptypes.object
}

export default memo(AlbumItem)
