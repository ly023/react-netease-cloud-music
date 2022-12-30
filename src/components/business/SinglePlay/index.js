/**
 * 单曲播放
 */
import {useMemo} from 'react'
import PropTypes from 'prop-types'
import PlayCircleOutlineIcon  from '@mui/icons-material/PlayCircleOutline'
import Play from 'components/business/Play'
import {PLAY_TYPE} from 'constants/music'

import './index.scss'

function SinglePlay(props) {
    const {id, type = PLAY_TYPE.SINGLE.TYPE, active = false, disabled = false} = props

    const iconClassName = useMemo(() => {
        let extraStyleName = ''
        if (disabled) {
            extraStyleName = 'disabled'
        } else if (active) {
            extraStyleName = 'active'
        }
        return `play ${extraStyleName}`
    }, [active, disabled])

    return <Play id={id} type={type}>
        <PlayCircleOutlineIcon styleName={iconClassName}/>
    </Play>
}

SinglePlay.propTypes = {
    id: PropTypes.number,
    type: PropTypes.oneOf([PLAY_TYPE.SINGLE.TYPE, PLAY_TYPE.PROGRAM.TYPE]),
    active: PropTypes.bool,
    disabled: PropTypes.bool,
}

export default SinglePlay
