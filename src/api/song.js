import config from 'config'

export default {
    // 获取歌曲详情
    detail: {
        url: `${config.apiHost}/song/detail`,
        type: 'GET'
    },
    // 获取音乐url
    resource: {
        url: `${config.apiHost}/song/url`,
        type: 'GET'
    },
    // 歌词
    lyric: {
        url: `${config.apiHost}/lyric`,
        type: 'GET'
    },
    similar: {
        url: `${config.apiHost}/simi/song`
    }
}
