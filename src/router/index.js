import React from 'react'
import {Switch, Route} from 'react-router-dom'
import PrivateRoute from 'components/PrivateRoute'
import {hot} from 'react-hot-loader/root'
import config from './config'

export default hot(() => <Switch>
    {
        config.map(({path, component: Component, exact, routes = [], meta = {}}, key) => {
            const {requiresAuth} = meta
            const option = {key, exact, path, routes}

            return requiresAuth
                ? <PrivateRoute {...option} component={Component}/>
                : <Route
                    {...option}
                    render={props => {
                        return <Component {...props} routes={routes}/>
                    }}
                />
        })
    }
</Switch>)

