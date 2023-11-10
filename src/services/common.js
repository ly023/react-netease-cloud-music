import {stringify} from 'qs'
import request from 'utils/request'
import API from 'api/common'

export async function requestCountryCodeList() {
    return request(API.countryCodeList.url)
}

export async function dislikeSong(params) {
    return request(`${API.dislikeSong.url}${stringify(params, {addQueryPrefix: true})}`)
}
