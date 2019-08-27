import React from 'react'
import FeedbackModal from 'components/FeedbackModal'
import './index.scss'

export default class FooterBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            feedbackVisible: false
        }
    }

    showFeedback = () => {
        this.setState({
            feedbackVisible: true
        })
    }

    hideFeedback = () => {
        this.setState({
            feedbackVisible: false
        })
    }

    render() {
        const {feedbackVisible} = this.state

        return (
            <div styleName='foot-bar'>
                <div className='clearfix' styleName='wrapper'>
                    <div styleName='copy'>
                        <p>
                            <a href='https://music.163.com/html/web2/service.html' target='_blank' styleName='link color-1'>服务条款</a><span
                                styleName='copy-line'>|</span>
                            <a href='https://music.163.com/html/web2/privacy.html' target='_blank' styleName='link color-1'>隐私政策</a><span
                                styleName='copy-line'>|</span>
                            <a href='https://music.163.com/st/staticdeal/complaints.html' target='_blank'
                                styleName='link color-1'>版权投诉指引</a><span
                                styleName='copy-line'>|</span>
                            <a styleName='link color-1' hidefocus='true' onClick={this.showFeedback}>意见反馈</a>
                        </p>
                        <p styleName='color-2'>
                            <span styleName='copy-sep-company'>网易公司版权所有©1997-2019</span>杭州乐读科技有限公司运营：<a
                                href='http://p1.music.126.net/-DB9zs1FAJq8vg7HOb-yOQ==/3250156395654666.jpg' target='_blank'
                                styleName='link color-2'>浙网文[2018] 3506-263号</a>
                        </p>
                        <p styleName='color-2'>
                            违法和不良信息举报电话：0571-89853516<span styleName='copy-sep-email'>举报邮箱：<a href='mailto:cloudmusicservice@163.com'
                                styleName='link color-2'>ncm5990@163.com</a></span>
                        </p>
                    </div>
                    <ul className='fr' styleName='enter'>
                        <li>
                            <a styleName='logo logo-auth' href='https://music.163.com/st/userbasic#/auth' target='_blank'/>
                            <span styleName="logo-title logo-title-auth">用户认证</span>
                        </li>
                        <li>
                            <a styleName='logo logo-musician' href='//music.163.com/recruit' target='_blank'/>
                            <span styleName="logo-title logo-title-musician">独立音乐人</span>
                        </li>
                        <li>
                            <a styleName='logo logo-reward' href='//music.163.com/web/reward' target='_blank'/>
                            <span styleName="logo-title logo-title-reward">赞赏</span>
                        </li>
                        <li>
                            <a styleName='logo logo-cash' href='https://music.163.com/uservideo#/plan' target='_blank'/>
                            <span styleName="logo-title logo-title-cash">视频奖励</span>
                        </li>
                    </ul>
                </div>
                <FeedbackModal visible={feedbackVisible} onCancel={this.hideFeedback}/>
            </div>
        )
    }
}
