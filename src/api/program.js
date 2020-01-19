import config from 'config'

export default {
    recommendation: {
        url: `${config.apiHost}/api/program/recommend`,
        type: 'GET'
    }
}
