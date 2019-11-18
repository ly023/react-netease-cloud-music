import config from 'config'

export default {
    searchSuggest: {
        url: `${config.apiHost}/api/search/suggest`,
        type: 'GET'
    },
    search: {
        url: `${config.apiHost}/api/search`,
        type: 'GET'
    },
    multimatch: {
        url: `${config.apiHost}/api/search/multimatch`,
        type: 'GET'
    }
}
