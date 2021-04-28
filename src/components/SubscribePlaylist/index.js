/**
 * 收藏/取消收藏 歌单
 */
import {useState, useCallback, cloneElement, Children} from 'react'
import PropTypes from 'prop-types'
import message from 'components/Message'
import {PLAYLIST_COLLECTION_TYPE} from 'constants'
import {requestSubscribe} from 'services/playlist'

function SubscribePlaylist(props) {
    const {id, type, disabled = false, onSuccess} = props
    const [loading, setLoading] = useState(false)

    const handleCollect = useCallback(async () => {
        if (disabled || loading) {
            return
        }

        setLoading(true)
        requestSubscribe({
            id,
            t: type
        })
            .then(() => {
                const content = type === PLAYLIST_COLLECTION_TYPE.OK ? '收藏成功' : '取消收藏成功'
                message.success({content})
                onSuccess && onSuccess()
            })
            .finally(() => {
                setLoading(false)
            })
    }, [disabled, loading, id, type, onSuccess])

    const {children} = props
    const onlyChildren = Children.only(children)

    return (
        cloneElement(onlyChildren, {
            onClick: handleCollect,
            'data-loading': loading
        })
    )
}

SubscribePlaylist.propTypes = {
    id: PropTypes.number,
    type: PropTypes.oneOf(Object.values(PLAYLIST_COLLECTION_TYPE)),
    disabled: PropTypes.bool,
    onSuccess: PropTypes.func,
}

export default SubscribePlaylist
