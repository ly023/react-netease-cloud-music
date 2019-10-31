import React from 'react'
import {withRouter, Route, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {getCsrfToken} from 'utils'

export default function PrivateRoute({component: Component, ...rest}) {
    @withRouter
    class Authentication extends React.Component {

        isLogin = () => {
            const csrfToken = getCsrfToken()
            if (!csrfToken) {
                return false
            }
        }

        render() {
            const isLogin = this.isLogin()

            return (
                <Route
                    {...rest}
                    render={props => isLogin
                        ? <Component {...props}/>
                        : <Redirect to="/404"/>}
                />
            )
        }
    }

    const AuthenticationContainer = connect(({user}) => ({
        isLogin: user.isLogin
    }))(Authentication)

    return <AuthenticationContainer />
}
