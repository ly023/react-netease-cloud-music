import config from 'config'

export default {
    searchSuggest: {
        url: `${config.apiHost}/api/search/suggest`,
        type: 'GET'
    },
}
