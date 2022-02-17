import React from 'react'
import {Navigate} from 'react-router-dom'
import {connect} from 'react-redux'
import {getCsrfToken} from 'utils'

export default function Private({component: Component, ...rest}) {
    class Authentication extends React.Component {

        isLogin = () => {
            const csrfToken = getCsrfToken()
            return !!csrfToken
        }

        render() {
            const isLogin = this.isLogin()

            return isLogin ? <Component {...rest}/> : <Navigate to='/401'/>
        }
    }

    const AuthenticationContainer = connect(({user}) => ({
        isLogin: user.isLogin
    }))(Authentication)

    return <AuthenticationContainer />
}
