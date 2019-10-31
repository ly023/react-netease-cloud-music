
/**
 * 是否正在播放
 * @param mediaElement
 * @returns {*|boolean}
 */
export function isPlaying(mediaElement) {
    const HAVE_CURRENT_DATA = 2 // 数据已经可以播放(当前位置已经加载) 但没有数据能播放下一帧的内容
    return mediaElement
        && mediaElement.readyState > HAVE_CURRENT_DATA
        && mediaElement.currentTime > 0
        && !mediaElement.paused
        && !mediaElement.ended
}
