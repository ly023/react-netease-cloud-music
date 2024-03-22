import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Popover from '../index'

import styles from './index.scss'

function QuestionPopover(props) {
  return (
    <Popover {...props}>
      <InfoOutlinedIcon className={styles['question-icon']} />
    </Popover>
  )
}

export default QuestionPopover
