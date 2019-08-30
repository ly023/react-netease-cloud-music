import config from 'config'

export default {
    hotCategory:{
        url: `${config.apiHost}/api/playlist/hot`,
        type: 'GET'
    },
    personalized: {
        url: `${config.apiHost}/api/personalized`,
        type: 'GET'
    }
}
