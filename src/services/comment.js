import {stringify} from 'qs'
import request from 'utils/request'
import API from 'api/comment'

// 歌曲评论
export async function requestMusicComments(params) {
    return request(`${API.music.url}${stringify(params, {addQueryPrefix: true})}`)
}

// 专辑评论
export async function requestAlbumComments(params) {
    return request(`${API.album.url}${stringify(params, {addQueryPrefix: true})}`)
}

// 歌单评论
export async function requestPlaylistComments(params) {
    return request(`${API.playlist.url}${stringify(params, {addQueryPrefix: true})}`)
}

// mv评论
export async function requestMVComments(params) {
    return request(`${API.mv.url}${stringify(params, {addQueryPrefix: true})}`)
}

// 视频评论
export async function requestVideoComments(params) {
    return request(`${API.video.url}${stringify(params, {addQueryPrefix: true})}`)
}

// 发送、删除评论
export async function comment(params) {
    return request(`${API.comment.url}${stringify(params, {addQueryPrefix: true})}`)
}

// 给评论点赞
export async function like(params) {
    return request(`${API.like.url}${stringify(params, {addQueryPrefix: true})}`)
}
