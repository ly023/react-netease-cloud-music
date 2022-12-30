import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Popover from '../index'

import './index.scss'

function QuestionPopover(props){
    return <Popover {...props}>
        <InfoOutlinedIcon styleName="question-icon"/>
    </Popover>
}

export default QuestionPopover
