import {Routes, Route, useNavigate, useLocation} from 'react-router-dom'
import Private from 'components/Private'
import config from './config'

function RouterConfig() {
    const navigate = useNavigate()
    const location = useLocation()

    return <Routes>
        {
            config.map(({path, component: Component, routes = [], meta = {}}, key) => {
                const {requiresAuth} = meta
                const option = {
                    path,
                    routes,
                    navigate,
                    location,
                }

                // 分普通路由和需要登录验证的路由
                return <Route
                    key={key}
                    {...option}
                    element={requiresAuth ? <Private component={Component} key={key} {...option}/> : <Component key={key} {...option} />}
                />
            })
        }
    </Routes>
}

export default RouterConfig
