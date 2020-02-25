import {stringify} from 'qs'
import request from 'utils/request'
import API from 'api/playlist'

// 歌单分类
export async function requestCategory() {
    return request(API.category.url)
}

// 热门歌单分类
export async function requestHotCategory(params) {
    return request(`${API.hotCategory.url}${params ? `?${stringify(params)}` : ''}`)
}

// 热门歌单分类
export async function requestTop(params) {
    return request(`${API.top.url}${params ? `?${stringify(params)}` : ''}`)
}

// 推荐歌单
export async function requestPersonalized(params) {
    return request(`${API.personalized.url}${params ? `?${stringify(params)}` : ''}`)
}

// 歌单详情
export async function requestDetail(params) {
    return request(`${API.detail.url}?${stringify(params)}`)
}

// 相似歌单
export async function requestSimilar(params) {
    return request(`${API.similar.url}?${stringify(params)}`)
}

// 相关歌单推荐
export async function requestRelated(params) {
    return request(`${API.related.url}?${stringify(params)}`)
}

// 收藏/取消收藏歌单
export async function requestSubscribe(params) {
    return request(`${API.subscribe.url}?${stringify(params)}`)
}
