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
        path: '/discover/playlist',
        name: '发现-歌单',
        exact: true,
        component: Loadable({
            loader: () => importViews('Playlist'),
            loading: Loading,
        }),
    },
    {
        path: '/discover/radio',
        name: '发现-主播电台',
        exact: true,
        component: Loadable({
            loader: () => importViews('AnchorRadio'),
            loading: Loading,
        }),
    },
    {
        path: '/discover/radio/recommend' ,
        name: '发现-主播电台-推荐节目',
        exact: true,
        component: Loadable({
            loader: () => importViews('AnchorRadioRecommendation'),
            loading: Loading,
        }),
    },
    {
        path: '/discover/radio/rank',
        name: '发现-主播电台-节目排行榜',
        exact: true,
        component: Loadable({
            loader: () => importViews('ProgramRank'),
            loading: Loading,
        }),
    },
    {
        path: '/discover/album',
        name: '发现-新碟上架',
        exact: true,
        component: Loadable({
            loader: () => importViews('Album'),
            loading: Loading,
        }),
    },
    {
        path: '/discover/recommend/daily',
        name: '发现-每日歌曲推荐',
        exact: true,
        meta: {
            requiresAuth: true
        },
        component: Loadable({
            loader: () => importViews('DailyRecommendation'),
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
        name: '歌曲详情',
        component: Loadable({
            loader: () => importViews('Song'),
            loading: Loading,
        }),
    },
    {
        path: '/playlist/:id',
        name: '歌单详情',
        component: Loadable({
            loader: () => importViews('PlaylistDetail'),
            loading: Loading
        })
    },
    {
        path: '/album/:id',
        name: '专辑详情',
        component: Loadable({
            loader: () => importViews('AlbumDetail'),
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
        meta: {
            requiresAuth: true
        },
        component: Loadable({
            loader: () => importViews('UserUpdate'),
            loading: Loading
        })
    },
    {
        path: '*',
        component: Loadable({
            loader: () => importViews('404'),
            loading: Loading,
        }),
    },
]
