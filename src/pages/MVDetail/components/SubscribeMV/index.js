/**
 * 收藏/取消收藏mv
 */
import {useState, useCallback, cloneElement, Children} from 'react'
import PropTypes from 'prop-types'
import message from 'components/Message'
import {RESOURCE_ACTION_TYPE} from 'constants'
import {requestSubscribe} from 'services/mv'
import emitter from 'utils/eventEmitter'
import useShallowEqualSelector from 'utils/useShallowEqualSelector'

function SubscribeMV(props) {
    const {isLogin} = useShallowEqualSelector(({user}) => ({isLogin: user.isLogin}))

    const {children, id, status, onSuccess} = props
    const [loading, setLoading] = useState(false)

    const validateLogin = useCallback(() => {
        if (isLogin) {
            return true
        }
        emitter.emit('login')
        return false
    }, [isLogin])

    const handleLike = useCallback(async () => {
        if (loading) {
            return
        }
        if (validateLogin()) {
            setLoading(true)
            const newStatus = status ? RESOURCE_ACTION_TYPE.CANCEL : RESOURCE_ACTION_TYPE.OK
            requestSubscribe({
                mvid: id,
                t: newStatus,
            })
                .then((res) => {
                    if(res?.code === 200) {
                        const content = newStatus ? '收藏成功' : '取消收藏成功'
                        message.success({content})
                        onSuccess && onSuccess(newStatus)
                    }
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [validateLogin, loading, id, status, onSuccess])

    const onlyChildren = Children.only(children)

    return (
        cloneElement(onlyChildren, {
            onClick: handleLike,
        })
    )
}

SubscribeMV.propTypes = {
    id: PropTypes.number,
    status: PropTypes.bool,
    onSuccess: PropTypes.func,
}

export default SubscribeMV
