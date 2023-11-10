import config from 'config'

export default {
    // 私信和通知数量信息
    count:{
        url: `${config.apiHost}/pl/count`,
        type: 'GET'
    },
}
