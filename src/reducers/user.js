import {SET_USER_INFO, SET_USER_PLAY_SETTING, SET_USER_PLAYLIST, SET_USER_SHUFFLE} from 'actions/actionTypes'

const initialState = {
    isLogin: false,
    userInfo: {},
    trackQueue: [],
    playSetting: {},
    shuffle: [],
}

export default function user(state = initialState, action) {
    switch (action.type) {
        case SET_USER_INFO:
            const {userInfo = {}} = action
            const {code} = userInfo
            if (code === 200) {
                return {
                    ...state,
                    isLogin: true,
                    userInfo: {
                        profile: userInfo.profile
                    }
                }
            }
            return {
                ...state,
                isLogin: true,
                userInfo: {}
            }
        case SET_USER_PLAYLIST:
            return {
                ...state,
                trackQueue: action.trackQueue
            }
        case SET_USER_PLAY_SETTING:
            return {
                ...state,
                playSetting: action.playSetting
            }
        case SET_USER_SHUFFLE:
            return {
                ...state,
                shuffle: action.shuffle
            }
        default:
            return state
    }
}
