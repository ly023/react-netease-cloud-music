/**
 * 歌单
 */
import config from 'config'

export default {
    hotCategory:{
        url: `${config.apiHost}/api/playlist/hot`,
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
