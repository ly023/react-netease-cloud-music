import {stringify} from 'qs'
import request from 'utils/request'
import API from 'api/user'

/**
 * 扫码登录
 * 二维码登录涉及到3个接口，调用务必带上时间戳，防止缓存
 */
// 二维码 key 生成接口
export async function requestQrKey() {
    const timestamp = new Date().getTime()
    return request(`${API.qrKey.url}${stringify({t: timestamp}, {addQueryPrefix: true})}`)
}

// 二维码生成接口，/login/qr/create?key=xxx
export async function requestCreateQr(params) {
    const timestamp = new Date().getTime()
    return request(`${API.createQr.url}${stringify({
        ...params,
        t: timestamp
    }, {addQueryPrefix: true})}`)
}

// 二维码检测扫码状态接口
// /login/qr/check?key=xxx
export async function requestCheckQr(params) {
    const timestamp = new Date().getTime()
    return request(`${API.checkQr.url}${stringify({
        ...params,
        t: timestamp
    }, {addQueryPrefix: true})}`)
}

export async function requestMobileLogin(body) {
    return request(API.mobileLogin.url, {
        method: API.mobileLogin.type,
        body: body
    })
}

export async function requestEmailLogin(body) {
    return request(API.emailLogin.url, {
        method: API.emailLogin.type,
        body: body
    })
}

export async function requestLogout() {
    return request(API.logout.url)
}

export async function requestLoginStatus() {
    return request(API.loginStatus.url)
}

export async function requestDetail(params) {
    return request(`${API.detail.url}${stringify(params, {addQueryPrefix: true})}`)
}

export async function requestSubContent() {
    return request(API.subContent.url)
}

export async function requestDailySignIn(body) {
    return request(API.dailySignIn.url, {
        method: API.dailySignIn.type,
        body: body
    })
}

export async function requestFollows(params) {
    return request(`${API.follows.url}${stringify(params, {addQueryPrefix: true})}`)
}

export async function requestListeningRankingList(params) {
    return request(`${API.listeningRankingList.url}${stringify(params, {addQueryPrefix: true})}`)
}

export async function requestPlaylist(params) {
    return request(`${API.playlist.url}${stringify(params, {addQueryPrefix: true})}`)
}

export async function requestRadios(params) {
    return request(`${API.radios.url}${stringify(params, {addQueryPrefix: true})}`)
}
