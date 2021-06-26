import {stringify} from 'qs'
import request from 'utils/request'
import API from 'api/program'

// 推荐节目
export async function requestRecommendation(params) {
    return request(`${API.recommendation.url}${stringify(params, {addQueryPrefix: true})}`)
}
