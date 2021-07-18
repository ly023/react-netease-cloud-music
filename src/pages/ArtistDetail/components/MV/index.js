/**
 * MV
 */
import {useEffect, useState, useCallback, useMemo, useRef} from 'react'
import PropTypes from 'prop-types'
import {useLocation, useHistory, Link} from 'react-router-dom'
import {stringify} from 'qs'
import ListLoading from 'components/ListLoading'
import Empty from 'components/Empty'
import Pagination from 'components/Pagination'
import {requestMV} from 'services/artist'
import {getUrlParameters, getUrlPaginationParams, getThumbnail} from 'utils'
import './index.scss'

const DEFAULT_LIMIT = 100

function MV(props) {
    const {pathname, search} = useLocation()
    const history = useHistory()

    const {artistId} = props
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(false)
    const isMounted = useRef(false)

    const listWrapperRef = useRef()

    const [params, setParams] = useState(getUrlPaginationParams(DEFAULT_LIMIT))
    const [total, setTotal] = useState(0)

    const fetchVideos = useCallback(async () => {
        setLoading(true)
        const query = {
            id: artistId,
            ...getUrlPaginationParams(DEFAULT_LIMIT),
        }
        try {
            const res = await requestMV(query)
            if (isMounted.current) {
                setParams(query)
                setVideos(res?.mvs || [])
                // todo mv total
                setTotal(0)
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
        fetchVideos()
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
        if (Array.isArray(videos)) {
            return videos.map((video) => {
                const {id, name, imgurl} = video
                const url = `/mv/${id}`
                return <div key={id} styleName="item">
                    <Link to={url} styleName="cover-box">
                        <img src={getThumbnail(imgurl, 137, 103)} alt="" styleName="cover"/>
                        <div styleName="mask"><span styleName="icon-play"/></div>
                    </Link>
                    <Link to={url} styleName="name" title={name}>{name}</Link>
                </div>
            })
        }
    }, [videos])

    const current = useMemo(() => params.offset / params.limit + 1, [params])

    return <>
        <ListLoading loading={loading}/>
        {
            !loading ? (
                videos.length ? <ul styleName="list" ref={listWrapperRef}>
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

MV.propTypes = {
    artistId: PropTypes.number.isRequired,
}

export default MV


