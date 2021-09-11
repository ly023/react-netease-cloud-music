/**
 * 电台详情页
 */
import {useEffect, useState, useCallback, useMemo, useRef} from 'react'
import {Link, useHistory, useLocation} from 'react-router-dom'
import dayjs from 'dayjs'
import {stringify} from 'qs'
import {requestDetail, requestPrograms} from 'services/radio'
import useShallowEqualSelector from 'utils/useShallowEqualSelector'
import Page from 'components/Page'
import ClientDownload from 'components/ClientDownload'
import Collapse from 'components/Collapse'
import ListLoading from 'components/ListLoading'
import Empty from 'components/Empty'
import Pagination from 'components/Pagination'
import Play from 'components/Play'
import Add from 'components/Add'
import SinglePlay from 'components/SinglePlay'
import {formatDuration, formatNumber, getThumbnail, getUrlPaginationParams, getUrlParameters} from 'utils'
import {PLAY_TYPE} from 'constants/music'

import './index.scss'

const DEFAULT_LIMIT = 100

const ACTION_TYPES = {
    add: '添加到播放列表',
    share: '分享',
    download: '下载',
}

function RadioDetail(props) {
    const history = useHistory()
    const {pathname, search} = useLocation()

    const {currentSong} = useShallowEqualSelector(({user}) => ({currentSong: user.player.currentSong}))

    const radioId = Number(props.match?.params?.id)

    const [detail, setDetail] = useState(null)
    const [programsLoading, setProgramsLoading] = useState(false)
    const [params, setParams] = useState(getUrlPaginationParams(DEFAULT_LIMIT))
    const [total, setTotal] = useState(0)
    const [programs, setPrograms] = useState([])
    const programsRef = useRef()

    const isMounted = useRef(false)

    const fetchPrograms = useCallback(async () => {
        setProgramsLoading(true)
        const query = {
            rid: radioId,
            ...params,
            ...getUrlParameters(),
        }
        try {
            const res = await requestPrograms(query)
            if (isMounted.current) {
                setParams(query)
                setPrograms(res?.programs || [])
                setTotal(res?.count || 0)
            }
        } catch (e) {

        } finally {
            if (isMounted.current) {
                setProgramsLoading(false)
            }
        }
    }, [radioId, params])

    useEffect(() => {

        const fetchDetail = async () => {
            const res = await requestDetail({rid: radioId})
            if (isMounted.current) {
                if (res?.code === 200) {
                    setDetail(res?.data)
                } else if (res?.code === 404) {
                    history.push('/404')
                }
            }
        }

        fetchDetail()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [radioId])

    useEffect(() => {
        isMounted.current = true

        return () => {
            isMounted.current = false
        }
    }, [])

    useEffect(() => {
        fetchPrograms()
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

    const handleSort = useCallback((asc) => {
        const urlParams = getUrlParameters()
        const url = `${pathname}${stringify({
            ...urlParams,
            offset: 0,
            asc,
        }, {addQueryPrefix: true})}`
        history.push(url)
    }, [history, pathname])

    const renderItems = useMemo(() => {
        if (Array.isArray(programs)) {
            return <ul ref={programsRef}>
                {programs.map((item, index) => {
                    const {id, serialNum, name, listenerCount, likedCount, scheduledPublishTime, duration} = item

                    return <li key={id} styleName={`program ${index % 2 ? 'odd' : ''}`}>
                        <div styleName="order">
                            <span styleName={"num"}>{serialNum}</span>
                            <SinglePlay id={id} type={PLAY_TYPE.PROGRAM.TYPE} active={currentSong?.program?.id === id}/>
                        </div>
                        <div styleName="name-box" title={name}>
                            <Link to={`/program/${id}`} styleName="name">{name}</Link>
                            <div styleName="actions">
                                <Add id={id} type={PLAY_TYPE.PROGRAM.TYPE}>
                                    <a href={null} styleName="icon add">{ACTION_TYPES.add}</a>
                                </Add>
                                <a href={null} styleName="icon share">{ACTION_TYPES.share}</a>
                                <a href={null} styleName="icon download">{ACTION_TYPES.download}</a>
                            </div>
                        </div>
                        <div styleName="listener-count">播放{formatNumber(listenerCount)}</div>
                        <div styleName="liked-count">赞{likedCount}</div>
                        <div styleName="time">{dayjs(scheduledPublishTime).format('YYYY-MM-DD')}</div>
                        <div styleName="duration">{formatDuration(duration)}</div>
                    </li>
                })}
            </ul>
        }
    }, [programs, currentSong])

    const current = useMemo(() => params.offset / params.limit + 1, [params])

    const asc = useMemo(() => params.asc ? JSON.parse(params.asc) : false, [params.asc])

    return <Page>
        <div className="main">
            <div className="left-wrapper">
                <div className="left">
                    <div styleName="head-box">
                        <div styleName="cover-box">
                            <img
                                src={getThumbnail(detail?.picUrl, 200)}
                                alt="封面"
                                styleName="cover"
                            />
                        </div>
                        <div styleName="info">
                            <h2 styleName="title"><span styleName="label"/>{detail?.name}</h2>
                            <div styleName="creator">
                                <img src={detail?.dj?.avatarUrl} alt="" styleName="avatar"/>
                                <Link to={`/user/home/${detail?.dj?.userId}`}
                                      styleName="nickname">{detail?.dj?.nickname}</Link>
                            </div>
                            <div styleName="operation">
                                <a
                                    href={null}
                                    styleName="btn-subscribe"
                                >
                                    订阅{detail?.subCount ? `(${formatNumber(detail.subCount)})` : ''}
                                </a>
                                <Play type={PLAY_TYPE.RADIO.TYPE} id={detail?.id}>
                                    <a
                                        href={null}
                                        styleName="btn-play"
                                    >
                                        <i styleName="play-icon"/><span>播放全部</span>
                                    </a>
                                </Play>
                                <a
                                    href={null}
                                    styleName="btn-share"
                                >
                                    分享{detail?.shareCount ? `(${formatNumber(detail.shareCount)})` : ''}
                                </a>
                            </div>
                            {
                                detail?.desc ? <>
                                    {detail?.category ? <Link
                                        to={`/discover/radio/category/${detail?.categoryId}`}
                                        styleName="category"
                                    >
                                        {detail.category}
                                    </Link> : null}
                                    <span styleName="desc">
                                    <Collapse content={detail.desc} maxWordNumber={140}/>
                                </span>
                                </> : null
                            }
                        </div>
                    </div>
                    <div styleName="programs-wrapper">
                        <div styleName="subtitle">
                            <h3>节目列表</h3>
                            <span styleName="total">共{detail?.programCount}期</span>
                            <span styleName="other">
                                <span styleName="sorter">
                                <span
                                    styleName={`desc ${asc ? '' : 'selected'}`}
                                    title="降序"
                                    onClick={() => handleSort(false)}
                                />
                                <span
                                    styleName={`asc ${asc ? 'selected' : ''}`}
                                    title="升序"
                                    onClick={() => handleSort(true)}
                                />
                                </span>
                            </span>
                        </div>
                        <>
                            <ListLoading loading={programsLoading}/>
                            {
                                !programsLoading ? (
                                    programs.length ? renderItems : <Empty/>
                                ) : ''
                            }
                            <Pagination
                                current={current}
                                total={total}
                                pageSize={Number(params.limit)}
                                onChange={handlePageChange}
                                el={programsRef.current}
                            />
                        </>
                    </div>
                </div>
            </div>
            <div className="right-wrapper">
                <ClientDownload/>
            </div>
        </div>
    </Page>
}

export default RadioDetail
