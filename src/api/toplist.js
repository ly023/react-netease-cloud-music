import config from 'config'

export default {
    rankList: {
        url: `${config.apiHost}/api/top/list`,
        type: 'GET'
    },
    all: {
        url: `${config.apiHost}/api/toplist`,
        type: 'GET'
    }
}
