import request from 'utils/request'
import API from 'api/rcmd'

/**
 * 每日推荐歌单
 */
export async function requestRcmdPlaylist() {
    return request(API.playlist.url)
}

/**
 * 每日推荐歌曲
 */
export async function requestRcmdSongs() {
    return request(API.songs.url)
}
