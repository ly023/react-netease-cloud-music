/**
 * 是否正在播放
 * @param mediaElement
 * @returns {*|boolean}
 */
export function isPlaying(mediaElement) {
  return (
    mediaElement &&
    mediaElement.currentTime > 0 &&
    !mediaElement.paused &&
    !mediaElement.ended
  )
}
