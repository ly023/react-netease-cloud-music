import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {stringify} from 'qs'
import Page from 'components/Page'
import ListLoading from 'components/ListLoading'
import Empty from 'components/Empty'
import Pagination from 'components/Pagination'
import {DEFAULT_DOCUMENT_TITLE} from 'constants'
import {requestNewestAlbum, requestTopAlbum} from 'services/album'
import {getUrlParameter} from 'utils'
import AlbumItem from './components/AlbumItem'

import './index.scss'

const DEFAULT_LIMIT = 35

function Album() {
    const history = useHistory()
    const {pathname, search} = useLocation()
    const [newestAlbum, setNewestAlbum] = useState([])
    const [topAlbum, setTopAlbum] = useState([])
    const isMounted = useRef()
    const listWrapperRef = useRef()

    const getPage = useCallback(() => {
        const page = getUrlParameter('page')
        if (/^\+?[1-9][0-9]*$/.test(page)) {
            return Number(page)
        }
        return 1
    }, [])

    const [params, setParams] = useState({
        area: getUrlParameter('area'),
        limit: DEFAULT_LIMIT,
        offset: (getPage() - 1) * DEFAULT_LIMIT
    })
    const [current, setCurrent] = useState(0)
    const [total, setTotal] = useState(0)
    const [newestLoading, setNewestLoading] = useState(false)
    const [topLoading, setTopLoading] = useState(false)

    useEffect(() => {
        isMounted.current = true

        const fetchNewestAlbum = async () => {
            setNewestLoading(true)
            try {
                const res = await requestNewestAlbum()
                if (isMounted.current && res) {
                    setNewestAlbum((Array.isArray(res.albums) ? res.albums.slice(0, 10) : []))
                }
            } catch (e) {
            } finally {
                setNewestLoading(false)
            }
        }

        fetchNewestAlbum()

        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchTopAlbum = useCallback(async () => {
        setTopLoading(true)
        const page = getPage()
        const query = {
            ...params,
            area: getUrlParameter('area'),
            offset: (page - 1) * DEFAULT_LIMIT
        }
        try {
            const res = await requestTopAlbum(query)
            if (isMounted.current && res) {
                const {albums = [], total = 0} = res
                setParams(query)
                setTopAlbum(albums)
                setTotal(total)
                setCurrent(page)
            }
        } catch (e) {

        } finally {
            setTopLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params])

    const handlePageChange = useCallback((page) => {
        setCurrent(page)
        const url = `${pathname}?${stringify({
            area: getUrlParameter('area') || undefined,
            page
        })}`
        history.push(url)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history, params, pathname])

    useEffect(()=>{
        fetchTopAlbum()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])

    const documentTitle = useMemo(() => `新碟上架 - ${DEFAULT_DOCUMENT_TITLE}`, [])

    return <Page title={documentTitle}>
        <div className="main">
            <div className="gutter">
                <div styleName="title">
                    <h3>热门新碟</h3>
                </div>
                <ListLoading loading={newestLoading}/>
                {
                    !newestLoading ? (
                        newestAlbum.length ? <div styleName="list">
                            {
                                newestAlbum.map((item) => {
                                    return <div key={item.id} styleName="item">
                                        <AlbumItem item={item}/>
                                    </div>
                                })
                            }
                        </div> : <Empty/>
                    ) : ''
                }
                <div styleName="title" ref={listWrapperRef}>
                    <h3>全部新碟</h3>
                    <div className="fl" styleName="tabs">
                        {/* todo 专辑分类 */}
                        <div styleName="tab">
                            <Link to="/discover/album">全部</Link>
                            <span>|</span>
                        </div>
                        <div styleName="tab">
                            <Link to="/discover/album?area=ZH">华语</Link>
                            <span>|</span>
                        </div>
                        <div styleName="tab">
                            <Link to="/discover/album?area=EA">欧美</Link>
                            <span>|</span>
                        </div>
                        <div styleName="tab">
                            <Link to="/discover/album?area=KR">韩国</Link>
                            <span>|</span>
                        </div>
                        <div styleName="tab">
                            <Link to="/discover/album?area=JP">日本</Link>
                        </div>
                    </div>
                </div>
                <ListLoading loading={topLoading}/>
                {
                    !topLoading ? (
                        topAlbum.length ? <div styleName="list">
                            {
                                topAlbum.map((item) => {
                                    return <div key={item.id} styleName="item">
                                        <AlbumItem item={item}/>
                                    </div>
                                })
                            }
                        </div> : <Empty/>
                    ) : ''
                }
                <div styleName="pagination">
                    <Pagination
                        current={current}
                        total={Math.ceil(total / params.limit)}
                        onChange={handlePageChange}
                        el={listWrapperRef.current}
                    />
                </div>
            </div>
        </div>
    </Page>
}

export default Album
