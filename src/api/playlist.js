/**
 * 歌单
 */
import config from 'config'

export default {
    category: {
        url: `${config.apiHost}/playlist/catlist`,
        type: 'GET'
    },
    hotCategory: {
        url: `${config.apiHost}/playlist/hot`,
        type: 'GET'
    },
    top: {
        url: `${config.apiHost}/top/playlist`,
        type: 'GET'
    },
    personalized: {
        url: `${config.apiHost}/personalized`,
        type: 'GET'
    },
    detail: {
        url: `${config.apiHost}/playlist/detail`,
        type: 'GET'
    },
    similar: {
        url: `${config.apiHost}/simi/playlist`,
        type: 'GET'
    },
    related: {
        url: `${config.apiHost}/related/playlist`,
        type: 'GET'
    },
    subscribe: {
        url: `${config.apiHost}/playlist/subscribe`,
        // type: 'POST'
        type: 'GET'
    },
    // 用户歌单
    userPlaylist: {
        url: `${config.apiHost}/user/playlist`,
        type: 'GET'
    },
    createUserPlaylist: {
        url: `${config.apiHost}/playlist/create`,
        type: 'GET'
    },
    updateUserPlaylist: {
        url: `${config.apiHost}/playlist/update`,
        type: 'GET'
    },
    deleteUserPlaylist: {
        url: `${config.apiHost}/playlist/delete`,
        type: 'GET'
    },
    updateUserPlaylistSongs: {
        url: `${config.apiHost}/playlist/tracks`,
        type: 'GET'
    },
}
