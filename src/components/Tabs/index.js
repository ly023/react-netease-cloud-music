import { useMemo } from 'react'
import PropTypes from 'prop-types'

import styles from './index.scss'

function Tabs(props) {
  const { tabs = [], activeTabKey, onChange } = props

  const renderContent = useMemo(() => {
    const tab = tabs.find((v) => v.key === activeTabKey)
    return tab?.content
  }, [tabs, activeTabKey])

  return (
    <>
      <ul className={styles.tabs}>
        {tabs.map((tab) => {
          const { key, name } = tab
          return (
            <li
              key={key}
              onClick={() => onChange && onChange(key)}
              className={`${(styles, tab)} ${key === activeTabKey ? styles.active : ''}`}
            >
              {name}
            </li>
          )
        })}
      </ul>
      {renderContent}
    </>
  )
}

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      name: PropTypes.string,
      content: PropTypes.node
    })
  ),
  activeTabKey: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func
}

export default Tabs
