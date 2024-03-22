/**
 * 歌手专辑
 */
import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useNavigate } from 'react-router-dom'
import { stringify } from 'qs'
import ListLoading from 'components/ListLoading'
import Empty from 'components/Empty'
import Pagination from 'components/Pagination'
import AlbumItem from 'components/business/AlbumItem'
import { requestAlbum } from 'services/artist'
import { getUrlParameters, getUrlPaginationParams } from 'utils'
import styles from './index.scss'

const DEFAULT_LIMIT = 12

function Albums(props) {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()

  const { artistId } = props
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(false)
  const isMounted = useRef(false)

  const listWrapperRef = useRef()

  const [params, setParams] = useState(getUrlPaginationParams(DEFAULT_LIMIT))
  const [total, setTotal] = useState(0)

  const fetchAlbums = useCallback(async () => {
    setLoading(true)
    const query = {
      id: artistId,
      ...getUrlPaginationParams(DEFAULT_LIMIT)
    }
    try {
      const res = await requestAlbum(query)
      if (isMounted.current) {
        setParams(query)
        setAlbums(res?.hotAlbums || [])
        setTotal(res?.artist?.albumSize || 0)
      }
    } catch (e) {
      console.log(e)
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }, [artistId])

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    fetchAlbums()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handlePageChange = useCallback(
    (page) => {
      const urlParams = getUrlParameters()
      const { limit } = getUrlPaginationParams(DEFAULT_LIMIT)
      const offset = (page - 1) * limit
      const url = `${pathname}${stringify(
        {
          ...urlParams,
          limit,
          offset
        },
        { addQueryPrefix: true }
      )}`
      navigate(url)
    },
    [navigate, pathname]
  )

  const renderItems = useMemo(() => {
    if (Array.isArray(albums)) {
      return albums.map((item) => {
        const { id } = item
        return (
          <li key={id} className={styles.item}>
            <AlbumItem item={item} smallSize showDate />
          </li>
        )
      })
    }
  }, [albums])

  const current = useMemo(() => params.offset / params.limit + 1, [params])

  return (
    <>
      <ListLoading loading={loading} />
      {!loading ? (
        albums.length ? (
          <ul className={styles.list} ref={listWrapperRef}>
            {renderItems}
          </ul>
        ) : (
          <Empty tip="暂无专辑" />
        )
      ) : (
        ''
      )}
      <Pagination
        current={current}
        total={total}
        pageSize={params.limit}
        onChange={handlePageChange}
        el={listWrapperRef.current}
      />
    </>
  )
}

Albums.propTypes = {
  artistId: PropTypes.number.isRequired
}

export default Albums
