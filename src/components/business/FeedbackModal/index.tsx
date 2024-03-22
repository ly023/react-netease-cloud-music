import { Component, ChangeEvent } from 'react'
import Modal from 'components/Modal'
import styles from './index.scss'

interface FeedbackModalProps {
  visible?: boolean
  onCancel?: () => void
}

interface FeedbackModalParams {
  [propName: string]: any
}

interface FeedbackModalState {
  params: FeedbackModalParams
  errorMsg: string
}

export default class FeedbackModal extends Component<
    FeedbackModalProps,
    FeedbackModalState
> {
  static defaultProps = {
    visible: false,
    onCancel: () => {}
  }

  state: FeedbackModalState = {
    params: {},
    errorMsg: ''
  }

  handleChange = (
      key: string,
      e: ChangeEvent & { target: HTMLTextAreaElement }
  ) => {
    const value = e && e.target ? e.target.value : ''

    this.setState((prevState) => {
      const params = { ...prevState.params }
      params[key] = value

      return {
        params
      }
    })
  }

  sendFeedback = () => {
    const { params, errorMsg } = this.state
    if (!params.feedback) {
      this.setState({
        errorMsg: '反馈内容不能为空'
      })
      return
    }

    if (errorMsg) {
      this.setState({
        errorMsg: ''
      })
    }
    // todo request

    // todo 意见发送成功
  }

  handleCancel = () => {
    this.props.onCancel && this.props.onCancel()
  }

  render() {
    const { errorMsg = '' } = this.state

    return (
        <Modal {...this.props} title="意见反馈">
          <div className={styles.feedback}>
            <p>任何产品中的问题，欢迎反馈给我们</p>
            <div className={styles['feedback-area']}>
            <textarea
                placeholder="请输入反馈内容"
                onChange={(e) => this.handleChange('feedback', e)}
            />
            </div>
            <div className={styles['feedback-contact']}>
            <textarea
                placeholder="请留下联系方式（电话、QQ、邮箱）"
                onChange={(e) => {
                  this.handleChange('contact', e)
                }}
            />
            </div>
            {errorMsg ? (
                <div className={styles['error-msg']}>{errorMsg}</div>
            ) : null}
            <div className={styles['feedback-btns']}>
              <a
                  className={`${styles['feedback-btn']} ${styles['feedback-confirm']}`}
                  onClick={this.sendFeedback}
              >
                <i>发送意见</i>
              </a>
              <a
                  className={`${styles['feedback-btn']} ${styles['feedback-cancel']}`}
                  onClick={this.handleCancel}
              >
                <i>取 消</i>
              </a>
            </div>
          </div>
        </Modal>
    )
  }
}
