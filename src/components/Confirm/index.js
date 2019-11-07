import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'components/Modal'

import './index.scss'

function Confirm(props) {
    const {title, content, okText, cancelText, onOk, onCancel, confirmLoading} = props

    return <Modal {...props} title={title}>
        <div styleName="content">{content}</div>
        <div styleName="buttons">
            <button styleName="ok" disabled={confirmLoading} onClick={onOk}><i>{okText}</i></button>
            <button styleName="cancel" onClick={onCancel}><i>{cancelText}</i></button>
        </div>
    </Modal>
}

Confirm.propTypes = {
    title: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    confirmLoading: PropTypes.bool,
}

Confirm.defaultProps = {
    title: '提示',
    okText: '确定',
    cancelText: '取消',
    onOk() {},
    onCancel() {},
    confirmLoading: false,
}

export default Confirm
