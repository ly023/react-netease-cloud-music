import config from 'config'

export default {
    newest: {
        url: `${config.apiHost}/api/album/newest`,
        type: 'GET'
    },
    detail: {
        url: `${config.apiHost}/api/album`,
        type: 'GET'
    }
}
