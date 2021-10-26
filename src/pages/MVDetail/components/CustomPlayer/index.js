import {useEffect, useRef} from 'react'
import Player from 'xgplayer'

function CustomPlayer(props) {
    const {url} = props

    const playerWrapRef = useRef()
    const playerRef = useRef()

    useEffect(() => {
        if (url) {
            if (playerRef.current) {
                playerRef.current.destroy(playerWrapRef.current)
            }
            const playOptions = {
                videoInit: true, // 初始化显示视频首帧
                volume: 0.8, // 默认音量
                autoplay: true, // 自动播放
                download: true, // 视频下载
                fluid: true, // 放器宽度跟随父元素的宽度大小变化
                playbackRate: [0.5, 0.75, 1, 1.5, 2], // 倍速播放
                defaultPlaybackRate: 1, // 初始播放速度
                rotate: {   // 视频旋转按钮配置项
                    innerRotate: true, // 只旋转内部video
                    clockwise: true, // 旋转方向是否为顺时针
                },
                screenShot: { // 截图，默认为 .png 格式
                    saveImg: true,
                    quality: 1,
                },
                pip: true, //打开画中画功能
                definitionActive: 'click', // 清晰度切换配置
            }

            playerRef.current = new Player({
                el: playerWrapRef.current,
                url,
                ...playOptions,
            })
        }
    }, [url])

    return (
        <div ref={playerWrapRef} />
    )
}

export default CustomPlayer
