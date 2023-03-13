import PropTypes from 'prop-types'
import Modal from 'components/Modal'

import './index.scss'

function Confirm(props) {
    const {title = '提示', content, okText = '确定', cancelText = '取消', onOk, onCancel, confirmLoading = false} = props

    return <Modal {...props} title={title}>
       <div styleName="body">
           <div styleName="content">{content}</div>
           <div styleName="buttons">
               <button styleName="ok" disabled={confirmLoading} onClick={onOk}>{okText}</button>
               <button styleName="cancel" onClick={onCancel}>{cancelText}</button>
           </div>
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

export default Confirm
