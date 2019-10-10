import {
    REQUEST_MOBILE_LOGIN,
    REQUEST_LOGIN_STATUS,
    SET_USER_INFO,
    SET_USER_PLAYLIST,
    SET_USER_PLAY_SETTING, SET_USER_SHUFFLE
} from 'actions/actionTypes'

export function requestMobileLogin(payload, success, fail) {
    return {
        type: REQUEST_MOBILE_LOGIN,
        payload,
        success,
        fail
    }
}

export const requestLoginStatus = () => {
    return {
        type: REQUEST_LOGIN_STATUS
    }
}

export const setUserInfo = (userInfo) => {
    return {
        type: SET_USER_INFO,
        userInfo
    }
}

export const setUserTrackQueue = (trackQueue) => {
    return {
        type: SET_USER_PLAYLIST,
        trackQueue
    }
}

export const setUserPlaySetting = (playSetting) => {
    return {
        type: SET_USER_PLAY_SETTING,
        playSetting
    }
}

export const setUserShuffle = (shuffle) => {
    return {
        type: SET_USER_SHUFFLE,
        shuffle
    }
}
