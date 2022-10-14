import config from 'config'

export default {
    rankList: {
        url: `${config.apiHost}/playlist/detail`,
        type: 'GET'
    },
    all: {
        url: `${config.apiHost}/toplist`,
        type: 'GET'
    }
}
