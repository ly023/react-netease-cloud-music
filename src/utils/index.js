
/**
 * 根据name获取cookie
 * @param name
 * @returns {string}
 */
export function getCookie(name) {
    const nameEQ = `${name}=`
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i]
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length)
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length)
        }
    }
}

/**
 * 获取cookie中的csrf token
 * @returns {string}
 */
export function getCsrfToken() {
    return getCookie('__csrf')
}

/**
 * 格式化数字
 * @param number
 * @param startIndex: 转换的起步指数
 * @param digits: 保留的小数位
 * @returns {string|number|*}
 */
export function formatNumber(number, startIndex = 4, digits = 0) {
    if (!number) {
        return 0
    }
    const start = Number(`1e${startIndex}`)
    if (number / start > 1) {
        return  `${trunc(number / 1e4, digits)}万`
    } else {
        return number
    }
}

/**
 * 保留小数（不四舍五入）
 * @param number
 * @param digits 保留小数位
 * @returns {number}
 */
export function trunc(number, digits = 2) {
    let x = number.toString()
    return x.lastIndexOf('.') >= 0 ? parseFloat(x.substr(0, x.lastIndexOf('.') + (digits + 1))) : number
}

/**
 * 格式化时长
 * @param ms
 * @returns {string}
 */
export function formatDuration(ms) {
    if (!ms || ms <= 0) {
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

export function formatTimestamp(timestamp) {
    if (timestamp) {
        const date = new Date(timestamp)
        const now = new Date()

        const thisYear = now.getFullYear()
        const dateYear = date.getFullYear()

        // 今年
        if (thisYear === dateYear) {
            const thisMonth = now.getMonth() + 1
            const dateMonth = date.getMonth() + 1
            const thisDate = now.getDate()
            const dateDate = date.getDate()
            // 同一天
            if (thisMonth === dateMonth && thisDate === dateDate) {
                const minutes = Math.floor((now - date) / 1000 / 60)
                if (minutes < 1) {
                    return '刚刚'
                } else if (minutes <= 59) {
                    return `${minutes}分钟前`
                } else {
                    return formatDate(date, 'HH:mm')
                }
            } else {
                const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
                if (yesterday.getFullYear() === dateYear && yesterday.getMonth() + 1 === dateMonth && yesterday.getDate() === dateDate) {
                    return `昨天 ${formatDate(date, 'HH:mm')}`
                }
            }
        }
        return formatDate(date, 'YYYY年MM月dd日 HH:mm')
    }
    return ''
}

export function formatDate(date, format) {
    let timeStr = format
    const o = {
        'Y+': date.getFullYear(),
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'H+': date.getHours(), // 二十四小时制
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'S': date.getMilliseconds() // 毫秒
    }
    if (/([Y|y]+)/.test(format)) {
        timeStr = format.replace(RegExp.$1, (date.getFullYear().toString()).substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(timeStr)) {
            timeStr = timeStr.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((o[k].toString()).length)))
        }
    }
    return timeStr
}


/**
 * 设置localStorage
 * @param key
 * @param value
 */
export function setLocalStorage(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
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
 * @param width
 * @param height
 * @returns {string}
 */
export function getThumbnail(url, width = 256, height) {
    if (url) {
        return `${url}?param=${width}y${height || width}`
    }
    return ''
}

/**
 * 禁用文本选择
 */
export function disableTextSelection() {
    if (document.selection) {
        document.selection.empty()
    } else {
        window.getSelection().removeAllRanges()
    }
}

/**
 * 是否点击目标元素外的区域，进行特定操作
 * @param e
 * @param id
 * @param callback
 */
export function click(e, id, callback) {
    let elem = e.target

    while (elem) {
        if (
            (typeof elem.id === 'string' && elem.id.indexOf(id) !== -1)
        ) {
            return
        }
        elem = elem.parentNode
    }
    callback && callback()
}

/**
 * 获取光标位置
 * @param element
 * @returns {[number, number]}
 * Selection controls for input & textarea：IE 9及以上
 */
export function getCursorPosition(element) {
    let cursorStart = 0
    let cursorEnd = 0
    if (typeof element.selectionStart === 'number' && typeof element.selectionEnd === 'number') {
        cursorStart = element.selectionStart
        cursorEnd = element.selectionEnd
    }
    return [cursorStart, cursorEnd]
}
