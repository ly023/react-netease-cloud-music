import PropTypes from 'prop-types'

import styles from './index.scss'

function Empty(props) {
  const { tip = '暂无数据' } = props
  return (
    <div className={styles.content}>
      <i className={styles.icon} />
      {tip}
    </div>
  )
}

Empty.propTypes = {
  tip: PropTypes.string
}

export default Empty
