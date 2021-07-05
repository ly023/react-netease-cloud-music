import config from 'config'

export default {
    categories: {
        url: `${config.apiHost}/dj/catelist`,
        type: 'GET'
    },
    categoryRecommendation: {
        url: `${config.apiHost}/dj/recommend/type`,
        type: 'GET'
    },
    categoryHot: {
        url: `${config.apiHost}/dj/radio/hot`,
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
    hotAnchorMock: {
        url: `${config.apiHost}/dj/hot/anchor`,
        type: 'GET'
    }
}
