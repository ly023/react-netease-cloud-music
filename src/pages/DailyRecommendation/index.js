import { useState, useEffect, useMemo, useRef } from 'react'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import AddIcon from '@mui/icons-material/Add'
import Page from 'components/Page'
import Add from 'components/business/Add'
import Play from 'components/business/Play'
import AddToPlaylist from 'components/business/AddToPlaylist'
import SongTable from 'components/business/SongTable'
import { DEFAULT_DOCUMENT_TITLE } from 'constants'
import { PLAY_TYPE } from 'constants/music'
import { requestRcmdSongs } from 'services/rcmd'
import { requestDetail } from 'services/user'
import useShallowEqualSelector from 'hook/useShallowEqualSelector'
import { parseSongs } from 'utils/song'

import styles from './index.scss'

const WEEKDAY = [
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
  '星期日'
]

function DailyRecommendation() {
  const { userInfo } = useShallowEqualSelector(({ user }) => ({
    userInfo: user.userInfo
  }))
  const isMounted = useRef(false)
  const [songs, setSongs] = useState([])
  const [info, setInfo] = useState({})
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    isMounted.current = true

    const fetchRcmdSongs = async () => {
      try {
        setDetailLoading(true)
        const res = await requestRcmdSongs()
        if (isMounted.current) {
          setSongs(parseSongs(res?.data?.dailySongs || []))
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
      const res = await requestDetail({ uid: userInfo.userId })
      if (isMounted.current) {
        setInfo(res)
      }
    }
    if (userInfo.userId) {
      fetchUserInfo()
    }
  }, [userInfo])

  const handleDislikeSuccess = (songs) => {
    setSongs(songs || [])
  }

  const documentTitle = useMemo(
    () => `每日歌曲推荐 - ${DEFAULT_DOCUMENT_TITLE}`,
    []
  )

  const songIds = useMemo(
    () => (Array.isArray(songs) ? songs.map((v) => v.id) : []),
    [songs]
  )

  return (
    <Page title={documentTitle}>
      <div className="main">
        <div className="left-wrapper">
          <div className="left">
            <div className={styles.header}>
              <div className={styles['date-icon']}>
                <p className={styles.day}>{WEEKDAY[new Date().getDay() - 1]}</p>
                <p className={styles.date}>{new Date().getDate()}</p>
                <div className={styles['date-mask']} />
              </div>
            </div>
            <div className={styles.operation}>
              <Play type={PLAY_TYPE.PLAYLIST.TYPE} songs={songs}>
                <a href={null} className={styles['btn-play']} title="播放">
                  <PlayCircleOutlineIcon className={styles['play-icon']} />
                  <span>播放全部</span>
                </a>
              </Play>
              <Add type={PLAY_TYPE.PLAYLIST.TYPE} songs={songs}>
                <a
                  href={null}
                  className={styles['btn-add-play']}
                  title="添加到播放列表"
                >
                  <AddIcon />
                </a>
              </Add>
              <AddToPlaylist songIds={songIds}>
                <a href={null} className={styles['action-btn']} title="播放">
                  收藏全部
                </a>
              </AddToPlaylist>
            </div>
            <div className={styles['table-title']}>
              <h3>歌曲列表</h3>
              <span className={styles.other}>
                <span className={styles.total}>{songs?.length}首歌</span>
              </span>
            </div>
            <SongTable
              loading={detailLoading}
              songs={songs}
              showDislike
              onDislikeSuccess={handleDislikeSuccess}
            />
          </div>
        </div>
        <div className="right-wrapper">
          <div className="right">
            <div className={styles['rcmd-des']}>
              <h3 className={styles['rcmd-title']}>
                <span className={styles['question-icon']} />
                个性化推荐如何工作
              </h3>
              <p>
                它聪明、熟悉每个用户的喜好，从海量音乐中挑选出你可能喜欢的音乐。
              </p>
              <p>它通过你每一次操作来记录你的口味</p>
              <ul className={styles.summary}>
                <li>
                  <span className={`${styles.icon} ${styles['play-icon']}`} />
                  你播放了
                  <strong className={styles.count}>{info.listenSongs}</strong>
                  首音乐
                </li>
                <li>
                  <span className={`${styles.icon} ${styles['like-icon']}`} />
                  你喜欢了<strong className={styles.count}>--</strong>首音乐
                </li>
                <li>
                  <span
                    className={`${styles.icon} ${styles['subscribe-icon']}`}
                  />
                  你收藏了
                  <strong className={styles.count}>
                    {info.profile?.follows || 0}
                  </strong>
                  位歌手
                </li>
              </ul>
              <p>你提供给云音乐的信息越多，它就越了解你的音乐喜好。</p>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

export default DailyRecommendation
