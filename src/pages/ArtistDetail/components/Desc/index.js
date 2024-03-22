/**
 * 艺人介绍
 */
import Empty from 'components/Empty'
import styles from './index.scss'

function Desc(props) {
  const { artist } = props
  return artist?.briefDesc ? (
    <div className={styles.box}>
      <div className={styles.subtitle}>{artist?.name}简介</div>
      <div className={styles.desc}>{artist?.briefDesc}</div>
    </div>
  ) : (
    <Empty tip="暂无介绍" />
  )
}

export default Desc
