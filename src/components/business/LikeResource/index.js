/**
 * 点赞/取消点赞资源（mv,电台,视频,动态）
 */
import {useState, useCallback, cloneElement, Children} from 'react'
import PropTypes from 'prop-types'
import toast, { Toaster } from 'react-hot-toast'
import {RESOURCE_ACTION_TYPE, RESOURCE_TYPE} from 'constants'
import {requestLike} from 'services/resource'
import pubsub from 'utils/pubsub'
import useShallowEqualSelector from 'hook/useShallowEqualSelector'

function LikeResource(props) {
    const {isLogin} = useShallowEqualSelector(({user}) => ({isLogin: user.isLogin}))

    const {children, id, type, status, onSuccess} = props
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
            requestLike({
                type,
                id,
                t: newStatus,
            })
                .then((res) => {
                    if (res?.code === 200) {
                        const content = newStatus ? '点赞成功' : '取消点赞成功'
                        toast.success(content)
                        onSuccess && onSuccess(newStatus)
                    }
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [validateLogin, loading, type, id, status, onSuccess])

    const onlyChildren = Children.only(children)

    return <>
        {
            cloneElement(onlyChildren, {
                onClick: handleLike,
            })
        }
        <Toaster/>
    </>
}

LikeResource.propTypes = {
    type: PropTypes.oneOf(Object.values(RESOURCE_TYPE).map(v => v.TYPE)),
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    status: PropTypes.bool,
    onSuccess: PropTypes.func,
}

export default LikeResource
