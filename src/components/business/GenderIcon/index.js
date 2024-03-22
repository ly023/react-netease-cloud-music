/**
 * 性别
 */
import styles from './index.scss'

const GENDER = {
  UNKNOWN: 0,
  MALE: 1, // 男
  FEMALE: 2 // 女
}

/**
 * @return {null}
 */
function GenderIcon({ gender }) {
  if (gender === GENDER.MALE) {
    return <span className={styles.male} />
  }
  if (gender === GENDER.FEMALE) {
    return <span className={styles.female} />
  }
  return null
}

export default GenderIcon
