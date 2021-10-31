import {stringify} from 'qs'
import request from 'utils/request'
import API from 'api/video'

export async function requestDetail(params) {
    return request(`${API.detail.url}${stringify(params, {addQueryPrefix: true})}`)
}

export async function requestInfo(params) {
    return request(`${API.info.url}${stringify(params, {addQueryPrefix: true})}`)
}

export async function requestVideoUrl(params) {
    return request(`${API.videoUrl.url}${stringify(params, {addQueryPrefix: true})}`)
}

export async function requestSimilar(params) {
    return request(`${API.similar.url}${stringify(params, {addQueryPrefix: true})}`)
}

export async function requestSubscribe(params) {
    return request(`${API.subscribe.url}${stringify(params, {addQueryPrefix: true})}`)
}

