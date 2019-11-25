import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {DEFAULT_ARTIST_AVATAR} from 'constants'
import {PLAY_TYPE} from 'constants/play'
import Play from 'components/Play'
import {getThumbnail} from 'utils'
import {getRenderKeyword} from 'utils/song'

import './index.scss'

function Albums(props) {
    const {keyword, list} = props
    return <ul styleName="list">
        {
            list.map((item) => {
                const {id, name, artists} = item
                const albumUrl = `/album/${id}`
                return <li key={id} styleName="item">
                    <div styleName="cover">
                        <Link to={albumUrl}>
                            <img src={getThumbnail(item.picUrl, 180)} onError={(e) => {
                                e.target.src = DEFAULT_ARTIST_AVATAR
                            }} alt="封面"/>
                        </Link>
                        <div styleName="mask"/>
                        <Play id={id} type={PLAY_TYPE.ALBUM.TYPE}>
                            <span title="播放" styleName="play-icon"/>
                        </Play>
                    </div>
                    <p styleName="desc">
                        <Link to={albumUrl}>
                            {getRenderKeyword(name, keyword)}
                        </Link>
                    </p>
                    <p styleName="name">
                        {
                            Array.isArray(artists) && artists.map((artist, i) => {
                                const artistName = artist.name
                                return <span key={`${artist.id}-${i}`}><Link
                                    to={`/artist/${artist.id}`}>{getRenderKeyword(artistName, keyword)}</Link>{i !== artists.length - 1 ? ' / ' : ''}</span>
                            })
                        }
                    </p>
                </li>
            })
        }
    </ul>
}

Albums.propTypes = {
    keyword: PropTypes.string,
    list: PropTypes.array,
}

Albums.defaultProps = {
    keyword: '',
    list: []
}

export default React.memo(Albums)

