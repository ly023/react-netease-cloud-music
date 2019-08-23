import {REQUEST_MOBILE_LOGIN, SET_USER_INFO, REQUEST_LOGIN_STATUS} from 'actions/actionTypes'

export function requestMobileLogin(payload, success, fail) {
    return {
        type: REQUEST_MOBILE_LOGIN,
        payload,
        success,
        fail
    }
}

export const setUserInfo = (userInfo) => {
    return {
        type: SET_USER_INFO,
        userInfo
    }
}

export const requestLoginStatus = () => {
    return {
        type: REQUEST_LOGIN_STATUS
    }
}
