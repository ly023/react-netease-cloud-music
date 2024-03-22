import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styles from './index.scss'

function SubscribedUsers({ title = '', list = [] }) {
    return list.length ? (
        <div className={styles.list}>
            <h3 className={styles.title}>{title}</h3>
            <ul>
                {list.map((item) => {
                    return (
                        <li key={item.userId} className={styles.avatar}>
                            <Link to={`/user/home/${item.userId}`} title={item.name}>
                                <img src={item.avatarUrl} alt="头像" />
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    ) : (
        <></>
    )
}

SubscribedUsers.propTypes = {
    title: PropTypes.string,
    list: PropTypes.array
}

export default SubscribedUsers
