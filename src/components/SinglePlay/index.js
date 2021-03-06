/**
 * 单曲播放
 */
import {useMemo} from 'react'
import PropTypes from 'prop-types'
import Play from 'components/Play'
import {PLAY_TYPE} from 'constants/play'

import './index.scss'

function SinglePlay(props) {
    const {id, active = false, disabled = false} = props

    const iconClassName = useMemo(() => {
        let extraStyleName = ''
        if (disabled) {
            extraStyleName = 'disabled'
        } else if (active) {
            extraStyleName = 'active'
        }
        return `play ${extraStyleName}`
    }, [active, disabled])

    return <Play id={id} type={PLAY_TYPE.SINGLE.TYPE}>
        <span styleName={iconClassName} />
    </Play>
}

SinglePlay.propTypes = {
    id: PropTypes.number,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
}

export default SinglePlay
