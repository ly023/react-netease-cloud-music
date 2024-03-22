import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { createForm } from 'rc-form'
import Modal from 'components/Modal'
import CustomButton from 'components/CustomButton'
import KEY from 'constants/keyboardEventKey'
import { trim, bytes } from 'utils'
import { createUserPlaylist } from 'services/playlist'

import styles from './index.scss'

function CreatePlaylistModal(props) {
  const { form, visible, onOk, onCancel } = props

  const { getFieldDecorator } = form

  const [loading, setLoading] = useState(false)
  const isMounted = useRef(false)
  const inputRef = useRef()

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  const handleCreatePlaylist = useCallback(() => {}, [])

  const handleEnter = useCallback(
      (e) => {
        if (e.key === KEY.ENTER) {
          handleCreatePlaylist()
        }
      },
      [handleCreatePlaylist]
  )

  const validateName = useCallback((rule, value, callback) => {
    if (
        !trim(value) &&
        !(inputRef.current && inputRef.current === document.activeElement)
    ) {
      callback('歌单名不能为空')
      return
    }
    const maxBytes = 40
    if (bytes(value) > maxBytes) {
      callback('歌单名不能超过20个汉字或40个英文字符！')
      return
    }
    if (value && (value.indexOf('#') >= 0 || value.indexOf('@') >= 0)) {
      callback('歌单名不能包含字符“@”和“#”！')
      return
    }
    callback()
  }, [])

  const handleCancel = useCallback(() => {
    onCancel && onCancel()
  }, [onCancel])

  const handleSubmit = useCallback(() => {
    if (loading) {
      return
    }
    form.validateFields({ force: true }, async (errors, values) => {
      if (!errors) {
        setLoading(true)
        createUserPlaylist(values)
            .then((res) => {
              if (isMounted.current) {
                onOk && onOk(res?.playlist?.id)
              }
            })
            .finally(() => {
              setLoading(false)
            })
      }
    })
  }, [loading, form, onOk])

  const error = useMemo(() => {
    const errors = form.getFieldError('name')
    return errors ? errors.join('，') : null
  }, [form])

  return (
      <Modal visible={visible} title="新建歌单" width={480} onCancel={onCancel}>
        <div className={styles.form}>
          <div className={styles['form-item']}>
            <span className={styles.label}>歌单名</span>
            {getFieldDecorator('name', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  validator: validateName
                }
              ]
            })(
                <input ref={inputRef} className={styles.input} onKeyPress={handleEnter} />
            )}
          </div>
          {error ? (
              <div className={styles.error}>
                <span className={styles['error-icon']} />
                {error}
              </div>
          ) : null}
          <p className={styles.tip}>可通过“收藏”将音乐添加到新歌单中</p>
          <div className={styles.footer}>
            <CustomButton
                type="primary"
                disabled={loading}
                onClick={handleSubmit}
            >
              {loading ? '新建中...' : '新 建'}
            </CustomButton>
            <CustomButton onClick={handleCancel}>取 消</CustomButton>
          </div>
        </div>
      </Modal>
  )
}

CreatePlaylistModal.propTypes = {
  visible: PropTypes.bool,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
}

export default createForm()(CreatePlaylistModal)
