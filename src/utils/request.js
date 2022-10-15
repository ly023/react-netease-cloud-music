import {get} from 'lodash'
import fetch from 'cross-fetch'
import config from 'config'
import {getCsrfToken} from './index'

const codeMessage = {
    200: '操作成功',
    201: '新建或修改数据成功',
    202: '一个请求已经进入后台排队（异步任务）',
    204: '删除数据成功。',
    400: '参数错误',
    401: '需要用户验证',
    403: '用户无权限',
    404: '资源不存在',
    405: '不支持的操作方法',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的',
    422: '当创建一个对象时，发生一个验证错误',
    500: '服务器内部错误',
    502: '应用程序错误',
    503: '维护中',
    504: '网关超时',
}

function responseCatch(e) {
    return new Promise((resolve, reject) => {
        if (!e.errorText) {
            e.errorText = get(codeMessage, e.response?.status, get(e, 'response.statusText', ''))
        }
        reject(e)
    })
}


function defaultGetErrorHandler(response, responseBodyJson) {
    const errorText = get(responseBodyJson, 'msg', get(codeMessage, response.status, get(response, 'statusText', '')))
    return {
        errorText,
        response,
        responseJson: responseBodyJson,
    }
}

function defaultIsSuccessResponse(response) {
    return response.status >= 200 && response.status < 300
}

function insertParams(url, params) {
    if (url && typeof url === 'string') {
        return Object.keys(params).reduce((acc, key) => {
            const value = params[key];
            return `${acc}${acc.match(/[\\?]/g) ? '&' : '?'}${key}=${value}`;
        }, url)

    }
    return url
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL cwe want to request
 * @param fetchOptions
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, fetchOptions = {}, options = {}) {
    const defaultFetchOptions = {
        credentials: 'include',
    }
    const defaultOptions = {
        returnResponse: false,
        isSuccessResponse: defaultIsSuccessResponse,
        getErrorDelegate: defaultGetErrorHandler
    }
    const newOptions = {...defaultFetchOptions, ...fetchOptions}

    options = {...defaultOptions, ...options}
    if (newOptions.method === 'POST' || newOptions.method === 'PUT' || newOptions.method === 'DELETE') {
        if (!(newOptions.body instanceof FormData)) {
            newOptions.headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                ...newOptions.headers,
            }
            newOptions.body = JSON.stringify(newOptions.body)
        } else {
            // newOptions.body is FormData
            newOptions.headers = {
                'Accept': 'application/json',
                ...newOptions.headers,
            }
        }
    }

    const csrfToken = getCsrfToken()
    let requestUrl = url
    if (csrfToken) {
        requestUrl = insertParams(url, {csrf_token: csrfToken})
    }
    // 访问Vercel部署的接口，需额外添加realIP参数（随便一个国内的ip）
    if (config.isProduction) {
        requestUrl = insertParams(requestUrl, {realIP: '185.199.110.153'})
    }

    return fetch(requestUrl, newOptions).then(function checkStatus(response) {
        if (options.isSuccessResponse(response)) {
            return response
        }

        return response.json().then((res) => {
            return new Promise((resolve, reject) => {
                const error = options.getErrorDelegate(response, res)
                reject(error)
            })
        }).catch((e) => {
            return responseCatch(e)
        })
    }).then((response) => {
        if (options.returnResponse) {
            return response
        }
        if (response.status === 204) {
            return response.text()
        }
        return response.json()
    }).catch((e) => {
        return Promise.reject(e)
    })
}
