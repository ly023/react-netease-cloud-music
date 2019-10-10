import {stringify} from 'qs'
import request from 'utils/request'
import API from 'api/playlist'

/**
 * 热门歌单分类
 */
export async function requestHotCategory(params) {
    return request(`${API.hotCategory.url}${params ? `?${stringify(params)}` : ''}`)
}

/**
 * 推荐歌单
 */
export async function requestPersonalized(params) {
    return request(`${API.personalized.url}${params ? `?${stringify(params)}` : ''}`)
}


export async function requestDetail(params) {
    return request(`${API.detail.url}?${stringify(params)}`)
}
