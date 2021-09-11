import config from 'config'

export default {
    mobileLogin: {
        url: `${config.apiHost}/login/cellphone`,
        type: 'POST'
    },
    emailLogin: {
        url: `${config.apiHost}/login`,
        type: 'POST'
    },
    logout: {
        url: `${config.apiHost}/logout`,
        type: 'POST'
    },
    // 登录状态
    loginStatus: {
        url: `${config.apiHost}/login/status`,
        type: 'GET'
    },
    detail: {
        url: `${config.apiHost}/user/detail`,
        type: 'GET'
    },
    // 获取用户信息 , 歌单，收藏，mv, dj 数量
    subContent: {
        url: `${config.apiHost}/user/subcount`,
        type: 'GET'
    },
    // 签到
    dailySignIn: {
        url: `${config.apiHost}/daily_signin`,
        type: 'POST'
    },
    // 用户关注列表
    follows: {
        url: `${config.apiHost}/user/follows`,
        type: 'GET'
    },
    // 用户听歌排行榜
    listeningRankingList: {
        url: `${config.apiHost}/user/record`,
        type: 'GET'
    },
    // 用户歌单
    playlist: {
        url: `${config.apiHost}/user/playlist`,
        type: 'GET'
    },
    // 用户创建的电台
    radios: {
        url: `${config.apiHost}/user/audio`,
        type: 'GET'
    }
}
