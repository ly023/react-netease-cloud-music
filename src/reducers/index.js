import {combineReducers} from 'redux'
import base from './base'
import user from './user'

// combineReducers：将子Reducer合并成一个大Reducer
const AppReducer = combineReducers({
    base,
    user,
})

export default AppReducer
