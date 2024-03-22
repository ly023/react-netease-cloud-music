import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import HistoryIcon from '@mui/icons-material/History'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import AddIcon from '@mui/icons-material/Add'
import ShareIcon from '@mui/icons-material/Share'
import ChatIcon from '@mui/icons-material/Chat'
import Page from 'components/Page'
import { DEFAULT_DOCUMENT_TITLE } from 'constants'
import useShallowEqualSelector from 'hook/useShallowEqualSelector'
import { requestAllTopList } from 'services/toplist'
import { requestDetail as requestPlaylistDetail } from 'services/playlist'
import { formatNumber, getThumbnail, getUrlParameter } from 'utils'
import pubsub from 'utils/pubsub'
import { parseSongs } from 'utils/song'
import { PLAY_TYPE } from 'constants/music'
import Add from 'components/business/Add'
import Play from 'components/business/Play'
import Comments from 'components/business/Comments'
import ListLoading from 'components/ListLoading'
import SongTable from './components/SongTable'

import styles from './index.scss'

function RankingList() {
  const navigate = useNavigate()

  const { userInfo, isLogin } = useShallowEqualSelector(({ user }) => ({
    userInfo: user.userInfo,
    isLogin: user.isLogin
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
        const res = await requestPlaylistDetail({ id })
        if (isMounted.current) {
          setDetail(res?.playlist || {})
        }
      } finally {
        if (isMounted.current) {
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
              activeItem = list.find((v) => v.id === Number(urlId))
            } else {
              activeItem = featureList[0]
            }
            setCurrentRank(activeItem)
            setMediaRankingList(list.splice(4))
            fetchPlaylistDetail(activeItem?.id)
          }
        }
      } finally {
        if (isMounted.current) {
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

  const handleSelect = useCallback(
    (item) => {
      const { id } = item
      const url = `/discover/toplist?id=${id}`
      setCurrentRank(item)
      navigate(url)
      fetchPlaylistDetail(id)
    },
    [navigate, fetchPlaylistDetail]
  )

  const renderRankingList = useCallback(
    (data) => {
      if (Array.isArray(data) && data.length) {
        return (
          <ul className={styles.list}>
            {data.map((item) => {
              const { id, name, coverImgUrl, updateFrequency } = item
              const selected = currentRank?.id === id
              return (
                <li
                  key={id}
                  className={`${styles.item} ${selected ? styles.selected : ''}`}
                  onClick={() => handleSelect(item)}
                >
                  <div className={styles['cover-box']}>
                    <div className={styles.cover}>
                      <img src={coverImgUrl} alt="" />
                    </div>
                  </div>
                  <div className={styles.name} title={name}>
                    {name}
                  </div>
                  <div className={styles.status}>{updateFrequency}</div>
                </li>
              )
            })}
          </ul>
        )
      }
    },
    [handleSelect, currentRank?.id]
  )

  const setCommentsRef = (ref) => {
    commentsRef.current = ref
  }

  const validateLogin = useCallback(() => {
    if (isLogin) {
      return true
    }
    pubsub.publish('login')
    return false
  }, [isLogin])

  const handleComment = () => {
    if (validateLogin()) {
      commentsRef.current.focusEditor()
    }
  }

  const songs = useMemo(() => parseSongs(detail?.tracks), [detail])

  const title = useMemo(() => {
    const name = currentRank?.name
    return `${name ? `${name} - ` : ''}排行榜 - ${DEFAULT_DOCUMENT_TITLE}`
  }, [currentRank?.name])

  const isSelf = detail?.creator?.userId === userInfo?.userId

  const currentId = currentRank?.id

  return (
    <Page title={title}>
      <div className={`main ${styles.wrapper}`}>
        <div className={styles['ranking-wrapper']}>
          {rankingListLoading ? (
            <ListLoading />
          ) : (
            <>
              <h2 className={styles.subtitle}>云音乐特色榜</h2>
              {renderRankingList(featureRankingList)}
              <h2 className={styles.subtitle}>全球媒体榜</h2>
              {renderRankingList(mediaRankingList)}
            </>
          )}
        </div>
        <div className={styles['playlist-wrapper']}>
          <div className={styles['playlist-detail']}>
            {playlistDetailLoading || rankingListLoading ? (
              <ListLoading />
            ) : (
              <>
                <div className={styles.info}>
                  <div className={styles.cover}>
                    <img
                      src={getThumbnail(currentRank?.coverImgUrl, 512)}
                      alt="封面"
                    />
                  </div>
                  <div className={styles.content}>
                    <h2 className={styles.title}>{currentRank?.name}</h2>
                    <div className={styles.time}>
                      <HistoryIcon className={styles['clock-icon']} />
                      最近更新：
                      {dayjs(detail?.trackNumberUpdateTime).format('MM-DD')}
                      <span className={styles.status}>
                        （{currentRank?.updateFrequency}）
                      </span>
                    </div>
                    <div className={styles.operation}>
                      <Play id={currentId} type={PLAY_TYPE.PLAYLIST.TYPE}>
                        <a
                          href={null}
                          className={styles['btn-play']}
                          title="播放"
                        >
                          <PlayCircleOutlineIcon />
                          <span>播放</span>
                        </a>
                      </Play>
                      <Add id={currentId} type={PLAY_TYPE.PLAYLIST.TYPE}>
                        <a
                          href={null}
                          className={styles['btn-add-play']}
                          title="添加到播放列表"
                        >
                          <AddIcon />
                        </a>
                      </Add>
                      <a href={null} className={styles['action-btn']}>
                        <ShareIcon />
                        <span>
                          {detail?.shareCount
                            ? `(${formatNumber(detail.shareCount)})`
                            : '分享'}
                        </span>
                      </a>
                      {/*<a href={null} className="btn-download"><span>下载</span></a>*/}
                      <a
                        href={null}
                        className={styles['action-btn']}
                        onClick={handleComment}
                      >
                        <ChatIcon />
                        <span>({detail?.commentCount || 0})</span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className={styles['tracks-wrapper']}>
                  <div className={styles['table-title']}>
                    <h3>歌曲列表</h3>
                    <span className={styles.other}>
                      <span className={styles.total}>
                        {Math.max(songs?.length, detail?.trackCount)}首歌
                      </span>
                      <span className={styles.more}>
                        播放：
                        <strong className={styles['play-count']}>
                          {detail?.playCount}
                        </strong>
                        次
                      </span>
                    </span>
                  </div>
                  <SongTable
                    loading={playlistDetailLoading}
                    songs={songs}
                    isSelf={isSelf}
                  />
                </div>
                <Comments
                  type="PLAYLIST"
                  id={currentId}
                  onRef={setCommentsRef}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </Page>
  )
}

export default RankingList
