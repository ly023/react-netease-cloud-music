import { memo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { getThumbnail } from 'utils'
import { getRenderKeyword } from 'utils/song'

import styles from './index.scss'

function Users(props) {
  const { keyword = '', list = [] } = props

  return (
    <div className={styles.list}>
      {list.map((item, index) => {
        const {
          userId,
          nickname,
          avatarUrl,
          signature,
          playlistCount,
          followeds,
          followed
        } = item
        const isEven = (index + 1) % 2 === 0
        const userHome = `/user/home/${userId}`
        return (
          <div
            key={userId}
            className={`${styles.item} ${isEven ? styles.even : ''}`}
          >
            <Link to={userHome} className={styles.avatar}>
              <img src={getThumbnail(avatarUrl, 180)} alt="" />
            </Link>
            <div className={styles.name}>
              <Link to={userHome} className={styles.nickname}>
                {getRenderKeyword(nickname, keyword)}
              </Link>
              {signature ? (
                <p className={styles.signature} title={signature}>
                  {signature}
                </p>
              ) : null}
            </div>
            <div className={styles.operation}>
              <button className={styles.follow}>
                {followed ? '已关注' : '关注'}
              </button>
            </div>
            <div className={styles.count}>歌单：{playlistCount}</div>
            <div className={styles.count}>粉丝：{followeds}</div>
          </div>
        )
      })}
    </div>
  )
}

Users.propTypes = {
  keyword: PropTypes.string,
  list: PropTypes.array
}

export default memo(Users)
