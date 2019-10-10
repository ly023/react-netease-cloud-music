import {stringify} from 'qs'
import request from 'utils/request'
import API from 'api/song'

export async function requestDetail(params) {
    return request(`${API.detail.url}?${stringify(params)}`)
}

// 歌曲url
export async function requestResource(params) {
    return request(`${API.resource.url}?${stringify(params)}`)
}

// 歌词
export async function requestLyric(params) {
    return request(`${API.lyric.url}?${stringify(params)}`)
}
