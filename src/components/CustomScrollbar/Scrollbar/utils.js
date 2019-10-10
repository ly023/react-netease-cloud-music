import css from 'dom-css'

let scrollbarWidth = false

export function getScrollbarWidth() {
    if (scrollbarWidth !== false) return scrollbarWidth
    /* istanbul ignore else */
    if (typeof document !== 'undefined') {
        const div = document.createElement('div')
        css(div, {
            width: 100,
            height: 100,
            position: 'absolute',
            top: -9999,
            overflow: 'scroll',
            MsOverflowStyle: 'scrollbar'
        })
        document.body.appendChild(div)
        scrollbarWidth = (div.offsetWidth - div.clientWidth)
        document.body.removeChild(div)
    } else {
        scrollbarWidth = 0
    }
    return scrollbarWidth || 0
}

export function getInnerWidth(el) {
    const {clientWidth} = el
    const {paddingLeft, paddingRight} = getComputedStyle(el)
    return clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight)
}

export function getInnerHeight(el) {
    const {clientHeight} = el
    const {paddingTop, paddingBottom} = getComputedStyle(el)
    return clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom)
}

export function returnFalse() {
    return false
}
