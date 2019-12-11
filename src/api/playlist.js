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
        url: `${config.apiHost}/api/top/playlist`  ,
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
    }
}
