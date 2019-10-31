import config from 'config'

export default {
    music:{
        url: `${config.apiHost}/api/comment/music`,
        type: 'GET'
    },
    album: {
        url: `${config.apiHost}/api/comment/album`,
        type: 'GET'
    },
    playlist: {
        url: `${config.apiHost}/api/comment/playlist`,
        type: 'GET'
    },
    mv: {
        url: `${config.apiHost}/api/comment/mv`,
        type: 'GET'
    },
    // 发送、删除评论
    // t: 0 删除, 1 发送, 2 回复
    // type: 数字,资源类型,对应歌曲,mv,专辑,歌单,电台,视频
    // id: 对应资源 id
    // content :要发送的内容
    // commentId :回复的评论id
    comment: {
        url: `${config.apiHost}/api/comment`,
        type: 'GET'
    },
    // 给评论点赞
    // id
    // type: 数字,资源类型
    // cid : 评论 id
    // t : 是否点赞, 1 为点赞, 0 为取消点赞
    like: {
        url: `${config.apiHost}/api/comment/like`,
        type: 'GET'
    }
}
