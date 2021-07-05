import config from 'config'

export default {
    searchSuggest: {
        url: `${config.apiHost}/search/suggest`,
        type: 'GET'
    },
    search: {
        url: `${config.apiHost}/search`,
        type: 'GET'
    },
    multimatch: {
        url: `${config.apiHost}/search/multimatch`,
        type: 'GET'
    }
}
