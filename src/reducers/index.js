import {combineReducers} from 'redux'

import base from './base'
import user from './user'

const AppReducer = combineReducers({
    base,
    user,
})

export default AppReducer
