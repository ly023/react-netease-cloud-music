import config from 'config'

export default {
    banners: {
        url: `${config.apiHost}/api/banner`,
        type: 'GET'
    }
}
