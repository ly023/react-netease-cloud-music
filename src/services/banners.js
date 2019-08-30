import request from 'utils/request'
import API from 'api/banners'

export async function requestDiscoverBanners() {
    return request(API.banners.url)
}