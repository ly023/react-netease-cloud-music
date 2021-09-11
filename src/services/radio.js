import {stringify} from 'qs'
import request from 'utils/request'
import API from 'api/radio'

// 电台分类
export async function requestCategories() {
    return request(API.categories.url)
}

// 电台分类推荐
export async function requestCategoryRecommendation(params) {
    return request(`${API.categoryRecommendation.url}${stringify(params, {addQueryPrefix: true})}`)
}

// 类别热门电台
export async function requestCategoryHot(params) {
    return request(`${API.categoryHot.url}${stringify(params, {addQueryPrefix: true})}`)
}

// 热门主播
export async function requestHotAnchor(params) {
    return request(`${API.requestHotAnchor.url}${stringify(params, {addQueryPrefix: true})}`)
}

// 电台详情
export async function requestDetail(params) {
    return request(`${API.detail.url}${stringify(params, {addQueryPrefix: true})}`)
}

// 电台节目列表
export async function requestPrograms(params) {
    return request(`${API.programs.url}${stringify(params, {addQueryPrefix: true})}`)
}

