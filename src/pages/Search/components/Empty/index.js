import styles from './index.scss'

function Empty() {
  return (
    <div className={styles.content}>
      <i className={styles.icon} />
      很抱歉，未能找到相关搜索结果！
    </div>
  )
}

export default Empty
