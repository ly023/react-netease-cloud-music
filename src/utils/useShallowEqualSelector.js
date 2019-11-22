import {useSelector, shallowEqual} from 'react-redux'

export default function useShallowEqualSelector(selector) {
    return useSelector(selector, shallowEqual)
}
