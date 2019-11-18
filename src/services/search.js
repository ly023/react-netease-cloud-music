import {stringify} from 'qs'
import request from 'utils/request'
import API from 'api/search'

export async function requestSearchSuggest(params) {
    return request(`${API.searchSuggest.url}?${stringify(params)}`)
}

export async function requestSearch(params) {
    return request(`${API.search.url}?${stringify(params)}`)
}

export async function requestMultiMatch(params) {
    return request(`${API.multimatch.url}?${stringify(params)}`)
}
