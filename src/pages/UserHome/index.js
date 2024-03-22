/**
 * 用户主页
 */
import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { throttle } from 'lodash-es'
import withRouter from 'hoc/withRouter'
import useShallowEqualSelector from 'hook/useShallowEqualSelector'
import {
  requestDetail as requestUserDetail,
  requestPlaylist,
  requestRadios
} from 'services/user'
import { DEFAULT_AVATAR, DEFAULT_DOCUMENT_TITLE } from 'constants'
import { USER_AUTH_TYPE } from 'constants/user'
import Page from 'components/Page'
import GenderIcon from 'components/business/GenderIcon'
import RankingList from 'components/business/ListenMusicRankingList'
import SubTitle from 'components/SubTitle'
import ListLoading from 'components/ListLoading'
import PlaylistItem from 'components/business/PlaylistItem'
import { getThumbnail, isEndReached } from 'utils'

import styles from './index.scss'

const DEFAULT_LIMIT = 30

function getDefaultParams() {
  return {
    limit: DEFAULT_LIMIT,
    offset: 0
  }
}

function UserHome(props) {
  const { isLogin, userInfo } = useShallowEqualSelector(({ user }) => ({
    isLogin: user.isLogin,
    userInfo: user.userInfo
  }))

  const [userDetail, setUserDetail] = useState(null)
  const [params, setParams] = useState(getDefaultParams())
  const [more, setMore] = useState(false)
  const [playlistLoading, setPlaylistLoading] = useState(false)
  const [createdPlaylists, setCreatedPlaylists] = useState([])
  const [collectedPlaylists, setCollectedPlaylists] = useState([])
  const [radios, setRadios] = useState([])

  const isMounted = useRef(false)

  const playlistRef = useRef()

  const userId = Number(props.params?.id)

  const isSelf = isLogin && userInfo?.userId === userId

  const fetchRadios = useCallback(async () => {
    const res = await requestRadios({ uid: userId })
    if (isMounted.current) {
      setRadios(res?.djRadios || [])
    }
  }, [userId])

  const fetchPlaylists = useCallback(
    async (query) => {
      if (playlistLoading) {
        return
      }
      try {
        setPlaylistLoading(true)
        const res = await requestPlaylist({
          ...query,
          uid: userId
        })
        if (isMounted.current) {
          const data = res?.playlist || []
          const index = data.findIndex(
            (item) => item?.creator?.userId !== userId
          )
          if (index === -1) {
            setCreatedPlaylists(createdPlaylists.concat(data))
          } else {
            const createdList = data.slice(0, index)
            const collectedList = data.slice(index)
            if (createdList.length) {
              setCreatedPlaylists(createdPlaylists.concat(createdList))
            }
            if (collectedList.length) {
              setCollectedPlaylists(collectedPlaylists.concat(collectedList))
            }
          }
          setParams(query)
          setMore(res?.more)
        }
      } finally {
        setPlaylistLoading(false)
      }
    },
    [playlistLoading, createdPlaylists, collectedPlaylists, userId]
  )

  const scroll = useCallback(() => {
    const playlistReached = isEndReached(playlistRef.current)
    if (more && playlistReached) {
      const query = {
        ...params,
        offset: params.offset + params.limit
      }
      void fetchPlaylists(query)
    }
  }, [fetchPlaylists, more, params])

  const resetData = () => {
    setMore(false)
    setCreatedPlaylists([])
    setCollectedPlaylists([])
  }

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scrollThrottle = useCallback(throttle(scroll, 250))

  useEffect(() => {
    window.addEventListener('scroll', scrollThrottle)

    return () => {
      window.removeEventListener('scroll', scrollThrottle)
    }
  }, [scrollThrottle])

  useEffect(() => {
    const fetchUserDetail = async () => {
      resetData()
      const res = await requestUserDetail({ uid: userId })
      if (isMounted.current) {
        setUserDetail(res)
        // 用户创建的电台
        fetchRadios()
        // 用户歌单
        fetchPlaylists(getDefaultParams())
      }
    }

    if (userId) {
      void fetchUserDetail()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const identify = userDetail?.identify

  const profile = userDetail?.profile

  const nickname = profile?.nickname || ''

  const renderActions = useMemo(() => {
    if (userDetail) {
      if (isSelf) {
        return <div className={styles['btn-right']}>编辑个人资料</div>
      }
      return (
        <>
          <div className={styles['btn-send']}>发私信</div>
          <div className={styles['btn-follow']}>
            <i className={styles.plus}>+</i>关注
          </div>
          {[USER_AUTH_TYPE.ARTIST, USER_AUTH_TYPE.MUSICIAN].includes(
            profile?.userType
          ) ? (
            <a
              href={`/artist/${profile?.artistId}`}
              className={styles['btn-right']}
            >
              查看歌手页
            </a>
          ) : null}
        </>
      )
    }
  }, [userDetail, isSelf, profile])

  const renderRadios = useMemo(() => {
    return (
      <ul className={styles.radios}>
        {radios.map((radio, index) => {
          const { id, name, picUrl, subCount, programCount } = radio
          const radioUrl = `/radio/${id}`
          return (
            <li
              key={id}
              className={`${styles.radio} ${index % 2 ? styles.odd : ''}`}
            >
              <Link to={radioUrl} className={styles.cover}>
                <img src={getThumbnail(picUrl, 50)} alt="" />
              </Link>
              <Link to={radioUrl} className={styles.name} title={name}>
                {name}
              </Link>
              <span className={styles['sub-count']}>订阅{subCount}次</span>
              <span className={styles['program-count']}>{programCount}期</span>
            </li>
          )
        })}
      </ul>
    )
  }, [radios])

  const renderPlaylist = useCallback((data) => {
    return (
      <ul className={styles.playlist}>
        {data.map((item, index) => {
          const parseItem = {
            ...item,
            coverUrl: item.coverImgUrl
          }
          return (
            <li key={`${item.id}-${index}`} className={styles.item}>
              <PlaylistItem item={parseItem} ellipsis />
            </li>
          )
        })}
      </ul>
    )
  }, [])

  const documentTitle = useMemo(
    () => `${nickname} - 用户 - ${DEFAULT_DOCUMENT_TITLE}`,
    [nickname]
  )

  const peopleCanSeeMyPlayRecord = userDetail?.peopleCanSeeMyPlayRecord // 听歌排行是否开放

  const playlistSubtitlePrefix = useMemo(
    () => (isSelf ? '我' : nickname),
    [isSelf, nickname]
  )

  return (
    <Page title={documentTitle}>
      <div className="main">
        <div className="gutter">
          <div className={styles['head-box']}>
            <div className={styles.avatar}>
              <img
                src={profile?.avatarUrl}
                alt="头像"
                onError={(e) => {
                  e.target.src = DEFAULT_AVATAR
                }}
              />
            </div>
            <div className={styles.info}>
              <div className={styles.meta}>
                <div className={styles['nickname-box']}>
                  <h2 className={styles.nickname}>{nickname}</h2>
                  {userDetail ? (
                    <a className={styles.level} href="#">
                      {userDetail?.level}
                      <i />
                    </a>
                  ) : null}
                  <span className={styles.gender}>
                    <GenderIcon gender={profile?.gender} />
                  </span>
                  {renderActions}
                </div>
                {identify ? (
                  <div className={styles.identity}>
                    认证：{identify?.imageDesc}
                  </div>
                ) : null}
              </div>
              <ul className={styles.summary}>
                <li>
                  <Link to="/">
                    <strong>{profile?.eventCount || 0}</strong>
                    <span>动态</span>
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <strong>{profile?.follows || 0}</strong>
                    <span>关注</span>
                  </Link>
                </li>
                <li>
                  <Link to="/">
                    <strong>{profile?.followeds || 0}</strong>
                    <span>粉丝</span>
                  </Link>
                </li>
              </ul>
              <div className={styles.extra}>
                {profile?.signature ? (
                  <div className={styles.row}>
                    个人介绍：{profile?.signature}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          {radios.length ? (
            <div className="clearfix">
              <SubTitle
                title={
                  <span className={styles.subtitle}>
                    {playlistSubtitlePrefix}创建的电台
                  </span>
                }
              />
              {renderRadios}
            </div>
          ) : null}
          {peopleCanSeeMyPlayRecord || isSelf ? (
            <div className={styles.box}>
              <RankingList
                userId={userId}
                listenSongs={userDetail?.listenSongs}
                limit={10}
              />
            </div>
          ) : null}
          <div>
            {profile?.playlistCount ? (
              <div className="clearfix">
                <SubTitle
                  title={
                    <span className={styles.subtitle}>
                      <span className={styles['subtitle-text']}>
                        {playlistSubtitlePrefix}创建的歌单
                        <span className={styles.reg}>&reg;</span>
                      </span>
                      （{profile?.playlistCount}）
                    </span>
                  }
                />
                {renderPlaylist(createdPlaylists)}
              </div>
            ) : null}
            {collectedPlaylists.length ? (
              <div className="clearfix">
                <SubTitle
                  title={
                    <span className={styles.subtitle}>
                      <span className={styles['subtitle-text']}>
                        {playlistSubtitlePrefix}收藏的歌单
                        <span className={styles.reg}>&reg;</span>
                      </span>
                    </span>
                  }
                />
                {renderPlaylist(collectedPlaylists)}
              </div>
            ) : null}
            <ListLoading loading={playlistLoading} />
            <div ref={playlistRef} />
          </div>
        </div>
      </div>
    </Page>
  )
}

export default withRouter(UserHome)
