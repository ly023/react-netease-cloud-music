import request from 'utils/request'
import API from 'api/constants'

export async function requestCountryCodeList() {
    return request(API.countryCodeList.url)
}

