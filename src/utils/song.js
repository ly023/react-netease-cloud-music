import {Fragment} from 'react'
import {Link} from 'react-router-dom'
import {FEE_TYPE, PLAY_MODE, DEFAULT_SECOND} from 'constants/play'

export function hasPrivilege(privilege = {}) {
    if (privilege.st === 0) {
        if (FEE_TYPE.FEE.includes(privilege.fee)) {
            return privilege.payed !== 0
        }
        return true
    }
    return false
}

export function isShuffleMode(playSetting) {
    return playSetting.mode === PLAY_MODE.SHUFFLE
}

export function formatTrack(data = {}, isProgram) {
    if (isProgram) {
        const song = data.mainSong || {}
        return {
            id: song.id,
            name: song.name,
            duration: song.duration, // 单位ms
            album: song.album,
            radio: data.radio, // radio
            mvid: song.mv || song.mvid, // mv id
            picUrl: data.coverUrl,
            program: {
                id: data.id
            }
        }
    }
    return {
        id: data.id,
        name: data.name,
        duration: data.dt, // 单位ms
        album: data.al,
        artists: data.ar,
        mvid: data.mv || data.mvid, // mv id
        privilege: data.privilege, // 特权
        st: data.st, // 是否可用（有版权），不为0不可播放
        picUrl: data.album?.picUrl,
    }
}

export function getArtists(artists = []) {
    let text = ''
    artists.forEach((artist, i) => {
        return text += `${artist.name}${i !== artists.length - 1 ? '/' : ''}`
    })
    return text
}

export function getRenderKeyword(text, keyword) {
    if (text && keyword) {
        const reg = new RegExp(keyword, 'gi')
        const html = text.replace(reg, (p1) => `<span>${p1}</span>`)
        return <span className="keyword" dangerouslySetInnerHTML={{__html: html}}/>
    }
}

export function getLyricLines(lyric, timePattern) {
    if (lyric !== '\\') { // 修正
        const times = lyric.match(timePattern)
        if (times) {
            const lyrics = lyric.split(timePattern).slice(1)
            return times.map((time, i) => {
                const text = lyrics[i].replace('\n', '')
                return `${time}${text}`
            })
        }
        const lyrics = lyric.replace(/(\n)+/g, '\n').split('\n')
        return lyrics.map((text) => {
            return text.replace('\n', '')
        })
    }
    return []
}

export function getSecond(parts) {
    if (parts) {
        return Number(parts[1] || 0) * 60 + Number(parts[2] || 0) + Number(parts[3] || 0)
    }
    return 0
}

export function formatLyric(lines, timePattern) {
    let formattedLyric = {}
    let prevSecond
    let nextSecond

    lines.forEach((item, i) => {
        // [mm:ss.fff]转秒数
        const parts = item.match(timePattern)
        if (parts) {
            const second = getSecond(parts)
            const lyric = item.replace(timePattern, '')
            const nextParts = i !== lines.length - 1 && lines[i + 1].match(timePattern)
            nextSecond = i !== nextParts && getSecond(nextParts)

            // 纠正
            if ((second && second >= prevSecond && second <= nextSecond) || lyric) {
                let lyrics = []

                if (formattedLyric[second]) {
                    lyrics = formattedLyric[second].lyrics.concat([lyric])
                } else {
                    lyrics = [lyric]
                }
                prevSecond = second
                formattedLyric[second] = {
                    second: second,
                    lyrics: lyrics
                }
            }
        } else {
            formattedLyric[-i] = {
                second: DEFAULT_SECOND,
                lyrics: [item]
            }
        }
    })
    return formattedLyric
}

export function getLyric(lyricData) {
    if (lyricData && Object.keys(lyricData)) {
        const timeGroupPattern = /\[(\d{2}):(\d{2})(\.\d{1,3})*\]/
        const timePattern = /\[\d{2}:\d{2}[\.\d{1,3}]*\]/g
        const {tlyric, lrc} = lyricData
        let originLyricLines = []
        let transformLyricLines = []
        let lyric = []

        if (tlyric && tlyric.lyric) {
            transformLyricLines = getLyricLines(tlyric.lyric, timePattern)
        }
        if (lrc && lrc.lyric) {
            originLyricLines = getLyricLines(lrc.lyric, timePattern)
        }

        let transformLyric = formatLyric(transformLyricLines, timeGroupPattern)
        let originLyric = formatLyric(originLyricLines, timeGroupPattern)

        // 使用Object.keys会有key顺序问题
        const orderKeys = (Object.keys(originLyric).map(Number)).sort((a, b) => a - b)
        orderKeys.forEach((key) => {
            let temp
            const originObj = originLyric[key]
            const transformObj = transformLyric[key]

            // 原歌词与翻译合并
            if (transformObj) {
                temp = {
                    origin: originObj,
                    transform: transformObj
                }
            } else {
                temp = {
                    origin: originObj
                }
            }
            if (temp) {
                lyric.push({
                    second: temp.origin.second,
                    ...temp
                })
            }
        })
        return lyric
    }
    return []
}

export function parseSongs(songs = []) {
    const newSongs = []
    if (Array.isArray(songs)) {
        const len = songs.length
        for (let i = 0; i < len; i++) {
            const item = songs[i]
            newSongs.push({
                ...item,
                mv: item.mvid,
                duration: item.dt,
                artists: item.ar,
                album: item.al,
            })
        }
    }
    return newSongs
}

export function renderArtists(artists) {
    if (Array.isArray(artists)) {
        return artists.map((artist, index) => {
            const {id, name} = artist
            return <Fragment key={id}>
                <Link to={`/artist/${id}`}
                      title={artists.map((v) => v.name).join(' / ')}>{name}</Link>
                {index !== artists.length - 1 ? ' / ' : null}
            </Fragment>
        })
    }
}
