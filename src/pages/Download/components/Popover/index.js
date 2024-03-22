import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css'
import './index.scss'

function Popover(props) {
  const {
    content,
    children,
    placement = 'bottom',
    trigger = 'hover',
    mouseEnterDelay = 0.1,
    mouseLeaveDelay = 0.1
  } = props

  return (
    <Tooltip
      placement={placement}
      trigger={trigger}
      mouseEnterDelay={mouseEnterDelay}
      mouseLeaveDelay={mouseLeaveDelay}
      overlay={content}
      {...props}
    >
      {children}
    </Tooltip>
  )
}

export default Popover
