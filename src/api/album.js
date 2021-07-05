import config from 'config'

export default {
    newest: {
        url: `${config.apiHost}/album/newest`,
        type: 'GET'
    },
    allNew: {
        url: `${config.apiHost}/album/new`
    },
    detail: {
        url: `${config.apiHost}/album`,
        type: 'GET'
    }
}
