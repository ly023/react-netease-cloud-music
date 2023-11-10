import config from 'config'

export default {
    countryCodeList:{
        url: `${config.apiHost}/countries/code/list`,
        type: 'GET'
    },
    dislikeSong: {
        url: `${config.apiHost}/recommend/songs/dislike`,
        type: 'GET'
    }
}
