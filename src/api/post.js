/**
 * 动态
 */
import config from 'config'

export default {
    // 获取动态消息
    posts: {
        url: `${config.apiHost}/event`,
        type: 'GET'
    },
}
