import {SET_USER_INFO, SET_USER_PLAY_INFO} from 'actions/actionTypes'
import {PLAY_MODE} from 'constants/play'

function getDefaultPlaySetting() {
    return {
        index: 0,
        isLocked: false,
        mode: PLAY_MODE.ORDER,
        volume: 0.8
    }
}

const initialState = {
    isLogin: false,
    userInfo: {},
    trackQueue: [],
    playSetting: getDefaultPlaySetting(),
    shuffle: [],
    isPlaying: false,
    isDragProgress: false,
    currentPlayedTime: 0,
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
        case SET_USER_PLAY_INFO:
            return {
                ...state,
                ...action
            }
        default:
            return state
    }
}
