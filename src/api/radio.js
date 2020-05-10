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
    categoryHot: {
        url: `${config.apiHost}/api/dj/radio/hot`,
        type: 'GET'
    },
    programRank: {
        url: `${config.apiHost}/api/dj/program/toplist`,
        type: 'GET'
    },
    detail: {
        url: `${config.apiHost}/api/dj/program/detail`,
        type: 'GET'
    },
    hotAnchorMock: {
        url: `${config.apiHost}/api/dj/hot/anchor`,
        type: 'GET'
    }
}
