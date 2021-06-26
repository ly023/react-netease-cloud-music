import {Switch, Route} from 'react-router-dom'
import PrivateRoute from 'components/PrivateRoute'
import config from './config'

export default () => <Switch>
    {
        config.map(({path, component: Component, exact, routes = [], meta = {}}, key) => {
            const {requiresAuth} = meta
            const option = {key, exact, path, routes}

            // 需要登录验证的路由
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
</Switch>

