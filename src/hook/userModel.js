/**
 * raw:
 * reducer(state, {type, payload}) {
 *    switch(type) {
 *      case x1:
 *        return {...}
 *    }
 * }
 *
 * const [state, dispatch] = useReducer(reducer, initialState)
 * dispatch({type, payload})
 *
 * 语法糖
 * const [state, dispatch] = useModel(initialState)
 *
 * dispatch({}) // 自动 merge 对象
 * dispatch(() => {}) // 复杂流程可以使用 callback，返回 new state
 *
 */
import { useReducer } from 'react'

export function useModel(initialState) {
    const [state, dispatch] = useReducer(
        (currentState, params) => {
            if (typeof params === 'function') {
                return params(currentState)
            }
            return {
                ...currentState,
                ...params
            }
        },
        initialState
    )

    const dispatchAndRun = (params) => {
        dispatch(params)
    }

    return [
        state,
        dispatchAndRun
    ]
}
