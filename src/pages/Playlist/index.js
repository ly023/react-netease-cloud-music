/**
 * 发现音乐-歌单
 */
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { stringify } from 'qs'
import Page from 'components/Page'
import ListLoading from 'components/ListLoading'
import Empty from 'components/Empty'
import Pagination from 'components/Pagination'
import PlaylistItem from 'components/business/PlaylistItem'
import { DEFAULT_DOCUMENT_TITLE } from 'constants'
import { requestTop } from 'services/playlist'
import { getUrlParameter, getUrlPage } from 'utils'
import Categories from './components/Categories'

import styles from './index.scss'

const DEFAULT_LIMIT = 35

function Playlist() {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const [current, setCurrent] = useState(0)
  const [total, setTotal] = useState(0)
  const [catText, setCatText] = useState(getUrlParameter('cat') || '')
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(false)

  const isMounted = useRef(false)

  const [params, setParams] = useState({
    cat: getUrlParameter('cat') || undefined,
    order: getUrlParameter('order') || undefined,
    limit: DEFAULT_LIMIT,
    offset: (getUrlPage() - 1) * DEFAULT_LIMIT
  })

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoading(true)

      const page = getUrlPage()
      const offset = (page - 1) * DEFAULT_LIMIT
      const query = {
        cat: getUrlParameter('cat') || undefined,
        order: getUrlParameter('order') || undefined,
        limit: DEFAULT_LIMIT,
        offset
      }
      try {
        const res = await requestTop(query)
        if (isMounted.current && res) {
          const { playlists = [], total = 0, cat } = res
          setParams(query)
          setPlaylists(playlists)
          setTotal(total)
          setCurrent(page)
          setCatText(cat)
        }
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }
    fetchPlaylists()
  }, [search])

  const handlePageChange = useCallback(
    (page) => {
      setCurrent(page)
      const url = `${pathname}?${stringify(
        {
          cat: getUrlParameter('cat') || undefined,
          order: getUrlParameter('order') || undefined,
          page
        },
        { addQueryPrefix: true }
      )}`
      navigate(url)
    },
    [navigate, pathname]
  )

  const documentTitle = useMemo(() => {
    return `${catText}歌单 - 歌单 - ${DEFAULT_DOCUMENT_TITLE}`
  }, [catText])

  return (
    <Page title={documentTitle}>
      <div className="main">
        <div className={styles.wrapper}>
          <div className={styles.title}>
            <h3>
              {catText}
              <div className={styles['category-btn-wrapper']}>
                <Categories category={catText}>
                  <button className={styles['category-btn']}>
                    选择分类
                    <i />
                  </button>
                </Categories>
              </div>
            </h3>
            <Link
              to="/discover/playlist?order=hot&cat=全部"
              className={styles['hot-btn']}
            >
              热门
            </Link>
          </div>
          <ListLoading loading={loading} />
          {!loading ? (
            playlists.length ? (
              <>
                <ul className={styles.list}>
                  {playlists.map((item, index) => {
                    const parseItem = {
                      ...item,
                      coverUrl: item.coverImgUrl
                    }
                    return (
                      <li key={`${item.id}-${index}`} className={styles.item}>
                        <PlaylistItem item={parseItem} ellipsis showCreator />
                      </li>
                    )
                  })}
                </ul>
                <div className={styles.pagination}>
                  <Pagination
                    current={current}
                    total={total}
                    pageSize={params.limit}
                    onChange={handlePageChange}
                  />
                </div>
              </>
            ) : (
              <Empty />
            )
          ) : (
            ''
          )}
        </div>
      </div>
    </Page>
  )
}

export default Playlist
