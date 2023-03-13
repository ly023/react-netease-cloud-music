import {SET_USER_COMMENT_INFO, SET_USER_INFO, SET_USER_PLAYER} from 'actions/types'
import {PLAY_MODE} from 'constants/music'

function getDefaultPlaySetting() {
    return {
        index: 0,
        isLocked: false,
        mode: PLAY_MODE.ORDER,
        volume: 0.8
    }
}

const initialState = {
    isLogin: false,
    userInfo: {}, // 个人信息相关
    player: {
        playSetting: getDefaultPlaySetting(),
        trackQueue: [],
        shuffle: [],
        isPlaying: false,
        isDragProgress: false,
        currentPlayedTime: 0,
        currentSong: {}, // 当前播放的歌曲
    }, // 音乐播放相关

    follows: [],

    activeCommentId: 0,
}

export default function user(state = initialState, action) {
    switch (action.type) {
        case SET_USER_INFO:
            const {userInfo = {}} = action
            const profile = userInfo.profile
            return {
                ...state,
                isLogin: !!profile,
                userInfo: profile || {}
            }
        case SET_USER_PLAYER:
            return {
                ...state,
                player: {
                    ...state.player,
                    ...action
                }
            }
        case SET_USER_COMMENT_INFO:
            return {
                ...state,
                ...action
            }
        default:
            return state
    }
}
