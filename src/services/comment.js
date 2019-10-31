import {stringify} from 'qs'
import request from 'utils/request'
import API from 'api/comment'

// 歌曲评论
export async function requestMusicComments(params) {
    return request(`${API.music.url}?${stringify(params)}`)
}

// 专辑评论
export async function requestAlbumComments(params) {
    return request(`${API.album.url}?${stringify(params)}`)
}

// 歌单评论
export async function requestPlaylistComments(params) {
    return request(`${API.playlist.url}?${stringify(params)}`)
}

// mv评论
export async function requestMVComments(params) {
    return request(`${API.mv.url}?${stringify(params)}`)
}

// 发送、删除评论
export async function comment(params) {
    return request(`${API.comment.url}?${stringify(params)}`)
}

// 给评论点赞
export async function like(params) {
    return request(`${API.like.url}?${stringify(params)}`)
}
