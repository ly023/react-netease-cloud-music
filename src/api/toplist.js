import config from 'config'

export default {
    rankList: {
        url: `${config.apiHost}/top/list`,
        type: 'GET'
    },
    all: {
        url: `${config.apiHost}/toplist`,
        type: 'GET'
    }
}
