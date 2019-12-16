import {stringify} from 'qs'
import request from 'utils/request'
import API from 'api/album'

// 最新专辑
export async function requestNewestAlbum() {
    return request(API.newest.url)
}

// 新碟上架
export async function requestTopAlbum(params) {
    return request(`${API.top.url}?${stringify(params)}`)
}

export async function requestDetail(params) {
    return request(`${API.detail.url}?${stringify(params)}`)
}
