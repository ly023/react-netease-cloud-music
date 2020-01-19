import request from 'utils/request'
import API from 'api/program'

// 推荐节目
export async function requestRecommendation() {
    return request(API.recommendation.url)
}
