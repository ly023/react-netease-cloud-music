/**
 * 回复编辑器
 */
import Editor from '../Editor'

import styles from './index.scss'

const ReplyEditor = function (props) {
  return (
    <div className={styles.wrapper}>
      <Editor {...props} submitText="回复" />
    </div>
  )
}

export default ReplyEditor
