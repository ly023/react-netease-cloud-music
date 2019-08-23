import config from 'config'

export default {
    mobileLogin: {
        url: `${config.apiHost}/api/login/cellphone`,
        type: 'POST'
    },
    emailLogin: {
        url: `${config.apiHost}/api/login`,
        type: 'POST'
    },
    // 登录状态
    loginStatus: {
        url: `${config.apiHost}/api/login/status`,
        type: 'GET'
    },
    detail: {
        url: `${config.apiHost}/api/user/detail`,
        type: 'GET'
    },
    // 获取用户信息 , 歌单，收藏，mv, dj 数量
    subContent: {
        url: `${config.apiHost}/api/user/subcount`,
        type: 'GET'
    },
    // 签到
    dailySignIn: {
        url: `${config.apiHost}/api/daily_signin`,
        type: 'POST'
    },
    // 用户歌单
    playlist: {
        url: `${config.apiHost}/api/user/playlist`,
        type: 'GET'
    }
}
