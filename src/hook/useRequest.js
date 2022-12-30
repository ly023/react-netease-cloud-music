import {useEffect, useReducer, useRef} from 'react'
import request from 'utils/request'

function useRequest(url, options) {
    // const cache = useRef({})

    // Used to prevent state update if the component is unmounted
    const cancelRequest = useRef(false)

    const initialState = {
        data: undefined,
        error: undefined,
        loading: false,
    }

    const reducer = (state, action) => {
        switch (action.type) {
            case 'loading':
                return { ...initialState, loading: true }
            case 'fetched':
                return { ...initialState, data: action.payload, loading: false }
            case 'error':
                return { ...initialState, error: action.payload, loading: false }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        if (!url) {
            return
        }

        cancelRequest.current = false

        const fetchData = async () => {
            dispatch({ type: 'loading' })

            // If a cache exists for this url, return it
            // if (cache.current[url]) {
            //     dispatch({ type: 'fetched', payload: cache.current[url] })
            //     return
            // }

            try {
                const responseData = await request(url, options)
                // cache.current[url] = responseData
                if (cancelRequest.current) {
                    return
                }
                dispatch({ type: 'fetched', payload: responseData })
            } catch (error) {
                if (cancelRequest.current) {
                    return
                }
                dispatch({ type: 'error', payload: error })
            }
        }

       void fetchData()

        // Use the cleanup function for avoiding a possibly...
        // ...state update after the component was unmounted
        return () => {
            cancelRequest.current = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url])

    return state
}

export default useRequest
