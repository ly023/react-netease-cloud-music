import config from 'config'

export default {
    /**
     * 歌手分类列表
     */
    list: {
        url: `${config.apiHost}/api/artist/list`,
        type: 'GET'
    }
}
