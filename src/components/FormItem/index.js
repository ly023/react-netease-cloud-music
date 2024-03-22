import styles from './index.scss'
const FormItem = (props) => {
  const { error, children, classname } = props

  return (
    <div
      className={`${classname} ${styles.field} ${error ? styles['has-error'] : ''}`}
    >
      {children}
    </div>
  )
}

export default FormItem
