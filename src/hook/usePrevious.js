import {useEffect, useRef } from 'react'

/**
 * 获取以前的 props(属性) 或 state(状态)
 * @param value
 * @returns {any}
 */
export default function usePrevious(value) {
    const ref = useRef()
    useEffect(() => {
        ref.current = value
    })
    return ref.current
}
