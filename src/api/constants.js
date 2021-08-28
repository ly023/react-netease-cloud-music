import config from 'config'

export default {
    countryCodeList:{
        url: `${config.apiHost}/countries/code/list`,
        type: 'GET'
    },
}
