import {call, put} from 'redux-saga/effects'
import {setUserInfo} from 'actions/user'
import {
    requestMobileLogin,
    requestEmailLogin,
    requestLoginStatus,
} from 'services/user'

export function* mobileLogin({payload, success, fail}) {
    try {
        const res = yield call(requestMobileLogin, payload.body)
        success && success(res)
    } catch (err) {
        fail && fail(err)
    }
}

export function* emailLogin({payload, success, fail}) {
    try {
        const res = yield call(requestEmailLogin, payload.params)
        success && success(res)
    } catch (err) {
        fail && fail(err)
    }
}

export function* loginStatus() {
    try {
        const {data} = yield call(requestLoginStatus)
        yield put(setUserInfo(data))
    } catch (err) {
        console.log(err)
    }
}
