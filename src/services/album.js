import {stringify} from 'qs'
import request from 'utils/request'
import API from 'api/album'

// 最新专辑
export async function requestNewestAlbum() {
    return request(API.newest.url)
}

// 全部新碟
export async function requestAllNewAlbum(params) {
    return request(`${API.allNew.url}?${stringify(params)}`)
}

export async function requestDetail(params) {
    return request(`${API.detail.url}?${stringify(params)}`)
}
