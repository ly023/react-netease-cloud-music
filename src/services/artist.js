import {stringify} from 'qs'
import request from 'utils/request'
import API from 'api/artist'

/**
 * 歌手分类列表
 */
export async function requestArtist(params) {
    return request(`${API.list.url}${params ? `?${stringify(params)}` : ''}`)
}
