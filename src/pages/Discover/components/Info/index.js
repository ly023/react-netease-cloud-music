import React, {useState, useEffect, useRef} from 'react'
import {Link} from 'react-router-dom'
import {DEFAULT_AVATAR} from 'constants'
import emitter from 'utils/eventEmitter'
import useShallowEqualSelector from 'utils/useShallowEqualSelector'
import {requestDetail, requestDailySignIn} from 'services/user'

import './index.scss'

function Info() {
    const {isLogin, userInfo: {userId}} = useShallowEqualSelector(({user}) => ({isLogin: user.isLogin, userInfo: user.userInfo}))
    const [detail, setDetail] = useState(null)
    const [dailySignInLoading, setDailySignInLoading] = useState(false)
    const [signInSuccess, setSignInSuccess] = useState(false)
    const isMounted = useRef(false)

    const handleCheckIn = () => {
        if (dailySignInLoading) {
            return
        }

        setDailySignInLoading(true)

        const body = {
            type: 1, // 0 为安卓端签到 ,1 为 web/PC 签到
        }

        requestDailySignIn(body)
            .then((res) => {
                if (isMounted.current) {
                    setDetail({
                        ...detail,
                        pcSign: true,
                        signInPoint: res.point,
                    })
                    setSignInSuccess(true)
                }
            })
            .catch((err) => {
                // 未登录/重复签到
                console.log(err, err.msg)
            })
            .finally(() => {
                if (isMounted.current) {

                    setTimeout(()=>{
                        setDailySignInLoading(false)
                    }, 2000)
                }
            })
    }

    const handleLogin = () => {
        // 事件通知
        emitter.emit('login')
    }

    useEffect(() => {
        const fetchDetail = async () => {
            const res = await requestDetail({uid: userId})
            if (isMounted.current) {
                setDetail(res)
            }
        }

        isMounted.current = true
        if(userId) {
            fetchDetail()
        }

        return () => {
            isMounted.current = false
        }
    }, [userId])

    const avatarUrl = detail?.profile?.avatarUrl || ''

    return isLogin && detail ? <div styleName="my-info">
        <div className="clearfix" styleName="base">
            <Link to={`/user/home/${userId}`} styleName="avatar">
                <img src={avatarUrl} alt="头像" onError={(e) => {e.target.src = DEFAULT_AVATAR}}/>
            </Link>
            <div styleName="meta">
                <Link to={`/user/home/${userId}`} styleName="nickname">{detail?.profile?.nickname}</Link>
                <a styleName="level" href="#">{detail?.level}<i/></a>
                {detail?.pcSign
                    ? <a href={null} styleName="checkin-btn checkin-disabled"><span>已签到</span>
                        <div styleName={`point-popover${signInSuccess ? " fade" : ""}`}>
                            <span styleName="point-popover-arrow"/>
                            <div styleName="point-popover-content">获得 <span
                                styleName="point">{detail?.signInPoint}</span>积分
                            </div>
                        </div>
                    </a>
                    : <a href={null} styleName="checkin-btn checkin" onClick={handleCheckIn}><span>签到</span></a>
                }
            </div>
        </div>
        <ul styleName="summary">
            <li>
                <Link to="/1">
                    <strong>{detail?.profile?.eventCount}</strong>
                    <span>动态</span>
                </Link>
            </li>
            <li>
                <Link to="/1">
                    <strong>{detail?.profile?.follows}</strong>
                    <span>关注</span>
                </Link>
            </li>
            <li>
                <Link to="/1">
                    <strong>{detail?.profile?.cCount}</strong>
                    <span>粉丝</span>
                </Link>
            </li>
        </ul>
    </div>
        : <div styleName='sign-in'>
            <p styleName='sign-in-text'>登录网易云音乐，可以享受无限收藏的乐趣，并且无限同步到手机</p>
            <a href={null} onClick={handleLogin} styleName='sign-in-btn'>用户登录</a>
        </div>
}

export default React.memo(Info)
