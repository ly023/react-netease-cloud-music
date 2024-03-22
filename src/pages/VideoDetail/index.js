/**
 * 视频详情页
 */
import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  Fragment
} from 'react'
import { Link } from 'react-router-dom'
import {
  requestDetail,
  requestVideoUrl,
  requestInfo,
  requestSimilar
} from 'services/video'
import Page from 'components/Page'
import CustomPlayer from 'components/CustomPlayer'
import Comments from 'components/business/Comments'
import LikeResource from 'components/business/LikeResource'
import { RESOURCE_TYPE } from 'constants'
import {
  formatDuration,
  formatNumber,
  formatTimestamp,
  getThumbnail
} from 'utils'
// import SubscribeVideo from './components/SubscribeVideo'

import styles from './index.scss'

function VideoDetail(props) {
  const videoId = props.params?.id

  const [detail, setDetail] = useState(null)
  const [resources, setResource] = useState([])
  const [info, setInfo] = useState(null)
  const [similarVideos, setSimilarVideos] = useState([])

  const commentsRef = useRef()
  const isMounted = useRef(false)

  useEffect(() => {
    const fetchVideoUrls = async () => {
      try {
        const res = await requestVideoUrl({ id: videoId })
        if (isMounted.current) {
          const urls = res?.urls?.map((v) => ({
            name: v.r.toString(),
            url: v.url
          }))
          setResource(urls)
        }
      } catch (e) {
        console.log(e)
      }
    }

    const fetchDetail = async () => {
      const res = await requestDetail({ id: videoId })
      if (isMounted.current) {
        const data = res?.data
        if (data) {
          setDetail(data)
          const definitions = data?.resolutions?.map((v) => v.resolution)
          fetchVideoUrls(definitions)
        }
      }
    }

    const fetchInfo = async () => {
      try {
        const res = await requestInfo({ vid: videoId })
        if (isMounted.current) {
          setInfo(res)
        }
      } catch (e) {
        console.log(e)
      }
    }

    const fetchSimilarVideos = async () => {
      try {
        const res = await requestSimilar({ id: videoId })
        if (isMounted.current) {
          const data = res?.data || []
          setSimilarVideos(data)
        }
      } catch (e) {
        console.log(e)
      }
    }

    fetchDetail()
    fetchInfo()
    fetchSimilarVideos()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId])

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

  // const handleSubscribeSuccess = useCallback((status) => {
  //     setDetail({
  //         ...detail,
  //         subCount: status ? ++detail.subCount : --detail.subCount,
  //     })
  // }, [detail])

  const renderCreators = useCallback((creators) => {
    if (Array.isArray(creators)) {
      return creators.map((creator, index) => {
        const { userId, userName } = creator
        return (
          <Fragment key={userId}>
            <Link
              to={`/user/home/${userId}`}
              title={creators.map((v) => v.userName).join(' / ')}
            >
              {userName}
            </Link>
            {index !== creators.length - 1 ? ' / ' : null}
          </Fragment>
        )
      })
    }
  }, [])

  const renderVideos = useMemo(() => {
    return (
      <ul className={styles.videos}>
        {similarVideos.map((video) => {
          const { vid, title, coverUrl, durationms, playTime, creator } = video
          const videoUrl = `/video/${vid}`
          return (
            <li key={vid} className={styles.video}>
              <Link to={videoUrl} className={styles.cover}>
                <img src={getThumbnail(coverUrl, 96, 54)} alt="" />
                <div className={styles.mask}>
                  <span className={styles.icon} />
                  {formatNumber(playTime, 1)}
                </div>
              </Link>
              <div className={styles.meta}>
                <Link to={videoUrl} className={styles.title} title={title}>
                  {title}
                </Link>
                <p className={styles.duration}>{formatDuration(durationms)}</p>
                <p className={styles.creator}>by {renderCreators(creator)}</p>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }, [similarVideos, renderCreators])

  return (
    <Page>
      <div className="main">
        <div className="left-wrapper">
          <div className="left">
            <div className={styles['title-wrapper']}>
              <span className={styles.title}>{detail?.title}</span>
              <span className={styles['artist-name']}>
                by{' '}
                <Link to={`/artist/${detail?.creator?.userId}`}>
                  {detail?.creator?.nickname}
                </Link>
              </span>
            </div>
            <div className={styles.player}>
              <CustomPlayer urls={resources} />
            </div>
            <div className={styles.actions}>
              <LikeResource
                type={RESOURCE_TYPE.VIDEO.TYPE}
                id={videoId}
                status={!!info?.liked}
                onSuccess={handleLikedSuccess}
              >
                <button className={styles.btn}>
                  <span
                    className={`${styles.icon} ${styles['like-icon']} ${info?.liked ? styles.liked : ''}`}
                  />
                  ({info?.likedCount || 0})
                </button>
              </LikeResource>
              <button className={styles.btn}>
                <span
                  className={`${styles.icon} ${styles['subscribe-icon']}`}
                />
                ({detail?.subscribeCount || 0})
              </button>
              <button className={styles.btn}>
                <span className={`${styles.icon} ${styles['share-icon']}`} />(
                {detail?.shareCount || 0})
              </button>
            </div>
            <Comments type="VIDEO" id={videoId} onRef={setCommentsRef} />
          </div>
        </div>
        <div className="right-wrapper">
          <h3 className={styles['title-underline']}>视频简介</h3>
          <div className={styles.about}>
            <p>发布时间：{formatTimestamp(detail?.publishTime)}</p>
            <p>播放次数：{formatNumber(detail?.playTime) || 0}次</p>
            <p className={styles.desc}>{detail?.description}</p>
          </div>
          {similarVideos.length ? (
            <>
              <h3 className={styles['title-underline']}>相关推荐</h3>
              {renderVideos}
            </>
          ) : null}
        </div>
      </div>
    </Page>
  )
}

export default VideoDetail
