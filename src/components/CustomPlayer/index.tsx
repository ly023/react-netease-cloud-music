import React, {useEffect, useRef} from 'react'
import Player, {IPlayerOptions} from 'xgplayer/dist/simple_player'
import definition from 'xgplayer/dist/controls/definition'
import download from 'xgplayer/dist/controls/download'
import pip from 'xgplayer/dist/controls/pip'
import play from 'xgplayer/dist/controls/play'
import playbackRate from 'xgplayer/dist/controls/playbackRate'
import screenShot from 'xgplayer/dist/controls/screenShot'
import volume from 'xgplayer/dist/controls/volume'

const DefaultPlayOptions = {
    controlPlugins: [
        definition,
        download,
        pip,
        play,
        playbackRate,
        screenShot,
        volume,
    ],
    videoInit: true, // 初始化显示视频首帧
    volume: 0.8, // 默认音量
    autoplay: false, // 自动播放
    download: true, // 视频下载
    fluid: true, // 放器宽度跟随父元素的宽度大小变化
    playbackRate: [0.5, 0.75, 1, 1.5, 2], // 倍速播放
    defaultPlaybackRate: 1, // 初始播放速度
    screenShot: { // 截图，默认为 .png 格式
        saveImg: true,
        quality: 1,
    },
    pip: true, //打开画中画功能
    definitionActive: 'click', // 清晰度切换配置
}

interface UrlObject {
    name: string,
    url: string,
}

interface CustomPlayerProps {
    urls: UrlObject[],
}

function CustomPlayer(props: CustomPlayerProps) {
    const {urls = []} = props

    const playerWrapRef = useRef() as React.RefObject<HTMLDivElement>
    const playerRef = useRef<any>()

    useEffect(() => {
        if (urls?.length) {
            if (playerRef.current) {
                playerRef.current.destroy(playerWrapRef.current)
            }

            playerRef.current = new Player({
                el: playerWrapRef.current,
                url: urls[urls.length - 1].url,
                ...DefaultPlayOptions,
            } as IPlayerOptions)

            if(urls.length > 1) {
                // 清晰度切换配置
                playerRef.current.emit('resourceReady', urls)
            }
        }
    }, [urls])

    return (
        <div ref={playerWrapRef}/>
    )
}

export default CustomPlayer
