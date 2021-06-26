/**
 * 性别
 */
import './index.scss'

const GENDER = {
    UNKNOWN: 0,
    MALE: 1, // 男
    FEMALE: 2 // 女
}

/**
 * @return {null}
 */
function GenderIcon({gender}) {
    if(gender === GENDER.MALE) {
        return <span styleName="male"/>
    }
    if(gender === GENDER.FEMALE) {
        return <span styleName="female"/>
    }
    return null
}

export default GenderIcon
