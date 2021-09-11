import config from 'config'

export default {
    recommendation: {
        url: `${config.apiHost}/program/recommend`,
        type: 'GET'
    },
    programRank: {
        url: `${config.apiHost}/dj/program/toplist`,
        type: 'GET'
    },
    detail: {
        url: `${config.apiHost}/dj/program/detail`,
        type: 'GET'
    },
}
