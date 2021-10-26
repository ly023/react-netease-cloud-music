import {memo} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {getThumbnail} from 'utils'
import {getRenderKeyword} from 'utils/song'

import './index.scss'

function Users(props) {
    const {keyword = '', list = []} = props


    return <div styleName="list">
        {
            list.map((item, index)=>{
                const {userId, nickname, avatarUrl, signature, playlistCount, followeds, followed} = item
                const isEven = (index + 1) % 2 === 0
                const userHome = `/user/home/${userId}`
                return <div key={userId} styleName={`item${isEven ? ' even' : ''}`}>
                    <Link to={userHome} styleName="avatar">
                       <img src={getThumbnail(avatarUrl, 180)} alt=""/>
                    </Link>
                    <div styleName="name">
                        <Link to={userHome} styleName="nickname">
                            {getRenderKeyword(nickname, keyword)}
                        </Link>
                        {signature ? <p styleName="signature" title={signature}>{signature}</p> : null}
                    </div>
                    <div styleName="operation">
                        <button styleName="follow">{followed ? '已关注' : '关注'}</button>
                    </div>
                    <div styleName="count">
                        歌单：{playlistCount}
                    </div>
                    <div styleName="count">
                        粉丝：{followeds}
                    </div>
                </div>
            })
        }
    </div>
}

Users.propTypes = {
    keyword: PropTypes.string,
    list: PropTypes.array,
}

export default memo(Users)
