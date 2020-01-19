import config from 'config'

export default {
    categories: {
        url: `${config.apiHost}/api/dj/catelist`,
        type: 'GET'
    },
    categoryRecommendation: {
        url: `${config.apiHost}/api/dj/recommend/type`,
        type: 'GET'
    },
    programRank: {
        url: `${config.apiHost}/api/dj/program/toplist`,
        type: 'GET'
    },
    detail: {
        url: `${config.apiHost}/api/dj/program/detail`,
        type: 'GET'
    }
}
