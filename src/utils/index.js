/**
 * 获取cookie中的csrf token
 * @returns {string}
 */
export function getCsrfToken() {
    const csrf = (/__csrf=[^;]+;?/i).exec(document.cookie)
    if(csrf) {
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
 * 设置localStorage
 * @param key
 * @param value
 */
export function setLocalStorage (key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * 获取localStorage
 * @param key
 * @returns {null|any}
 */
export function getLocalStorage (key) {
    let value = window.localStorage.getItem(key);
    if(value === undefined){
        return null;
    }
    return JSON.parse(value);
}


export function isValidMobileNumber(value) {
    return /^1[3|4|5|7|8|9]\d{9}$/.test(value)
}

/**
 * 获取相对于整个文档的X坐标
 * @param e
 * @returns {number}
 */
export function getMousePageX (e) {
    return e.pageX
}

/**
 * 获取相对于整个文档的Y坐标
 * @param e
 * @returns {number}
 */
export function getMousePageY (e) {
    return e.pageY
}
