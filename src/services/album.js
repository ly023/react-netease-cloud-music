import {stringify} from 'qs'
import request from 'utils/request'
import API from 'api/album'

/**
 * 最新专辑
 */
export async function requestNewestAlbum(params) {
    return request(`${API.newest.url}${params ? `?${stringify(params)}` : ''}`)
}
