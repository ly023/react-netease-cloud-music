import config from 'config'

export default {
    // 收藏/取消收藏视频 id:视频id,t:1 为收藏,其他为取消收藏
    subscribe: {
        url: `${config.apiHost}/video/sub`,
        type: 'GET'
    }
}
