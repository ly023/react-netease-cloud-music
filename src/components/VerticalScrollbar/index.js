import {forwardRef} from 'react'
import Scrollbar from 'components/CustomScrollbar'

import './index.scss'

const VerticalScrollbar = forwardRef((props, ref) => {
    return (
        <Scrollbar
            ref={ref}
            {...props}
            renderTrackVertical={() => <div styleName="track-vertical" />}
            renderThumbVertical={() => <div styleName="thumb-vertical" ><span/></div>}
            renderTrackHorizontal={() => <div styleName="track-horizontal" />}
            autoHeight
            hideTracksWhenNotNeeded
        >
            {props.children}
        </Scrollbar>
    )
})

export default VerticalScrollbar
