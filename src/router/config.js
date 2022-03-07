import {Navigate} from 'react-router-dom'
import loadable from '@loadable/component'
// import PageLoading from 'components/PageLoading'

// import asyncComponent from './asyncComponent'
// const importPages = file => asyncComponent(() => import(`pages/${file}`))

// const importViews = file => loadable(() => import(`pages/${file}`))

function importPages(filename) {
    // webpackChunkName 重定义chunkName 清楚是哪个路由的文件
    return loadable(() => import(/* webpackChunkName: "[request]" */`pages/${filename}`), {
    // return loadable(() => import(`pages/${filename}`), {
        // fallback: <PageLoading/>,
    })
}

export default [
    {
        path: '/',
        name: '首页',
        component: () => <Navigate to={'/discover'}/>
    },
    {
        path: '/discover',
        name: '发现',
        component: importPages('Discover'),
    },
    {
        path: '/discover/playlist',
        name: '发现-歌单',
        component: importPages('Playlist'),
    },
    {
        path: '/discover/radio',
        name: '发现-主播电台',
        component: importPages('AnchorRadio'),
    },
    {
        path: '/discover/radio/category/:id',
        name: '发现-主播电台-分类',
        component: importPages('AnchorRadioType'),
    },
    {
        path: '/discover/radio/recommend',
        name: '发现-主播电台-推荐节目',
        component: importPages('AnchorRadioRecommendation'),
    },
    {
        path: '/discover/radio/rank',
        name: '发现-主播电台-节目排行榜',
        component: importPages('ProgramRank'),
    },
    {
        path: '/discover/album',
        name: '发现-新碟上架',
        component: importPages('Album'),
    },
    {
        path: '/discover/recommend/daily',
        name: '发现-每日歌曲推荐',
        meta: {
            requiresAuth: true
        },
        component: importPages('DailyRecommendation'),
    },
    {
        path: '/discover/toplist',
        name: '排行榜',
        component: importPages('RankingList'),
    },
    {
        path: '/friend',
        name: '关注',
        component: importPages('Friend'),
    },
    {
        path: '/download',
        name: '下载客户端',
        component: importPages('Download'),
    },
    {
        path: '/song/:id',
        name: '歌曲详情',
        component: importPages('Song'),
    },
    {
        path: '/playlist/:id',
        name: '歌单详情',
        component: importPages('PlaylistDetail'),
    },
    {
        path: '/album/:id',
        name: '专辑详情',
        component: importPages('AlbumDetail'),
    },
    {
        path: '/mv/:id',
        name: 'MV详情',
        component: importPages('MVDetail'),
    },
    {
        path: '/video/:id',
        name: '视频详情',
        component: importPages('VideoDetail'),
    },
    {
        path: '/radio/:id',
        name: '电台详情',
        component: importPages('RadioDetail'),
    },
    {
        path: '/artist/:id',
        name: '歌手详情',
        component: importPages('ArtistDetail'),
    },
    {
        path: '/search',
        name: '搜索',
        component: importPages('Search'),
    },
    {
        path: '/my/music',
        name: '我的音乐',
        component: () => <Navigate to={'/my/music/playlist/:id'}/>
    },
    {
        path: '/my/music/playlist/:id',
        name: '我创建的歌单',
        component: importPages('MyPlaylist'),
    },
    {
        path: '/user/home/:id',
        name: '用户主页',
        component: importPages('UserHome'),
    },
    {
        path: '/user/songs/rank/:id',
        name: '用户听歌排行',
        component: importPages('UserSongsRank'),
    },
    {
        path: '/user/update/:id',
        name: '修改',
        meta: {
            requiresAuth: true
        },
        component: importPages('UserUpdate'),
    },
    {
        path: '/401',
        component: importPages('401'),
    },
    {
        path: '*',
        component: importPages('404'),
    },
]
