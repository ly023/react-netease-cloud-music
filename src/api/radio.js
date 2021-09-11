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
    requestHotAnchor: {
        url: `${config.apiHost}/dj/hot/anchor`,
        type: 'GET'
    },
    detail: {
        url: `${config.apiHost}/dj/detail`,
        type: 'GET',
    },
    programs: {
        url: `${config.apiHost}/dj/program`,
        type: 'GET',
    },
}
