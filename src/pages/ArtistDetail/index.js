/**
 * 歌手详情页
 */
import { useEffect, useState, useMemo, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import withRouter from 'hoc/withRouter'
import { requestDetail } from 'services/artist'
import Page from 'components/Page'
import Tabs from 'components/Tabs'
import { getThumbnail, getUrlParameter } from 'utils'
import { DEFAULT_DOCUMENT_TITLE } from 'constants'
import Top from './components/Top'
import Albums from './components/Albums'
import MV from './components/MV'
import Desc from './components/Desc'
import SimilarArtists from './components/SimilarArtists'

import styles from './index.scss'

const TOP_TAB_KEY = 'top'

function ArtistDetail(props) {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  const artistId = Number(props.params?.id)

  const [detail, setDetail] = useState(null)
  const [activeTabKey, setActiveTabKey] = useState(TOP_TAB_KEY)

  const isMounted = useRef(false)

  useEffect(() => {
    const key = getUrlParameter('tab') || TOP_TAB_KEY
    setActiveTabKey(key)
  }, [search])

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await requestDetail({ id: artistId })
        if (isMounted.current) {
          setDetail(res?.data)
        }
      } catch (e) {
        console.log(e)
      }
    }

    fetchDetail()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artistId])

  const handleTabChange = (key) => {
    navigate(`${pathname}?tab=${key}`)
  }

  const artist = detail?.artist

  const tabs = useMemo(
    () => [
      {
        key: TOP_TAB_KEY,
        name: '热门作品',
        content: <Top artistId={artistId} />
      },
      {
        key: 'album',
        name: '所有专辑',
        content: <Albums artistId={artistId} />
      },
      {
        key: 'mv',
        name: '相关MV',
        content: <MV artistId={artistId} />
      },
      {
        key: 'desc',
        name: '艺人介绍',
        content: <Desc artist={artist} />
      }
    ],
    [artistId, artist]
  )

  const documentTitle = useMemo(
    () =>
      `${artist?.name ? `${artist?.name} - ` : ''}${DEFAULT_DOCUMENT_TITLE}`,
    [artist]
  )

  const artistUserId = detail?.user?.userId

  return (
    <Page title={documentTitle}>
      <div className="main">
        <div className="left-wrapper">
          <div className="left">
            <div className={styles['head-box']}>
              <div className={styles.nickname}>
                {artist?.name}
                <span className={styles.alias}> </span>
              </div>
              <div className={styles['cover-box']}>
                <img src={getThumbnail(artist?.cover, 640, 300)} alt="" />
                <div className={styles.mask}>
                  <div className={styles['head-bottom']}>
                    {artistUserId ? (
                      <Link
                        to={`/user/home/${artistUserId}`}
                        className={styles['home-btn']}
                      >
                        <i />
                        个人主页
                      </Link>
                    ) : null}
                    <button className={styles['subscribe-btn']}>
                      <i />
                      收藏
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <Tabs
              tabs={tabs}
              activeTabKey={activeTabKey}
              onChange={handleTabChange}
            />
          </div>
        </div>
        <div className="right-wrapper">
          <SimilarArtists artistId={artistId} />
        </div>
      </div>
    </Page>
  )
}

export default withRouter(ArtistDetail)
