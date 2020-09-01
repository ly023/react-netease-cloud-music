import config from 'config'

export default {
    newest: {
        url: `${config.apiHost}/api/album/newest`,
        type: 'GET'
    },
    allNew: {
        url: `${config.apiHost}/api/album/new`
    },
    detail: {
        url: `${config.apiHost}/api/album`,
        type: 'GET'
    }
}
