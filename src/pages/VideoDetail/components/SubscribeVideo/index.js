/**
 * 收藏/取消收藏视频
 */
import {useState, useCallback, cloneElement, Children} from 'react'
import PropTypes from 'prop-types'
import toast, { Toaster } from 'react-hot-toast'
import {RESOURCE_ACTION_TYPE} from 'constants'
import useShallowEqualSelector from 'hook/useShallowEqualSelector'
import {requestSubscribe} from 'services/video'
import pubsub from 'utils/pubsub'

function SubscribeVideo(props) {
    const {isLogin} = useShallowEqualSelector(({user}) => ({isLogin: user.isLogin}))

    const {children, id, status, onSuccess} = props
    const [loading, setLoading] = useState(false)

    const validateLogin = useCallback(() => {
        if (isLogin) {
            return true
        }
        pubsub.publish('login')
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
                id: id,
                t: newStatus,
            })
                .then((res) => {
                    if(res?.code === 200) {
                        const content = newStatus ? '收藏成功' : '取消收藏成功'
                        toast.success(content)
                        onSuccess && onSuccess(newStatus)
                    }
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [validateLogin, loading, id, status, onSuccess])

    const onlyChildren = Children.only(children)

    return <>
        {
            cloneElement(onlyChildren, {
                onClick: handleLike,
            })
        }
        <Toaster />
    </>
}

SubscribeVideo.propTypes = {
    id: PropTypes.number,
    status: PropTypes.bool,
    onSuccess: PropTypes.func,
}

export default SubscribeVideo
