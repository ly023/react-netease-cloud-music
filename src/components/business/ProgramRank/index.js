import {useState, useEffect, useCallback, useMemo, useRef} from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import {getThumbnail} from 'utils'
import {requestProgramRank} from 'services/program'
import {PLAY_TYPE} from 'constants/music'
import Play from 'components/business/Play'
import ListLoading from 'components/ListLoading'

import './index.scss'

function ProgramRank(props) {
    const {type, onLoad} = props
    const isMounted = useRef(false)
    const [programRank, setProgramRank] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        isMounted.current = true

        return () => {
            isMounted.current = false
        }
    }, [])

    useEffect(() => {
        const limit = type === 'part' ? 10 : 100

        const fetchProgramRank = async () => {
            try {
                setLoading(true)
                const res = await requestProgramRank({limit})
                if (isMounted.current) {
                    setProgramRank(res.toplist)
                    onLoad(res)
                }
            } finally {
                setLoading(false)
            }
        }
        fetchProgramRank()
    }, [type, onLoad])

    const getFluctuation = useCallback((rank, lastRank) => {
        if (lastRank === -1) {
            return <i styleName="new"/>
        }
        if (rank === lastRank) {
            return <span styleName="stable">﹣0</span>
        }
        if (rank < lastRank) {
            return <span styleName="ascend"><i/>{lastRank - rank}</span>
        }
        return <span styleName="descend"><i/>{rank - lastRank}</span>
    }, [])

    const isFullType = useMemo(() => type === 'full', [type])

    return loading
        ? <ListLoading loading={loading}/>
        : <ul styleName="list">
            {
                programRank.map((item, index) => {
                    const {rank, lastRank, program = {}} = item
                    const {id, radio = {}} = program
                    const order = index + 1
                    // todo percent
                    const percent = '50%'

                    const radioUrl = `/radio/${radio.id}`
                    const programUrl = `/program/${program.id}`

                    return <li key={id} styleName={`item ${isFullType ? 'full' : ''} ${order % 2 === 0 ? 'even' : ''}`}>
                        <div className="fl" styleName={`order ${order <= 3 ? 'top' : ''}`}>
                            {order < 10 ? `0${order}` : order}
                            <div styleName="fluctuation">
                                {getFluctuation(rank, lastRank)}
                            </div>
                        </div>
                        <div className="fl" styleName="cover">
                            <img src={getThumbnail(program.coverUrl, 40)} alt=""/>
                            <Play id={id} type={PLAY_TYPE.PROGRAM.TYPE}>
                                <i styleName="play-icon"/>
                            </Play>
                        </div>
                        {
                            isFullType
                                ? <>
                                    <Link to={programUrl} className="fl" styleName="program-name">{program.name}</Link>
                                    <Link to={radioUrl} className="fl" styleName="radio-name">{radio.name}</Link>
                                </>
                                : <div className="fl" styleName="cont">
                                    <Link to={programUrl} styleName="program-name">{program.name}</Link>
                                    <Link to={radioUrl} styleName="radio-name">{radio.name}</Link>
                                </div>
                        }
                        {
                            isFullType ? <div className="fl" styleName="tag">
                                <Link to={`/discover/radio/category/${radio.id}`}>{radio.category}</Link>
                            </div> : null
                        }
                        <div className="fl" styleName="hot">
                            <div styleName="progress" style={{width: percent}}/>
                        </div>
                    </li>
                })
            }
        </ul>
}

ProgramRank.propTypes = {
    type: PropTypes.oneOf(['full', 'part']),
    onLoad: PropTypes.func,
}

ProgramRank.defaultProps = {
    type: 'part',
    onLoad() {}
}

export default ProgramRank
