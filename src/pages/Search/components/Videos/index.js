import {memo} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {DEFAULT_ARTIST_AVATAR} from 'constants'
import {formatDuration, formatNumber, getThumbnail} from 'utils'
import {getRenderKeyword} from 'utils/song'

import './index.scss'

function Videos(props) {
    const {keyword = '', list = []} = props
    return <ul styleName="list">
        {
            list.map((item) => {
                const {vid, title, creator: creators} = item
                const videoUrl = `/video/${vid}`
                return <li key={vid} styleName="item">
                    <div styleName="cover">
                        <Link to={videoUrl}>
                            <img src={getThumbnail(item.coverUrl, 159, 90)} onError={(e) => {
                                e.target.src = DEFAULT_ARTIST_AVATAR
                            }} alt="封面"/>
                        </Link>
                        <span styleName="time">{formatDuration(item.durationms)}</span>
                        <span styleName="playTime"><span styleName="video-icon"/>{formatNumber(item.playTime, 5, 1)}</span>
                    </div>
                    <p styleName="title">
                        <Link to={videoUrl}>
                            {getRenderKeyword(title, keyword)}
                        </Link>
                    </p>
                    <p styleName="name">
                        {
                            Array.isArray(creators) && <>
                            by{'\u00A0'}
                                {
                                    creators.map((creator, i) => {
                                        const {userId, userName} = creator
                                        return <span key={userId}><Link
                                            to={`/user/home/${userId}`}>{getRenderKeyword(userName, keyword)}</Link>{i !== creators.length - 1 ? ' / ' : ''}</span>
                                    })
                                }
                            </>
                        }
                    </p>
                </li>
            })
        }
    </ul>
}

Videos.propTypes = {
    keyword: PropTypes.string,
    list: PropTypes.array,
}

export default memo(Videos)

