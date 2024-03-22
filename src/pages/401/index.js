/**
 * 401
 */
import Page from 'components/Page'
import styles from './index.scss'

const Forbidden = () => (
  <Page showBackTop={false}>
    <div className={styles.wrapper}>
      <div className={styles.forbidden}>
        <p className={styles.note}>无权限访问</p>
      </div>
    </div>
  </Page>
)

export default Forbidden
