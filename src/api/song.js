import config from 'config'

export default {
    // 获取歌曲详情
    detail: {
        url: `${config.apiHost}/api/song/detail`,
        type: 'GET'
    },
    // 获取音乐url
    resource: {
        url: `${config.apiHost}/api/song/url`,
        type: 'GET'
    },
    // 歌词
    lyric: {
        url: `${config.apiHost}/api/lyric`,
        type: 'GET'
    }
}
