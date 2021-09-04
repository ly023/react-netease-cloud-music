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
    PROGRAM: {
        TYPE: 'program',
        TEXT: '电台节目'
    }
}

export const PLAY_MODE = {
    ORDER: 4, // 顺序
    SHUFFLE: 5, // 随机
    LOOP: 2, // 单曲循环
}

export const FEE_TYPE = {
    FEE: [1, 4], // 收费
    FREE: [0, 8], // 免费
}

export const DEFAULT_SECOND = -1

export const DEFAULT_PLAYLIST_TYPE = 5 // 默认歌单（我喜欢的歌单）
