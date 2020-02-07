/**
 * 发现音乐-歌单
 */
import React, {useState, useEffect, useMemo, useCallback, useRef} from 'react'
import {Link, useHistory, useLocation} from 'react-router-dom'
import {stringify} from 'qs'
import Page from 'components/Page'
import ListLoading from 'components/ListLoading'
import Empty from 'components/Empty'
import Pagination from 'components/Pagination'
import Play from 'components/Play'
import {DEFAULT_DOCUMENT_TITLE} from 'constants'
import {PLAY_TYPE} from 'constants/play'
import {requestTop} from 'services/playlist'
import {formatNumber, getThumbnail, getUrlParameter} from 'utils'
import Categories from './components/Categories'

import './index.scss'

const DEFAULT_LIMIT = 35

function Playlist() {
    const history = useHistory()
    const {pathname, search} = useLocation()
    const [current, setCurrent] = useState(0)
    const [total, setTotal] = useState(0)
    const [catText, setCatText] = useState(getUrlParameter('cat') || '')
    const [playlists, setPlaylists] = useState([])
    const [loading, setLoading] = useState(false)

    const isMounted = useRef()

    const getPage = () => {
        const page = getUrlParameter('page')
        if (/^\+?[1-9][0-9]*$/.test(page)) {
            return Number(page)
        }
        return 1
    }

    const [params, setParams] = useState({
        cat: getUrlParameter('cat') || undefined,
        order: getUrlParameter('order') || undefined,
        limit: DEFAULT_LIMIT,
        offset: (getPage() - 1) * DEFAULT_LIMIT
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

            const page = getPage()
            const offset = (page - 1) * DEFAULT_LIMIT
            const query = {
                cat: getUrlParameter('cat') || undefined,
                order: getUrlParameter('order') || undefined,
                limit: DEFAULT_LIMIT,
                offset,
            }
            try {
                const res = await requestTop(query)
                if (isMounted.current && res) {
                    const {playlists = [], total = 0, cat} = res
                    setParams(query)
                    setPlaylists(playlists)
                    setTotal(total)
                    setCurrent(page)
                    setCatText(cat)
                }
            } catch (e) {

            } finally {
                setLoading(false)
            }
        }
        fetchPlaylists()
    }, [search])

    const handlePageChange = useCallback((page) => {
        setCurrent(page)
        const url = `${pathname}?${stringify({
            cat: getUrlParameter('cat') || undefined,
            order: getUrlParameter('order') || undefined,
            page
        })}`
        history.push(url)
    }, [history, pathname])

    const documentTitle = useMemo(() => {
        return `${catText}歌单 - 歌单 - ${DEFAULT_DOCUMENT_TITLE}`
    }, [catText])

    return <Page title={documentTitle}>
        <div className="main">
            <div styleName="wrapper">
                <div styleName="title">
                    <h3>
                        {catText}
                        <div styleName="category-btn-wrapper">
                            <Categories category={catText}>
                                <button styleName="category-btn">选择分类<i/></button>
                            </Categories>
                        </div>
                    </h3>
                    <Link to="/discover/playlist?order=hot&cat=全部" styleName="hot-btn">热门</Link>
                </div>
                <ListLoading loading={loading}/>
                {
                    !loading ? (
                        playlists.length ? <>
                            <ul styleName="list">
                                {
                                    playlists.map((item, index) => {
                                        const {id, name, creator = {}} = item
                                        const detailLink = `/playlist/${id}`
                                        return <li key={`${id}-${index}`} styleName="item">
                                            <div styleName="cover-wrapper">
                                                <Link to={detailLink} styleName="cover">
                                                    <img src={getThumbnail(item.coverImgUrl, 140)} alt="歌单封面"/>
                                                </Link>
                                                <div styleName="bottom">
                                                    <i className="fl" styleName="icon-headset"/>
                                                    <span className="fl" styleName="play-num">{formatNumber(item.playCount, 5)}</span>
                                                    <Play type={PLAY_TYPE.PLAYLIST.TYPE} id={id}>
                                                        <i className="fr" styleName="icon-play"/>
                                                    </Play>
                                                </div>
                                            </div>
                                            <Link to={detailLink} styleName="name" title={name}>{name}</Link>
                                            <div styleName="creator">
                                                by <Link to={`/user/home/${creator.userId}`} styleName="nickname" title={creator.nickname}>
                                                    {creator.nickname}
                                                </Link>
                                            </div>
                                        </li>
                                    })
                                }
                            </ul>
                            <div styleName="pagination">
                                <Pagination
                                    current={current}
                                    total={Math.ceil(total / params.limit)}
                                    onChange={handlePageChange}
                                />
                            </div>
                        </> : <Empty/>
                    ) : ''
                }
            </div>
        </div>
    </Page>
}

export default Playlist
