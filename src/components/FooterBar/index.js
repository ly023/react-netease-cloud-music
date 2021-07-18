import {useState, useCallback} from 'react'
import FeedbackModal from 'components/FeedbackModal'
import './index.scss'

function FooterBar() {
    const [feedbackVisible, setFeedbackVisible] = useState(false)

    const showFeedback = useCallback(() => {
        setFeedbackVisible(true)
    }, [])

    const hideFeedback = useCallback(() => {
        setFeedbackVisible(false)
    }, [])

    return (
        <div className="clearfix" styleName='foot-bar'>
            <div styleName='wrapper'>
                <div styleName='copy'>
                    <p>
                        <a href='https://music.163.com/html/web2/service.html' target='_blank'
                           styleName='link color-1'>服务条款</a><span
                        styleName='copy-line'>|</span>
                        <a href='https://music.163.com/html/web2/privacy.html' target='_blank'
                           styleName='link color-1'>隐私政策</a><span
                        styleName='copy-line'>|</span>
                        <a href='https://music.163.com/st/staticdeal/complaints.html' target='_blank'
                           styleName='link color-1'>版权投诉指引</a><span
                        styleName='copy-line'>|</span>
                        <a styleName='link color-1' hidefocus='true' onClick={showFeedback}>意见反馈</a>
                        <FeedbackModal visible={feedbackVisible} onCancel={hideFeedback}/>
                    </p>
                    <p styleName='color-2'>
                        <span styleName='copy-sep-company'>网易公司版权所有©1997-2021</span>杭州乐读科技有限公司运营：<a
                        href='https://p5.music.126.net/obj/wo3DlcOGw6DClTvDisK1/8282703158/452a/ca0c/3a10/caad83bc8ffaa850a9dc1613d74824fc.png' target='_blank'
                        styleName='link color-2'>浙网文[2021] 1186-054号</a>
                    </p>
                    <p styleName='color-2'>
                        违法和不良信息举报电话：0571-89853516<span styleName='copy-sep-email'>举报邮箱：<a
                        href='mailto:cloudmusicservice@163.com'
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
        </div>
    )
}

export default FooterBar
