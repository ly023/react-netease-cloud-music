import { useState, useCallback } from 'react'
import FeedbackModal from 'components/business/FeedbackModal'
import styles from './index.scss'

function FooterBar() {
  const [feedbackVisible, setFeedbackVisible] = useState(false)

  const showFeedback = useCallback(() => {
    setFeedbackVisible(true)
  }, [])

  const hideFeedback = useCallback(() => {
    setFeedbackVisible(false)
  }, [])

  return (
    <div className={`clearfix ${styles['foot-bar']}`}>
      <div className={styles.wrapper}>
        <div className={styles.copy}>
          <p>
            <a
              href="https://music.163.com/html/web2/service.html"
              target="_blank"
              rel="noreferrer"
              className={`${styles.link} ${styles['color-1']}`}
            >
              服务条款
            </a>
            <span className={styles['copy-line']}>|</span>
            <a
              href="https://music.163.com/html/web2/privacy.html"
              target="_blank"
              rel="noreferrer"
              className={`${styles.link} ${styles['color-1']}`}
            >
              隐私政策
            </a>
            <span className={styles['copy-line']}>|</span>
            <a
              href="https://music.163.com/st/staticdeal/complaints.html"
              target="_blank"
              rel="noreferrer"
              className={`${styles.link} ${styles['color-1']}`}
            >
              版权投诉指引
            </a>
            <span className={styles['copy-line']}>|</span>
            <a
              className={`${styles.link} ${styles['color-1']}`}
              onClick={showFeedback}
            >
              意见反馈
            </a>
            <FeedbackModal visible={feedbackVisible} onCancel={hideFeedback} />
          </p>
          <p className={styles['color-2']}>
            <span className="copy-sep-company">
              网易公司版权所有©1997-2021
            </span>
            杭州乐读科技有限公司运营：
            <a
              href="https://p5.music.126.net/obj/wo3DlcOGw6DClTvDisK1/8282703158/452a/ca0c/3a10/caad83bc8ffaa850a9dc1613d74824fc.png"
              target="_blank"
              rel="noreferrer"
              className={`${styles.link} ${styles['color-2']}`}
            >
              浙网文[2021] 1186-054号
            </a>
          </p>
          <p className={styles['color-2']}>
            违法和不良信息举报电话：0571-89853516
            <span className={styles['copy-sep-email']}>
              举报邮箱：
              <a
                href="mailto:cloudmusicservice@163.com"
                className={`${styles.link} ${styles['color-2']}`}
              >
                ncm5990@163.com
              </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default FooterBar
