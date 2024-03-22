import { memo } from 'react'
import PropTypes from 'prop-types'

import styles from './index.scss'

function CustomButton(props) {
  const { children, type, classname, ...restProps } = props
  return (
    <button
      className={`${styles['custom-button']} ${type || ''} ${classname}`}
      {...restProps}
    >
      {children}
    </button>
  )
}

CustomButton.propTypes = {
  type: PropTypes.oneOf(['primary'])
}

export default memo(CustomButton)
