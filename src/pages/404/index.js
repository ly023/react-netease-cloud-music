/**
 * 404
 */
import Page from 'components/Page'
import styles from './index.scss'

const NotFound = () => (
  <Page showBackTop={false}>
    <div className={styles.wrapper}>
      <div className={styles['not-found']}>
        <i className={styles.icon} />
        <p className={styles.note}>很抱歉，你要查找的网页找不到</p>
      </div>
    </div>
  </Page>
)

export default NotFound
