import request from 'utils/request'
import API from 'api/message'

export async function requestCount() {
    return request(API.count.url)
}
