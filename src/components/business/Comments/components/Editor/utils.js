import { EMOJI_PREFIX_URL, EMOJI } from './constants'

export function msgToHtml(str) {
  const emojiReg = /\[.+?\]/g
  // 匹配表情
  str = str.replace(emojiReg, function (p1) {
    const emojiText = p1.replace(/[[\]]/g, '')
    if (EMOJI.get(emojiText)) {
      return `<img src="${EMOJI_PREFIX_URL.replace('{id}', EMOJI.get(emojiText))}" alt=""/>`
    }
    return p1
  })
  // 匹配@后的昵称
  const atReg = /@([a-zA-Z0-9_\-\u4E00-\u9FA5]+)/g
  str = str.replace(atReg, function (match, p1) {
    return `<a href="/user/home?nickname=${window.encodeURI(p1)}" target="_blank">${match}</a>`
  })
  // 匹配回车键变成<br/>
  return str.replace(/\n/g, '<br/>')
}
