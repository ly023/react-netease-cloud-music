import defaultAvatar from 'assets/images/default-avatar.jpg'
import defaultArtistAvatar from 'assets/images/default-artist-avatar.jpeg'

export const DEFAULT_DOCUMENT_TITLE = '网易云音乐'

export const DEFAULT_AVATAR = defaultAvatar
export const DEFAULT_ARTIST_AVATAR = defaultArtistAvatar
export const PAGINATION_LIMIT = 20

export const DATE_FORMAT = 'YYYY-MM-DD'

export const TIP_TIMEOUT = 2000 // ms

export const NICKNAME_PATTERN = /^[a-zA-Z0-9_\-一-龥]{2,15}$/ // 昵称规则，2-15汉字，且不包含除_和-的特殊字符
export const DOUBLE_BYTE_CHAR_PATTERN = /[^\x00-\xff]/ // 匹配双字节字符（汉字、中文标点符号等）

export const SEARCH_TYPE = {
    SONG: {
        TYPE: 1,
        TEXT: '单曲',
        UNIT: '首',
    },
    ARTIST: {
        TYPE: 100,
        TEXT: '歌手',
        UNIT: '个',
    },
    ALBUM: {
        TYPE: 10,
        TEXT: '专辑',
        UNIT: '张'
    },
    VIDEO: {
        TYPE: 1014,
        TEXT: '视频',
        UNIT: '个'
    },
    LYRIC: {
        TYPE: 1006,
        TEXT: '歌词',
        UNIT: '个'
    },
    PLAYLIST: {
        TYPE: 1000,
        TEXT: '歌单',
        UNIT: '个'
    },
    RADIO: {
        TYPE: 1009,
        TEXT: '主播电台',
        UNIT: '个'
    },
    USER: {
        TYPE: 1002,
        TEXT: '用户',
        UNIT: '个'
    }
}

export const SUBSCRIPTION_TYPE = {
    OK: 1,
    CANCEL: 2
}
