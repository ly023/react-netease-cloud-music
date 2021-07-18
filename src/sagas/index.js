/**
 * 统一引入各个模块对应的请求方法
 */

// import {all, takeEvery, fork} from 'redux-saga/effects'
import {
    all,
    takeLatest, // 短时间内（没有执行完函数）多次触发的情况下，只会触发相应的函数一次
    // takeEvery, // 每次都会触发相应的函数
} from 'redux-saga/effects'

import {REQUEST_MOBILE_LOGIN, REQUEST_LOGIN_STATUS} from 'actions/types'
import {mobileLogin, loginStatus} from './user'

const rootSaga = function* root() {
    yield all([
        yield takeLatest(REQUEST_MOBILE_LOGIN, mobileLogin),
        yield takeLatest(REQUEST_LOGIN_STATUS, loginStatus),
    ])
}

export default rootSaga
