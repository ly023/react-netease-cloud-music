import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import './index.scss'

function SubscribedUsers({title, list}) {
    return list.length ? <div styleName="list">
        <h3 styleName="title">{title}</h3>
        <ul>
            {
                list.map((item) => {
                    return <li key={item.userId} styleName="avatar">
                        <Link to={`/user/home/${item.userId}`} title={item.name}>
                            <img src={item.avatarUrl} alt="avatar"/>
                        </Link>
                    </li>
                })
            }
        </ul>
    </div> : <></>
}

SubscribedUsers.propTypes = {
    title: PropTypes.string,
    list: PropTypes.array
}

SubscribedUsers.defaultProps = {
    title: '',
    list: []
}

export default SubscribedUsers


