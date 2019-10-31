import {
    REQUEST_MOBILE_LOGIN,
    REQUEST_LOGIN_STATUS,
    SET_USER_INFO,
    SET_USER_PLAY_INFO, SET_USER_COMMENT_INFO,
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

export const setUserPlayInfo = (info) => {
    return {
        type: SET_USER_PLAY_INFO,
        ...info
    }
}

export const setUserCommentInfo = (info) => {
    return {
        type: SET_USER_COMMENT_INFO,
        ...info
    }
}
