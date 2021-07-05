import config from 'config'

export default {
    recommendation: {
        url: `${config.apiHost}/program/recommend`,
        type: 'GET'
    }
}
