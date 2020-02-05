import React from 'react'
import Popover from '../index'

import './index.scss'

function QuestionPopover(props){
    return <Popover {...props}>
        <i styleName="question-icon"/>
    </Popover>
}

export default QuestionPopover
