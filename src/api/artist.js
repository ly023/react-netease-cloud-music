import config from 'config'

export default {
    // 歌手分类列表
    list: {
        url: `${config.apiHost}/artist/list`,
        type: 'GET'
    },
    songs: {
        url: `${config.apiHost}/artists`,
        type: 'GET'
    },
    // 歌手详情
    detail: {
        url: `${config.apiHost}/artist/detail`,
        type: 'GET',
    },
    // 歌手热门50首歌曲
    artistTop: {
        url: `${config.apiHost}/artist/top/song`,
        type: 'GET'
    },
    album: {
        url: `${config.apiHost}/artist/album`,
        type: 'GET'
    },
    mv: {
        url: `${config.apiHost}/artist/mv`,
        type: 'GET'
    },
    desc: {
        url: `${config.apiHost}/artist/desc`,
        type: 'GET'
    },
    // 相似歌手
    similar: {
        url: `${config.apiHost}/simi/artist`,
        type: 'GET'
    },
    // 收藏/取消收藏歌手 id:id,t:1 为收藏,其他为取消收藏
    subscribe: {
        url: `${config.apiHost}/artist/sub`,
        type: 'GET'
    }
}
