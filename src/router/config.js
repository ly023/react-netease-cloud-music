import {Redirect} from 'react-router-dom'
import loadable from '@loadable/component'
// import PageLoading from 'components/PageLoading'

// import asyncComponent from './asyncComponent'
// const importPages = file => asyncComponent(() => import(`pages/${file}`))

// const importViews = file => loadable(() => import(`pages/${file}`))

function importPages(filename) {
    return loadable(() => import(`pages/${filename}`))
}

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
        component: importPages('Discover'),
    },
    {
        path: '/discover/playlist',
        name: '发现-歌单',
        exact: true,
        component: importPages('Playlist'),
    },
    {
        path: '/discover/radio',
        name: '发现-主播电台',
        exact: true,
        component: importPages('AnchorRadio'),
    },
    {
        path: '/discover/radio/category/:id',
        name: '发现-主播电台-分类',
        exact: true,
        component: importPages('AnchorRadioType'),
    },
    {
        path: '/discover/radio/recommend',
        name: '发现-主播电台-推荐节目',
        exact: true,
        component: importPages('AnchorRadioRecommendation'),
    },
    {
        path: '/discover/radio/rank',
        name: '发现-主播电台-节目排行榜',
        exact: true,
        component: importPages('ProgramRank'),
    },
    {
        path: '/discover/album',
        name: '发现-新碟上架',
        exact: true,
        component: importPages('Album'),
    },
    {
        path: '/discover/recommend/daily',
        name: '发现-每日歌曲推荐',
        exact: true,
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
        name: '朋友',
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
        path: '/search',
        name: '搜索',
        component: importPages('Search'),
    },
    {
        path: '/user/home/:id',
        name: '用户主页',
        component: importPages('UserHome'),
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
        path: '*',
        component: importPages('404'),
    },
]
