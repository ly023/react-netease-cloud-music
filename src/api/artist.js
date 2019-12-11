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
    artistTop: {
        url: `${config.apiHost}/api/artist/top/song`,
        type: 'GET'
    },
    similar: {
        url: `${config.apiHost}/api/simi/artist`,
        type: 'GET'
    },
}
