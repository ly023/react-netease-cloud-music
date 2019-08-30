import config from 'config'

export default {
    newest:{
        url: `${config.apiHost}/api/album/newest`,
        type: 'GET'
    },
}
