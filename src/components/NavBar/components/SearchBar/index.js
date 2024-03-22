/**
 * 顶部搜索栏
 */
import Search from 'components/business/Search'

import styles from './index.scss'

export default function SearchBar() {
  return (
    <div className={styles.wrapper}>
      <Search type="navSearch" showSearchTip />
    </div>
  )
}
