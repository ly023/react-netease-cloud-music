import config from 'config'

export default {
    newest: {
        url: `${config.apiHost}/api/album/newest`,
        type: 'GET'
    },
    top: {
        url: `${config.apiHost}/api/top/album`
    },
    detail: {
        url: `${config.apiHost}/api/album`,
        type: 'GET'
    }
}
