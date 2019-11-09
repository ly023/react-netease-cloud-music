import defaultAvatar from 'assets/images/default-avatar.jpg'

export const DEFAULT_DOCUMENT_TITLE = '网易云音乐'

export const DEFAULT_AVATAR = defaultAvatar
export const PAGINATION_LIMIT = 20

export const TIP_TIMEOUT = 2000 // ms

export const NICKNAME_PATTERN = /^[a-zA-Z0-9_\-一-龥]{2,15}$/ // 昵称规则，2-15汉字，且不包含除_和-的特殊字符
export const DOUBLE_BYTE_CHAR_PATTERN = /[^\x00-\xff]/ // 匹配双字节字符（汉字、中文标点符号等）
