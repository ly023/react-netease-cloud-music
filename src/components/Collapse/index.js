import { useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import styles from './index.scss'

function Collapse(props) {
  const { fold = true, content = '', onChange, maxWordNumber = 100 } = props
  const [isFolding, setFolding] = useState(fold)
  const [showFold, setShowFold] = useState(false)

  const ctrlFold = useCallback(() => {
    const nextFoldedStatus = !isFolding
    setFolding(nextFoldedStatus)
    onChange && onChange(nextFoldedStatus)
  }, [isFolding, onChange])

  const cont = useMemo(() => {
    if (isFolding && typeof content === 'string') {
      const words = Object.values(content)
      let lastIndex = words.length - 1
      if (lastIndex < maxWordNumber) {
        setShowFold(false)
        return content
      }
      setShowFold(true)
      return `${content.substring(0, maxWordNumber)}...`
    }
    return content
  }, [content, maxWordNumber, isFolding])

  return (
    <>
      {cont}
      {showFold ? (
        <div
          className={`${styles['fold-ctrl']} ${styles.ellipsis}`}
          onClick={ctrlFold}
        >
          {isFolding ? (
            <>
              展开 <KeyboardArrowDownIcon className={styles.arrow} />
            </>
          ) : (
            <>
              收起 <KeyboardArrowUpIcon className={styles.arrow} />
            </>
          )}
        </div>
      ) : null}
    </>
  )
}

Collapse.propTypes = {
  fold: PropTypes.bool,
  content: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  onChange: PropTypes.func,
  maxWordNumber: PropTypes.number
}

export default Collapse
