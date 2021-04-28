import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'components/Modal'
import './index.scss'

export default class FeedbackModal extends React.Component {

    static propTypes = {
        visible: PropTypes.bool,
        onCancel: PropTypes.func,
    }

    static defaultProps = {
        visible: false,
    }

    constructor(props) {
        super(props)
        this.state = {
            params: {},
            errorMsg: ''
        }
    }

    handleChange = (key, e) => {
        let value = e && e.target ? e.target.value : ''

        this.setState((prevState) => {
            let params = {...prevState.params}
            params[key] = value

            return {
                params
            }
        })
    }

    sendFeedback = () => {
        const {params, errorMsg} = this.state
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
        const {errorMsg} = this.state

        return (
            <Modal {...this.props} title="意见反馈">
                <div styleName="feedback">
                    <p>任何产品中的问题，欢迎反馈给我们</p>
                    <div styleName="feedback-area">
                        <textarea
                            placeholder="请输入反馈内容"
                            onChange={(e) => this.handleChange('feedback', e)}
                        />
                    </div>
                    <div styleName="feedback-contact">
                        <textarea
                            placeholder="请留下联系方式（电话、QQ、邮箱）"
                            onChange={(e)=>{this.handleChange('contact', e)}}
                        />
                    </div>
                    {errorMsg ? <div styleName="error-msg">{errorMsg}</div> : null}
                    <div styleName="feedback-btns">
                        <a
                            href={null}
                            styleName="feedback-btn feedback-confirm"
                            hidefocus="true"
                            onClick={this.sendFeedback}
                        ><i>发送意见</i></a>
                        <a
                            href={null}
                            styleName="feedback-btn feedback-cancel"
                            hidefocus="true"
                            onClick={this.handleCancel}
                        ><i>取 消</i></a>
                    </div>
                </div>
            </Modal>
        )
    }
}
