import React from 'react'
import './index.scss'

export default function ClientDownload() {
    return <div styleName="multiple-client">
        <h3 styleName="title">网易云音乐多端下载</h3>
        <ul styleName="bg">
            <li>
                <a href="https://itunes.apple.com/cn/app/id590338362" styleName="ios" hidefocus="true" target="_blank">iPhone</a>
            </li>
            <li>
                <a href="https://music.163.com/api/pc/download/latest" styleName="pc" hidefocus="true" target="_blank">PC</a>
            </li>
            <li>
                <a href="https://music.163.com/api/android/download/latest2" styleName="aos" hidefocus="true" target="_blank">Android</a>
            </li>
        </ul>
        <p styleName="tip">同步歌单，随时畅听320k好音乐</p>
    </div>
}
