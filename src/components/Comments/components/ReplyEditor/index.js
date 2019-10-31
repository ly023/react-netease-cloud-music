/**
 * 回复编辑器
 */
import React from 'react'
import Editor from '../Editor'

import './index.scss'

export default function (props) {
    return <div styleName="wrapper">
        <Editor {...props} submitText="回复" />
    </div>
}
