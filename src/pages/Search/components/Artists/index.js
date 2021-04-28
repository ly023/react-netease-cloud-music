import {memo} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {DEFAULT_ARTIST_AVATAR} from 'constants'
import {getThumbnail} from 'utils'
import {getRenderKeyword} from 'utils/song'

import './index.scss'

function Artists(props) {
    const {keyword = '', list = []} = props

    return <ul styleName="list">
        {
            list.map((item) => {
                const {id, name} = item
                const artistUrl = `/artist/${id}`
                return <li key={id} styleName="item">
                    <Link to={artistUrl}>
                        <div styleName="cover">
                            <img src={getThumbnail(item.picUrl, 130)} onError={(e) => {
                                e.target.src = DEFAULT_ARTIST_AVATAR
                            }} alt="封面"/>
                            <div styleName="mask"/>
                        </div>
                    </Link>
                    <div styleName="meta">
                        <Link to={artistUrl} styleName="name" title={name}>
                            {getRenderKeyword(name, keyword)}
                        </Link>
                        {
                            item.accountId
                                ? <Link to={`/user/home/${item.accountId}`} styleName="icon"/>
                                : null
                        }
                    </div>
                </li>
            })
        }
    </ul>
}

Artists.propTypes = {
    keyword: PropTypes.string,
    list: PropTypes.array,
}

export default memo(Artists)

