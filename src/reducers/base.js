import {SET_NAV_HEIGHT} from 'actions/actionTypes'

const initialState = {
    navHeight: 0
}

export default function base(state = initialState, {type, payload}) {
    switch (type) {
        case SET_NAV_HEIGHT:
            return {
                ...state,
                ...payload
            }
        default:
            return state
    }
}
