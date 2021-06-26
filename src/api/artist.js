import config from 'config'

export default {
    /**
     * 歌手分类列表
     */
    list: {
        url: `${config.apiHost}/api/artist/list`,
        type: 'GET'
    },
    songs: {
        url: `${config.apiHost}/api/artists`,
        type: 'GET'
    },
    // 歌手详情
    detail: {
        url: `${config.apiHost}/api/artist/detail`,
        type: 'GET',
    },
    // 歌手热门50首歌曲
    artistTop: {
        url: `${config.apiHost}/api/artist/top/song`,
        type: 'GET'
    },
    album: {
        url: `${config.apiHost}/api/artist/album`,
        type: 'GET'
    },
    mv: {
        url: `${config.apiHost}/api/artist/mv`,
        type: 'GET'
    },
    desc: {
        url: `${config.apiHost}/api/artist/desc`,
        type: 'GET'
    },
    similar: {
        url: `${config.apiHost}/api/simi/artist`,
        type: 'GET'
    },
}
