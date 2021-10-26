import {stringify} from 'qs'
import request from 'utils/request'
import API from 'api/video'

export async function requestSubscribe(params) {
    return request(`${API.subscribe.url}${stringify(params, {addQueryPrefix: true})}`)
}

