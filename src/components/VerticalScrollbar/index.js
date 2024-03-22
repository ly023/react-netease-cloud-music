import { forwardRef } from 'react'
import Scrollbar from 'components/CustomScrollbar'

import styles from './index.scss'

// eslint-disable-next-line react/display-name
const VerticalScrollbar = forwardRef((props, ref) => {
    return (
        <Scrollbar
            ref={ref}
            {...props}
            renderTrackVertical={() => <div className={styles['track-vertical']} />}
            renderThumbVertical={() => (
                <div className={styles['thumb-vertical']}>
                    <span />
                </div>
            )}
            renderTrackHorizontal={() => <div className={styles['track-horizontal']} />}
            autoHeight
            hideTracksWhenNotNeeded
        >
            {props.children}
        </Scrollbar>
    )
})

export default VerticalScrollbar
