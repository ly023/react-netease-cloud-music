/**
 * 获取cookie中的csrf token
 * @returns {string}
 */
export function getCsrfToken() {
    const csrf = (/__csrf=[^;]+;?/i).exec(document.cookie)
    if (csrf) {
        return csrf[0].replace(/__csrf=|;/g, '')
    }
}

/**
 * 格式化数字
 * @param number
 * @returns {string|number|*}
 */
export function formatNumber(number) {
    if (!number) {
        return 0
    }
    if (number / 1e4 > 1) {
        return Math.floor(number / 1e4) + '万'
    } else {
        return number
    }
}

/**
 * 格式化时长
 * @param ms
 * @returns {string}
 */
export function formatDuration(ms) {
    if (!ms) {
        return '00:00'
    }
    const seconds = Math.floor(ms / 1000)
    let minute = Math.floor(seconds / 60)
    let second = seconds % 60
    if (minute < 10) {
        minute = '0' + minute
    }
    if (second < 10) {
        second = '0' + second
    }
    return `${minute}:${second}`
}

/**
 * 设置localStorage
 * @param key
 * @param value
 */
export function setLocalStorage(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * 获取localStorage
 * @param key
 * @returns {null|any}
 */
export function getLocalStorage(key) {
    let value = window.localStorage.getItem(key)
    if (value === undefined) {
        return null
    }
    return JSON.parse(value)
}


export function isValidMobileNumber(value) {
    return /^1[3|4|5|7|8|9]\d{9}$/.test(value)
}

/**
 * 获取缩略图
 * @param url
 * @param size
 * @returns {string}
 */
export function getThumbnail(url, size = 256) {
    if (url) {
        return `${url}?param=${size}y${size}`
    }
    return ''
}
