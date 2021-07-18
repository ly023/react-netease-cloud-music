import {SET_NAV_HEIGHT} from 'actions/types'

export const setNavHeight = (payload) => {
    return {
        type: SET_NAV_HEIGHT,
        payload
    }
}
