import {stringify} from 'qs'
import request from 'utils/request'
import API from 'api/artist'

/**
 * 歌手分类列表
 */
export async function requestArtist(params) {
    return request(`${API.list.url}${stringify(params, {addQueryPrefix: true})}`)
}

export async function requestSongs(params) {
    return request(`${API.songs.url}${stringify(params, {addQueryPrefix: true})}`)
}

export async function requestDetail(params) {
    return request(`${API.detail.url}${stringify(params, {addQueryPrefix: true})}`)
}

export async function requestArtistTop(params) {
    return request(`${API.artistTop.url}${stringify(params, {addQueryPrefix: true})}`)
}

export async function requestAlbum(params) {
    return request(`${API.album.url}${stringify(params, {addQueryPrefix: true})}`)
}

export async function requestMV(params) {
    return request(`${API.mv.url}${stringify(params, {addQueryPrefix: true})}`)
}

export async function requestSimilar(params) {
    return request(`${API.similar.url}${stringify(params, {addQueryPrefix: true})}`)
}

export async function requestDesc(params) {
    return request(`${API.desc.url}${stringify(params, {addQueryPrefix: true})}`)
}

export async function requestSubscribe(params) {
    return request(`${API.subscribe.url}${stringify(params, {addQueryPrefix: true})}`)
}
