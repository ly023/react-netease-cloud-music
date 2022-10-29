import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {getThumbnail} from 'utils'
import './index.scss'

function RelatedPlaylists({title = '', list = []}) {
    return list.length ? <div styleName="list">
        <h3 styleName="title">{title}</h3>
        <ul>
            {
                list.map((item) => {
                    return <li key={item.id} styleName="item">
                        <Link to={`/playlist/${item.id}`} title={item.name} styleName="cover">
                            <img src={getThumbnail(item.coverImgUrl, 120)} alt="cover"/>
                        </Link>
                        <div styleName="meta">
                            <p styleName="name"><Link to={`/playlist/${item.id}`} title={item.name}>{item.name}</Link>
                            </p>
                            <p>
                                <span styleName="by">by</span>
                                <Link
                                    styleName="nickname"
                                    to={`/user/home/${item?.creator?.userId}`}
                                    title={item?.creator?.nickname}>
                                    {item?.creator?.nickname}
                                </Link>
                            </p>
                        </div>
                    </li>
                })
            }
        </ul>
    </div> : null
}

RelatedPlaylists.propTypes = {
    title: PropTypes.string,
    list: PropTypes.array
}

export default RelatedPlaylists
