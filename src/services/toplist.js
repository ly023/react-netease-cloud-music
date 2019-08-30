import {stringify} from 'qs'
import request from 'utils/request'
import API from 'api/toplist'


/**
 * 排行榜
 */
export async function requestRankList(params) {
    return request(`${API.rankList.url}${params ? `?${stringify(params)}` : ''}`)
}
