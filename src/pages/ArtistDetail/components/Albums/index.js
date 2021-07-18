/**
 * 歌手专辑
 */
import {useEffect, useState, useCallback, useMemo, useRef} from 'react'
import PropTypes from 'prop-types'
import {useLocation, useHistory} from 'react-router-dom'
import {stringify} from 'qs'
import ListLoading from 'components/ListLoading'
import AlbumItem from 'components/AlbumItem'
import Empty from 'components/Empty'
import Pagination from 'components/Pagination'
import {requestAlbum} from 'services/artist'
import {getUrlParameters, getUrlPaginationParams} from 'utils'
import './index.scss'

const DEFAULT_LIMIT = 12

function Albums(props) {
    const {pathname, search} = useLocation()
    const history = useHistory()

    const {artistId} = props
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
            ...getUrlPaginationParams(DEFAULT_LIMIT),
        }
        try {
            const res = await requestAlbum(query)
            if (isMounted.current) {
                setParams(query)
                setAlbums(res?.hotAlbums || [])
                setTotal(res?.artist?.albumSize || 0)
            }
        } catch (e) {

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

    const handlePageChange = useCallback((page) => {
        const urlParams = getUrlParameters()
        const {limit} = getUrlPaginationParams(DEFAULT_LIMIT)
        const offset = (page - 1) * limit
        const url = `${pathname}${stringify({
            ...urlParams,
            limit,
            offset,
        }, {addQueryPrefix: true})}`
        history.push(url)
    }, [history, pathname])

    const renderItems = useMemo(() => {
        if (Array.isArray(albums)) {
            return albums.map((item) => {
                const {id} = item
                return <li key={id} styleName="item">
                    <AlbumItem item={item} smallSize showDate/>
                </li>
            })
        }
    }, [albums])

    const current = useMemo(() => params.offset / params.limit + 1, [params])

    return <>
        <ListLoading loading={loading}/>
        {
            !loading ? (
                albums.length ? <ul styleName="list" ref={listWrapperRef}>
                    {renderItems}
                </ul> : <Empty/>
            ) : ''
        }
        <Pagination
            current={current}
            total={total}
            pageSize={params.limit}
            onChange={handlePageChange}
            el={listWrapperRef.current}
        />
    </>
}

Albums.propTypes = {
    artistId: PropTypes.number.isRequired,
}

export default Albums


