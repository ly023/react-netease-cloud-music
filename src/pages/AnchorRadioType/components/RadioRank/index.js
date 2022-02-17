import {useState, useEffect, useCallback, useRef} from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import {stringify} from 'qs'
import withRouter from 'hoc/withRouter'
import SubTitle from 'components/SubTitle'
import ListLoading from 'components/ListLoading'
import Pagination from 'components/Pagination'
import {requestCategoryHot} from 'services/radio'
import {getThumbnail, getUrlParameter} from 'utils'

import './index.scss'

const DEFAULT_LIMIT = 30

function RadioRank(props) {
    const navigate = useNavigate()
    const {pathname, search} = useLocation()

    const {params: urlParams} = props

    const getPage = useCallback(() => {
        const page = getUrlParameter('page')
        if (/^\+?[1-9][0-9]*$/.test(page)) {
            return Number(page)
        }
        return 1
    }, [])

    const [params, setParams] = useState({
        cateId: urlParams.id,
        order: getUrlParameter('order') || undefined,
        limit: DEFAULT_LIMIT,
        offset: (getPage() - 1) * DEFAULT_LIMIT
    })
    const [current, setCurrent] = useState(0)
    const [total, setTotal] = useState(0)
    const [radios, setRadios] = useState([])
    const [loading, setLoading] = useState(false)
    const isMounted = useRef(false)

    useEffect(() => {
        isMounted.current = true

        return () => {
            isMounted.current = false
        }
    }, [])

    useEffect(() => {
        const fetchCategoryHot = async () => {
            setLoading(true)

            const page = getPage()
            const offset = (page - 1) * DEFAULT_LIMIT
            const query = {
                ...params,
                order: getUrlParameter('order') || undefined,
                limit: DEFAULT_LIMIT,
                offset,
            }
            try {
                const res = await requestCategoryHot(query)
                if (isMounted.current && res) {
                    const {djRadios = [], count = 0} = res
                    setParams(query)
                    setRadios(djRadios)
                    setTotal(count)
                    setCurrent(page)
                }
            } catch (e) {

            } finally {
                setLoading(false)
            }
        }
        fetchCategoryHot()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getPage, search])

    const handlePageChange = useCallback((page) => {
        setCurrent(page)
        const url = `${pathname}${stringify({
            order: getUrlParameter('order') || undefined,
            page
        }, {addQueryPrefix: true})}`
        navigate(url)
    }, [navigate, pathname])

    return <div>
        <SubTitle title="电台排行榜" slot={<div styleName="tabs">
            <Link to="" styleName="tab">上升最快</Link>
            <span styleName="line">|</span>
            <Link to="" styleName="tab">最热电台</Link>
        </div>}/>
        <ListLoading loading={loading}/>
        {
            !loading && radios.length ? <>
                <ul styleName="radios">
                    {
                        radios.map((item) => {
                            const {id, dj={}} = item
                            const link = `/radio/${id}`
                            return <li key={id} styleName="item">
                                <Link to={link}>
                                    <img src={getThumbnail(item.picUrl, 200)} alt="" styleName="cover"/>
                                </Link>
                                <div styleName="cont">
                                    <Link to={link} styleName="name">{item.name}</Link>
                                    <div styleName="user-info">
                                        <span styleName="user-icon"/>
                                        <Link to="" styleName="nickname">{dj.nickname}</Link>
                                    </div>
                                    <div styleName="stats">
                                        共{item.programCount}期&nbsp;&nbsp;&nbsp;&nbsp;订阅{item.subCount}次
                                    </div>
                                </div>
                            </li>
                        })
                    }
                </ul>
                <div styleName="pagination">
                    <Pagination
                        current={current}
                        total={total}
                        pageSize={params.limit}
                        onChange={handlePageChange}
                    />
                </div>
            </> : null
        }
    </div>
}

export default withRouter(RadioRank)
