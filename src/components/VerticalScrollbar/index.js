import React from 'react'
import Scrollbar from 'components/CustomScrollbar'

import './index.scss'

export default class VerticalScrollbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    setScrollbarRef = (ref) => {
        this.scrollbarRef = ref
    }

    getScrollbarRef = () => {
        return this.scrollbarRef
    }

    render() {
        const {children} = this.props

        return (
            <Scrollbar
                ref={this.setScrollbarRef}
                {...this.props}
                renderTrackVertical={() => <div styleName="track-vertical" />}
                renderThumbVertical={() => <div styleName="thumb-vertical" ><span/></div>}
                renderTrackHorizontal={() => <div styleName="track-horizontal" />}
                autoHeight
                hideTracksWhenNotNeeded
            >
                {children}
            </Scrollbar>
        )
    }
}
