import config from 'config'

export default {
    banners: {
        url: `${config.apiHost}/banner`,
        type: 'GET'
    }
}
