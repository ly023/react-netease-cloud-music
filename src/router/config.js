import React from 'react'
import {Redirect} from 'react-router-dom'
import Loadable from 'react-loadable'
import PageLoading from 'components/PageLoading'

// import asyncComponent from './asyncComponent'
// const importPages = file => asyncComponent(() => import(`pages/${file}`))

const importViews = file => import(`pages/${file}`)

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
        component: Loadable({
            loader: () => importViews('Discover'),
            loading: PageLoading,
        }),
    },
    {
        path: '/friend',
        name: '朋友',
        component: Loadable({
            loader: () => importViews('Friend'),
            loading: PageLoading,
        }),
    },
    {
        path: '/download',
        name: '下载客户端',
        component: Loadable({
            loader: () => importViews('Download'),
            loading: PageLoading,
        }),
    },
    {
        path: '/song/:id',
        name: '歌曲',
        component: Loadable({
            loader: () => importViews('Song'),
            loading: PageLoading,
        }),
    },
    {
        path: '/user/home/:id',
        name: '我的主页',
        component: Loadable({
            loader: () => importViews('UserHome'),
            loading: PageLoading,
        }),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '*',
        component: Loadable({
            loader: () => importViews('404'),
            loading: PageLoading,
        }),
    },
]
