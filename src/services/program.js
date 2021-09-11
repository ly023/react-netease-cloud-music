import {stringify} from 'qs'
import request from 'utils/request'
import API from 'api/program'

// 推荐节目
export async function requestRecommendation(params) {
    return request(`${API.recommendation.url}${stringify(params, {addQueryPrefix: true})}`)
}

// 电台节目榜
export async function requestProgramRank(params) {
    return request(`${API.programRank.url}${stringify(params, {addQueryPrefix: true})}`)
}

// 电台节目详情
export async function requestDetail(params) {
    return request(`${API.detail.url}${stringify(params, {addQueryPrefix: true})}`)
}
