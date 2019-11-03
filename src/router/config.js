import React from 'react'
import {Redirect} from 'react-router-dom'
import Loadable from '@loadable/component'

// import asyncComponent from './asyncComponent'
// const importPages = file => asyncComponent(() => import(`pages/${file}`))

const importViews = file => import(`pages/${file}`)

const Loading = () => null

export default [
    {
        path: '/',
        name: '首页',
        exact: true,
        component: () => <Redirect to={'/discover'}/>
    },
    {
        path: '/discover',
        name: '发现',
        exact: true,
        component: Loadable(() => importViews('Discover'), {
            fallback: <Loading/>
        }),
    },
    {
        path: '/friend',
        name: '朋友',
        component: Loadable(() => importViews('Friend'), {
            fallback: <Loading/>
        }),
    },
    {
        path: '/download',
        name: '下载客户端',
        component: Loadable(() => importViews('Download'), {
            fallback: <Loading/>
        }),
    },
    {
        path: '/song/:id',
        name: '歌曲',
        component: Loadable(() => importViews('Song'), {
            fallback: <Loading/>
        }),
    },
    {
        path: '/user/home/:id',
        name: '我的主页',
        component: Loadable(() => importViews('UserHome'), {
            fallback: <Loading/>
        }),
    },
    {
        path: '/user/update/:id',
        name: '修改',
        component: Loadable(() => importViews('UserUpdate'), {
            fallback: <Loading/>
        }),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '*',
        component: Loadable(() => importViews('404'), {
            fallback: <Loading/>
        }),
    },
]
