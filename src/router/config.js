import React from 'react'
import {Redirect} from 'react-router-dom'
import Loadable from 'react-loadable'

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
        component: Loadable({
            loader: () => importViews('Discover'),
            loading: Loading,
        }),
    },
    {
        path: '/friend',
        name: '朋友',
        component: Loadable({
            loader: () => importViews('Friend'),
            loading: Loading,
        }),
    },
    {
        path: '/download',
        name: '下载客户端',
        component: Loadable({
            loader: () => importViews('Download'),
            loading: Loading,
        }),
    },
    {
        path: '/song/:id',
        name: '歌曲',
        component: Loadable({
            loader: () => importViews('Song'),
            loading: Loading,
        }),
    },
    {
        path: '/playlist/:id',
        name: '歌单',
        component: Loadable({
            loader: () => importViews('Playlist'),
            loading: Loading
        })
    },
    {
        path: '/search',
        name: '搜索',
        component: Loadable({
            loader: () => importViews('Search'),
            loading: Loading,
        }),
    },
    {
        path: '/user/home/:id',
        name: '我的主页',
        component: Loadable({
            loader: () => importViews('UserHome'),
            loading: Loading,
        }),
    },
    {
        path: '/user/update/:id',
        name: '修改',
        component: Loadable({
            loader: () => importViews('UserUpdate'),
            loading: Loading
        }),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '*',
        component: Loadable({
            loader: () => importViews('404'),
            loading: Loading,
        }),
    },
]
