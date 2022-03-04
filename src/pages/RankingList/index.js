import {useState, useEffect, useCallback, useMemo, useRef} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import dayjs from 'dayjs'
import Page from 'components/Page'
import {DEFAULT_DOCUMENT_TITLE} from 'constants'
import {requestAllTopList} from 'services/toplist'
import {requestDetail as requestPlaylistDetail} from 'services/playlist'
import useShallowEqualSelector from 'utils/useShallowEqualSelector'
import {formatNumber, getThumbnail, getUrlParameter} from 'utils'
import emitter from 'utils/eventEmitter'
import {parseSongs} from 'utils/song'
import {PLAY_TYPE} from 'constants/music'
import Add from 'components/business/Add'
import Play from 'components/business/Play'
import Comments from 'components/business/Comments'
import ListLoading from 'components/ListLoading'
import SongTable from './components/SongTable'

import './index.scss'

function RankingList() {
    const navigate = useNavigate()

    const {userInfo, isLogin} = useShallowEqualSelector(({user}) => ({
        userInfo: user.userInfo,
        isLogin: user.isLogin,
    }))

    const [featureRankingList, setFeatureRankingList] = useState([])
    const [mediaRankingList, setMediaRankingList] = useState([])
    const [detail, setDetail] = useState(null)
    const [currentRank, setCurrentRank] = useState(null)
    const [rankingListLoading, setRankingListLoading] = useState(false)
    const [playlistDetailLoading, setPlaylistDetailLoading] = useState(false)

    const commentsRef = useRef()
    const isMounted = useRef(false)

    const fetchPlaylistDetail = useCallback(async (id) => {
        if (id) {
            try {
                setPlaylistDetailLoading(true)
                const res = await requestPlaylistDetail({id})
                if(isMounted.current) {
                    setDetail(res?.playlist || {})
                }
            } finally {
                if(isMounted.current) {
                    setPlaylistDetailLoading(false)
                }
            }
        }
    }, [])

    useEffect(() => {
        isMounted.current = true

        const urlId = getUrlParameter('id')

        const fetchRankingList = async () => {
            try {
                setRankingListLoading(true)
                const res = await requestAllTopList()
                if (isMounted.current) {
                    const list = res?.list || []
                    if (list.length) {
                        const featureList = list.slice(0, 4)
                        let activeItem = null
                        setFeatureRankingList(featureList)
                        if (urlId) {
                            activeItem = list.find(v => v.id === Number(urlId))
                        } else {
                            activeItem = featureList[0]
                        }
                        setCurrentRank(activeItem)
                        setMediaRankingList(list.splice(4))
                        fetchPlaylistDetail(activeItem?.id)
                    }
                }
            } finally {
                if(isMounted.current) {
                    setRankingListLoading(false)
                }
            }
        }

        fetchRankingList()

        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSelect = useCallback((item) => {
        const {id} = item
        const url = `/discover/toplist?id=${id}`
        setCurrentRank(item)
        navigate(url)
        fetchPlaylistDetail(id)
    }, [navigate, fetchPlaylistDetail])

    const renderRankingList = useCallback((data) => {
        if (Array.isArray(data) && data.length) {
            return <ul styleName='list'>
                {
                    data.map((item) => {
                        const {id, name, coverImgUrl, updateFrequency} = item
                        const selected = currentRank?.id === id
                        return <li key={id} styleName={`item ${selected ? 'selected' : ''}`}
                                   onClick={() => handleSelect(item)}>
                            <div styleName="cover-box">
                                <div styleName="cover">
                                    <img src={coverImgUrl} alt=""/>
                                </div>
                            </div>
                            <div styleName="name" title={name}>
                                {name}
                            </div>
                            <div styleName="status">
                                {updateFrequency}
                            </div>
                        </li>
                    })
                }
            </ul>
        }
    }, [handleSelect, currentRank?.id])

    const setCommentsRef = useCallback((ref) => {
        commentsRef.current = ref
    }, [])

    const validateLogin = useCallback(() => {
        if (isLogin) {
            return true
        }
        emitter.emit('login')
        return false
    }, [isLogin])

    const handleComment = useCallback(() => {
        if (validateLogin()) {
            commentsRef.current.focusEditor()
        }
    }, [validateLogin])

    const songs = useMemo(() => parseSongs(detail?.tracks), [detail])

    const title = useMemo(() => {
        const name = currentRank?.name
        return `${name ? `${name} - ` : ''}排行榜 - ${DEFAULT_DOCUMENT_TITLE}`
    }, [currentRank?.name])

    const renderGuide = useMemo(() => {
        if (songs?.length < detail?.trackCount) {
            return <div styleName="guide">
                <div styleName="text">查看更多内容，请下载客户端</div>
                <Link to="/download" styleName="download">
                    立即下载
                </Link>
            </div>
        }
    }, [songs, detail])

    const isSelf = detail?.creator?.userId === userInfo?.userId

    const currentId = currentRank?.id

    return <Page title={title} >
        <div className="main" styleName="wrapper">
            <div styleName="ranking-wrapper">
                {
                    rankingListLoading
                        ? <ListLoading/>
                        : <>
                            <h2 styleName="subtitle">云音乐特色榜</h2>
                            {renderRankingList(featureRankingList)}
                            <h2 styleName="subtitle">全球媒体榜</h2>
                            {renderRankingList(mediaRankingList)}
                        </>
                }
            </div>
            <div styleName="playlist-wrapper">
                <div styleName="playlist-detail">
                    {
                        playlistDetailLoading || rankingListLoading
                            ? <ListLoading/>
                            : <>
                                <div styleName="info">
                                    <div styleName="cover">
                                        <img
                                            src={getThumbnail(currentRank?.coverImgUrl, 200)}
                                            alt="封面"
                                        />
                                    </div>
                                    <div styleName="content">
                                        <h2 styleName="title">{currentRank?.name}</h2>
                                        <div styleName="time"><span
                                            styleName="clock-icon"/>最近更新：{dayjs(detail?.trackNumberUpdateTime).format('MM-DD')}<span
                                            styleName="status">（{currentRank?.updateFrequency}）</span></div>
                                        <div styleName="operation">
                                            <Play id={currentId} type={PLAY_TYPE.PLAYLIST.TYPE}>
                                                <a href={null} styleName="btn-play" title="播放"><i><em/>播放</i></a>
                                            </Play>
                                            <Add id={currentId} type={PLAY_TYPE.PLAYLIST.TYPE}>
                                                <a href={null} styleName="btn-add-play" title="添加到播放列表"/>
                                            </Add>
                                            <a
                                                href={null}
                                                styleName="btn-share"
                                            >
                                                <i>{detail?.shareCount ? `(${formatNumber(detail.shareCount)})` : '分享'}</i>
                                            </a>
                                            <a href={null} styleName="btn-download"><i>下载</i></a>
                                            <a
                                                href={null}
                                                styleName="btn-comment"
                                                onClick={handleComment}>
                                                <i>({detail?.commentCount || 0})</i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div styleName="tracks-wrapper">
                                    <div styleName="table-title">
                                        <h3>歌曲列表</h3>
                                        <span styleName="other">
                            <span styleName="total">{Math.max(songs?.length, detail?.trackCount)}首歌</span>
                            <span styleName="more">播放：<strong
                                styleName="play-count">{detail?.playCount}</strong>次</span></span>
                                    </div>
                                    <SongTable
                                        loading={playlistDetailLoading}
                                        songs={songs}
                                        isSelf={isSelf}
                                    />
                                    {renderGuide}
                                </div>
                                <Comments
                                    type="PLAYLIST"
                                    id={currentId}
                                    onRef={setCommentsRef}
                                />
                            </>
                    }
                </div>
            </div>
        </div>
    </Page>
}

export default RankingList
