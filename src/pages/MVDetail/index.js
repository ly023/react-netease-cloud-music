/**
 * MV详情页
 */
import {useEffect, useState, useMemo, useRef} from 'react'
import {Link, useParams} from 'react-router-dom'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import ShareIcon from '@mui/icons-material/Share'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import MusicVideoIcon from '@mui/icons-material/MusicVideo'
import VideocamIcon from '@mui/icons-material/Videocam'
import {requestDetail, requestVideoUrl, requestInfo, requestSimilar} from 'services/mv'
import Page from 'components/Page'
import CustomPlayer from 'components/CustomPlayer'
import Comments from 'components/business/Comments'
import LikeResource from 'components/business/LikeResource'
import {RESOURCE_TYPE} from 'constants'
import {formatDuration, getThumbnail} from 'utils'
import SubscribeMV from './components/SubscribeMV'

import './index.scss'

function MVDetail() {
    const urlParams = useParams()

    const mvId = Number(urlParams?.id)

    const [detail, setDetail] = useState(null)
    const [resources, setResource] = useState([])
    const [info, setInfo] = useState(null)
    const [similarMVs, setSimilarMVs] = useState([])

    const commentsRef = useRef()
    const isMounted = useRef(false)

    useEffect(() => {
        const fetchVideoUrls = async (definitions) => {
            try {
                const highestDefinition = definitions[definitions.length - 1]
                const res = await requestVideoUrl({id: mvId, r: highestDefinition})
                if (isMounted.current) {
                    const url = res?.data?.url
                    setResource([{name: highestDefinition.toString(), url}])
                }
            } catch (e) {

            }
        }

        const fetchDetail = async () => {
            const res = await requestDetail({mvid: mvId})
            if (isMounted.current) {
                const data = res?.data
                if (data) {
                    setDetail({
                        ...data,
                        subed: res?.subed
                    })
                    const definitions = data?.brs?.map(v => v.br)
                    fetchVideoUrls(definitions)
                }
            }
        }

        const fetchInfo = async () => {
            try {
                const res = await requestInfo({mvid: mvId})
                if (isMounted.current) {
                    setInfo(res)
                }
            } catch (e) {

            }
        }

        const fetchSimilarMVs = async () => {
            try {
                const res = await requestSimilar({mvid: mvId})
                if (isMounted.current) {
                    const data = res?.mvs || []
                    setSimilarMVs(data)
                }
            } catch (e) {

            }
        }

        fetchDetail()
        fetchInfo()
        fetchSimilarMVs()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mvId])

    useEffect(() => {
        isMounted.current = true

        return () => {
            isMounted.current = false
        }
    }, [])

    const setCommentsRef = (ref) => {
        commentsRef.current = ref
    }

    const handleLikedSuccess = (status) => {
        setInfo({
            ...info,
            liked: status,
            likedCount: status ? ++info.likedCount : --info.likedCount
        })
    }

    const handleSubscribeSuccess = (status) => {
        setDetail({
            ...detail,
            subed: status,
            subCount: status ? ++detail.subCount : --detail.subCount,
        })
    }

    const renderMVs = useMemo(() => {
        return <ul styleName="mvs">
            {
                similarMVs.map((mv) => {
                    const {id, name, cover, duration, playCount, artistId, artistName} = mv
                    const mvUrl = `/mv/${id}`
                    return <li key={id} styleName="mv">
                        <Link to={mvUrl} styleName="cover">
                            <img src={getThumbnail(cover, 96, 54)} alt=""/>
                            <div styleName="mask">
                                <div styleName="count">
                                    <VideocamIcon styleName="video-icon"/><span>{playCount}</span>
                                </div>
                            </div>
                        </Link>
                        <div styleName="meta">
                            <Link to={mvUrl} styleName="name" title={name}>{name}</Link>
                            <p styleName="duration">{formatDuration(duration)}</p>
                            <p styleName="artist">by <Link
                                to={`/artist/${artistId}`} title={artistName}
                            >{artistName}</Link></p>
                        </div>
                    </li>
                })
            }
        </ul>
    }, [similarMVs])

    return <Page>
        <div className="main">
            <div className="left-wrapper">
                <div className="left">
                    <div styleName="title-box">
                        <MusicVideoIcon styleName="mv-icon"/><span styleName="title">{detail?.name}</span>
                    </div>
                    <span styleName="artists">
                        {
                            detail?.artists.map((artist, index) => {
                                const {id, name} = artist
                                return <span key={id} >
                                        <Link to={`/artist/${id}`} styleName="artist-name">{name}</Link>
                                    {index !== detail.artists.length - 1 ? ' / ' : ''}
                                    </span>
                            })
                        }
                    </span>
                    <div styleName="player">
                        <CustomPlayer urls={resources}/>
                    </div>
                    <div styleName="actions">
                        <LikeResource
                            type={RESOURCE_TYPE.MV.TYPE} id={mvId} status={!!info?.liked} onSuccess={handleLikedSuccess}
                        >
                            <button styleName="btn">
                                <ThumbUpIcon styleName={info?.liked ? 'liked' : ''}/>
                                <span>({info?.likedCount || 0})</span>
                            </button>
                        </LikeResource>
                        <SubscribeMV id={mvId} status={!!detail?.subed} onSuccess={handleSubscribeSuccess}>
                            <button styleName="btn">
                                <LibraryAddIcon/>
                                <span>({detail?.subCount || 0})</span>
                            </button>
                        </SubscribeMV>
                        <button styleName="btn">
                            <ShareIcon/>
                            <span>({info?.shareCount || 0})</span>
                        </button>
                    </div>
                    <Comments
                        type="MV"
                        id={mvId}
                        onRef={setCommentsRef}
                    />
                </div>
            </div>
            <div className="right-wrapper">
                <h3 styleName="title-underline">MV简介</h3>
                <div styleName="about">
                    <p>发布时间：{detail?.publishTime}</p>
                    <p>播放次数：{detail?.playCount || 0}次</p>
                    <p styleName="desc">{detail?.desc}</p>
                </div>
                {similarMVs.length ? <><h3 styleName="title-underline">相关推荐</h3>{renderMVs}</> : null}
            </div>
        </div>
    </Page>
}

export default MVDetail
