// https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=%e8%8e%b7%e5%8f%96%e6%ad%8c%e6%9b%b2%e8%af%a6%e6%83%85
export const PLAY_TYPE = {
    SINGLE: {
        TYPE: 'single',
        TEXT: '单曲'
    },
    PLAYLIST: {
        TYPE: 'playlist',
        TEXT: '歌曲列表'
    },
    ALBUM: {
        TYPE: 'album',
        TEXT: '专辑'
    },
    RADIO: {
        TYPE: 'ratio',
        TEXT: '电台'
    },
    PROGRAM: {
        TYPE: 'program',
        TEXT: '电台节目'
    },
}

export const PLAY_MODE = {
    ORDER: 4, // 顺序
    SHUFFLE: 5, // 随机
    LOOP: 2, // 单曲循环
}

// fee 为 1 或 8 的歌曲均可单独购买 2 元单曲
export const FEE_TYPE = {
    FREE_OR_NO_COPYRIGHT: 0, // 免费或无版权
    VIP: 1, // VIP歌曲
    PURCHASE: 4, // 购买专辑
    MEMBER: 8, // 非会员可免费播放低音质，会员可播放高音质及下载
}

export const DEFAULT_SECOND = -1

export const DEFAULT_PLAYLIST_TYPE = 5 // 默认歌单（我喜欢的歌单）
