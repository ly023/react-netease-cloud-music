import React from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import emitter from 'utils/eventEmitter'
import {requestDetail, requestDailySignIn} from 'services/user'
import './index.scss'

export default class Info extends React.Component {

    static propTypes = {
        userId: PropTypes.number,
    }

    constructor(props) {
        super(props)
        this.state = {
            detailLoading: false,
            dailySignInLoading: false,
            signInSuccess: false,
            detail: null
        }

        this.mounted = false
    }

    componentDidMount() {
        this.mounted = true
    }

    componentDidUpdate(prevProps) {
        const {userId} = this.props
        const {userId: prevUserId} = prevProps
        if (userId && !prevUserId) {
            this.setState({detailLoading: true})
            requestDetail({uid: userId})
                .then((res) => {
                    if (this.mounted) {
                        this.setState({
                            detail: res
                        })
                    }
                })
                .finally(() => {
                    if (this.mounted) {
                        this.setState({detailLoading: false})
                    }
                })
        }
    }

    componentWillUnmount() {
        this.mounted = false
    }

    handleCheckIn = () => {
        const body = {
            type: 1, // 0 为安卓端签到 ,1 为 web/PC 签到
        }

        if (this.state.dailySignInLoading) {
            return
        }

        this.setState({
            dailySignInLoading: true
        })

        requestDailySignIn(body)
            .then((res) => {
                if (this.mounted) {
                    this.setState((prevState) => {
                        let detail = {...prevState.detail}
                        detail.pcSign = true
                        detail.signInPoint = res.point

                        return {
                            detail,
                            signInSuccess: true,
                        }
                    })
                }
            })
            .catch((err) => {
                // 未登录/重复签到
                console.log(err, err.msg)
            })
            .finally(() => {
                if (this.mounted) {
                    this.setState({
                        dailySignInLoading: false
                    })
                }
            })
    }

    handleLogin = () => {
        // 事件通知
        emitter.emit('login')
    }

    render() {
        const {userId} = this.props
        const {detailLoading, detail, signInSuccess} = this.state

        return (
            detailLoading ? null : (userId ?
                <div styleName="my-info">
                    <div className="clearfix" styleName="base">
                        <Link to={`/user/home/${userId}`} styleName="avatar">
                            <img src={detail?.profile?.avatarUrl} alt="头像"/>
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
                                : <a href={null} styleName="checkin-btn checkin"
                                    onClick={this.handleCheckIn}><span>签到</span></a>
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
                    <a href={null} onClick={this.handleLogin} styleName='sign-in-btn'>用户登录</a>
                </div>
            )
        )
    }
}
