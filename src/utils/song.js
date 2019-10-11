import {FEE_TYPE, PLAY_MODE} from 'constants/play'

export function hasPrivilege(privilege = {}) {
    return !(FEE_TYPE.FEE.includes(privilege.fee) && privilege.payed === 0)
}

export function isShuffleMode(playSetting) {
    return playSetting.mode === PLAY_MODE.SHUFFLE
}

export function getArtists(artists = []) {
    let text = ''
    artists.forEach((artist, i) => {
        return text += `${artist.name}${i !== artists.length - 1 ? '/' : ''}`
    })
    return text
}
