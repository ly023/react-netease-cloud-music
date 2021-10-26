import {stringify} from 'qs'
import request from 'utils/request'
import API from 'api/resource'

// 资源点赞（mv,电台,视频,动态）
export async function requestLike(params) {
    return request(`${API.like.url}${stringify(params, {addQueryPrefix: true})}`)
}

