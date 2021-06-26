/**
 * 歌单
 */
import config from 'config'

export default {
    category: {
        url: `${config.apiHost}/api/playlist/catlist`,
        type: 'GET'
    },
    hotCategory:{
        url: `${config.apiHost}/api/playlist/hot`,
        type: 'GET'
    },
    top: {
        url: `${config.apiHost}/api/top/playlist`,
        type: 'GET'
    },
    personalized: {
        url: `${config.apiHost}/api/personalized`,
        type: 'GET'
    },
    detail: {
        url: `${config.apiHost}/api/playlist/detail`,
        type: 'GET'
    },
    similar: {
        url: `${config.apiHost}/api/simi/playlist`,
        type: 'GET'
    },
    related :{
        url: `${config.apiHost}/api/related/playlist`,
        type: 'GET'
    },
    subscribe: {
        url: `${config.apiHost}/api/playlist/subscribe`,
        // type: 'POST'
        type: 'GET'
    },
    // 用户歌单
    userPlaylist: {
        url: `${config.apiHost}/api/user/playlist`,
        type: 'GET'
    },
    createUserPlaylist: {
        url: `${config.apiHost}/api/playlist/create`,
        type: 'GET'
    },
    updateUserPlaylist: {
        url: `${config.apiHost}/api/playlist/update`,
        type: 'GET'
    },
    updateUserPlaylistSongs: {
        url: `${config.apiHost}/api/playlist/tracks`,
        type: 'GET'
    },
}
