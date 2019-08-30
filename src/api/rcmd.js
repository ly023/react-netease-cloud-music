import config from 'config'

export default {
    /**
     * 每日推荐歌单
     */
    playlist:{
        url: `${config.apiHost}/api/recommend/resource`,
        type: 'GET'
    },
    /**
     * 每日推荐歌曲
     */
    songs: {
        url: `${config.apiHost}/api/recommend/songs`,
        type: 'GET'
    },
}
