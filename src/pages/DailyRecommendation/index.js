import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react'
import Page from 'components/Page'
import SongTable from 'components/SongTable'
import Play from 'components/Play'
import Add from 'components/Add'
import ClientDownload from 'components/ClientDownload'
import {DEFAULT_DOCUMENT_TITLE} from 'constants'
import {PLAY_TYPE} from 'constants/play'
import {requestRcmdSongs} from 'services/rcmd'
import {requestDetail} from 'services/user'
import useShallowEqualSelector from 'utils/useShallowEqualSelector'

import './index.scss'

const WEEKDAY = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']

function DailyRecommendation() {
    const {userInfo} = useShallowEqualSelector(({user}) => ({userInfo: user.userInfo}))
    const isMounted = useRef()
    const [detail, setDetail] = useState({})
    const [songs, setSongs] = useState([])
    const [info, setInfo] = useState({})
    const [detailLoading, setDetailLoading] = useState(false)

    useEffect(() => {
        isMounted.current = true

        const parseSongs = (songs = []) => {
            const newSongs = []
            const len = songs.length
            for (let i = 0; i < len; i++) {
                const item = songs[i]
                newSongs.push({
                    ...item,
                    mv: item.mvid
                })
            }
            return newSongs
        }

        const fetchRcmdSongs = async () => {
            try {
                setDetailLoading(true)
                const res = await requestRcmdSongs()
                if (isMounted.current) {
                    const data = res.recommend
                    setSongs(data)
                    setDetail({songs: parseSongs(data)})
                }
            } finally {
                setDetailLoading(false)
            }
        }

        fetchRcmdSongs()

        return () => {
            isMounted.current = false
        }
    }, [])

    useEffect(() => {
        const fetchUserInfo = async () => {
            const res = await requestDetail({uid: userInfo.userId})
            if (isMounted.current) {
                setInfo(res)
            }
        }
        if (userInfo.userId) {
            fetchUserInfo()
        }
    }, [userInfo])

    const handleDislikeSuccess = useCallback((songs) => {
        setDetail({
            ...detail,
            songs: songs || []
        })
    }, [detail])

    const documentTitle = useMemo(() => `每日歌曲推荐 - ${DEFAULT_DOCUMENT_TITLE}`, [])

    return <Page title={documentTitle}>
        <div className="main">
            <div className="left-wrapper">
                <div className="left">
                    <div styleName="header">
                        <div styleName="date-icon">
                            <p styleName="day">{WEEKDAY[new Date().getDay() - 1]}</p>
                            <p styleName="date">{new Date().getDate()}</p>
                            <div styleName="date-mask"/>
                        </div>
                    </div>
                    <div styleName="actions">
                        <Play type={PLAY_TYPE.PLAYLIST.TYPE} songs={songs}>
                            <a href={null} styleName="btn-play" title="播放"><i><em/>播放全部</i></a>
                        </Play>
                        <Add type={PLAY_TYPE.PLAYLIST.TYPE} songs={songs}>
                            <a href={null} styleName="btn-add-play" title="添加到播放列表"/>
                        </Add>
                        <a href={null} styleName="btn-subscribe" title="播放"><i><em/>收藏全部</i></a>
                    </div>
                    <div styleName="table-title">
                        <h3>歌曲列表</h3>
                        <span styleName="other">
                            <span styleName="total">{detail.songs?.length}首歌</span>
                        </span>
                    </div>
                    <SongTable loading={detailLoading} detail={detail} showDislike onDislikeSuccess={handleDislikeSuccess}/>
                </div>
            </div>
            <div className="right-wrapper">
                <div className="right">
                    <div styleName="rcmd-des">
                        <h3 styleName="rcmd-title"><span styleName="question-icon"/>个性化推荐如何工作</h3>
                        <p>它聪明、熟悉每个用户的喜好，从海量音乐中挑选出你可能喜欢的音乐。</p>
                        <p>它通过你每一次操作来记录你的口味</p>
                        <ul styleName="summary">
                            <li>
                                <span styleName="icon play-icon"/>你播放了<strong styleName="count">{info.listenSongs}</strong>首音乐
                            </li>
                            <li>
                                <span styleName="icon like-icon"/>你喜欢了<strong styleName="count">--</strong>首音乐
                            </li>
                            <li>
                                <span styleName="icon subscribe-icon"/>你收藏了<strong styleName="count">{info.profile?.follows || 0}</strong>位歌手
                            </li>
                        </ul>
                        <p>你提供给云音乐的信息越多，它就越了解你的音乐喜好。</p>
                    </div>
                    <ClientDownload/>
                </div>
            </div>
        </div>
    </Page>
}

export default DailyRecommendation
