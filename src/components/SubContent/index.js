import React from 'react'
import Routes from 'router'

import './index.scss'

export default class SubContent extends React.Component {
    render() {
        return (
            <div styleName="sub-content">
                <Routes/>
            </div>
        )
    }
}
