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
        path: '/discover/playlist',
        name: '发现-歌单',
        exact: true,
        component: Loadable({
            loader: () => importViews('Playlist'),
            loading: PageLoading,
        }),
    },
    {
        path: '/discover/radio',
        name: '发现-主播电台',
        exact: true,
        component: Loadable({
            loader: () => importViews('AnchorRadio'),
            loading: PageLoading,
        }),
    },
    {
        path: '/discover/radio/category/:id',
        name: '发现-主播电台-分类',
        exact: true,
        component: Loadable({
            loader: () => importViews('AnchorRadioType'),
            loading: PageLoading,
        }),
    },
    {
        path: '/discover/radio/recommend',
        name: '发现-主播电台-推荐节目',
        exact: true,
        component: Loadable({
            loader: () => importViews('AnchorRadioRecommendation'),
            loading: PageLoading,
        }),
    },
    {
        path: '/discover/radio/rank',
        name: '发现-主播电台-节目排行榜',
        exact: true,
        component: Loadable({
            loader: () => importViews('ProgramRank'),
            loading: PageLoading,
        }),
    },
    {
        path: '/discover/album',
        name: '发现-新碟上架',
        exact: true,
        component: Loadable({
            loader: () => importViews('Album'),
            loading: PageLoading,
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
        name: '歌曲详情',
        component: Loadable({
            loader: () => importViews('Song'),
            loading: PageLoading,
        }),
    },
    {
        path: '/playlist/:id',
        name: '歌单详情',
        component: Loadable({
            loader: () => importViews('PlaylistDetail'),
            loading: PageLoading,
        })
    },
    {
        path: '/album/:id',
        name: '专辑详情',
        component: Loadable({
            loader: () => importViews('AlbumDetail'),
            loading: PageLoading,
        })
    },
    {
        path: '/search',
        name: '搜索',
        component: Loadable({
            loader: () => importViews('Search'),
            loading: PageLoading,
        }),
    },
    {
        path: '/user/home/:id',
        name: '用户主页',
        component: Loadable({
            loader: () => importViews('UserHome'),
            loading: PageLoading,
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
            loading: PageLoading,
        })
    },
    {
        path: '*',
        component: Loadable({
            loader: () => importViews('404'),
            loading: PageLoading,
        }),
    },
]
