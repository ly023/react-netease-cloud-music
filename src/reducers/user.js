import {SET_USER_INFO} from 'actions/actionTypes'

const initialState = {
    isLogin: false,
    userInfo: {}
}

export default function user(state = initialState, action) {
    switch (action.type) {
        case SET_USER_INFO:
            const {userInfo = {}} = action
            const {code} = userInfo
            if (code === 200) {
                return {
                    ...state,
                    isLogin: true,
                    userInfo: {
                        profile: userInfo.profile
                    }
                }
            }
            return {
                ...state,
                isLogin: true,
                userInfo: {}
            }
        default:
            return state
    }
}
