/**
 * 收藏/取消收藏 歌单
 */
import React, {useState, useCallback} from 'react'
import PropTypes from 'prop-types'
import message from 'components/Message'
import {PLAYLIST_COLLECTION_TYPE} from 'constants'
import {requestSubscribe} from 'services/playlist'

function CollectPlaylist(props) {
    const {id, type, disabled, onSuccess} = props
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
                onSuccess()
            })
            .finally(() => {
                setLoading(false)
            })
    }, [disabled, loading, id, type, onSuccess])

    const {children} = props
    const onlyChildren = React.Children.only(children)

    return (
        React.cloneElement(onlyChildren, {
            onClick: handleCollect,
            'data-loading': loading
        })
    )
}

CollectPlaylist.propTypes = {
    id: PropTypes.number,
    type: PropTypes.oneOf(Object.values(PLAYLIST_COLLECTION_TYPE)),
    disabled: PropTypes.bool,
    onSuccess: PropTypes.func,
}

CollectPlaylist.defaultProps = {
    disabled: false,
    onSuccess(){}
}

export default CollectPlaylist
