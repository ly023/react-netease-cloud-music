import React, {useState, useEffect, useCallback, useRef} from 'react'
import PropTypes from 'prop-types'
import Modal from 'components/Modal'
import message from 'components/Message'
import emitter from 'utils/eventEmitter'
import useShallowEqualSelector from 'utils/useShallowEqualSelector'
import {updateUserPlaylistSongs} from 'services/playlist'
import Playlist from './components/Playlist'
import CreatePlaylistModal from './components/CreatePlaylistModal'

import './index.scss'

function AddToPlaylist(props) {
    const {children, songIds} = props

    const {userId} = useShallowEqualSelector(({user}) => ({
        userId: user.userInfo?.userId
    }))

    const [visible, setVisible] = useState(false)
    const [createModalVisible, setCreateModalVisible] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)
    const isMounted = useRef(false)

    useEffect(() => {
        isMounted.current = true

        return () => {
            isMounted.current = false
        }
    }, [])

    const addToPlaylist = useCallback((e) => {
        e.stopPropagation()
        if (userId) {
            setVisible(true)
            return
        }
        emitter.emit('login')
    }, [userId])

    const handleCancel = useCallback(() => {
        setVisible(false)
    }, [])

    const showCreatePlaylistModal = useCallback(() => {
        setVisible(false)
        setCreateModalVisible(true)
    }, [])

    const handleCreateModalCancel = useCallback(() => {
        setCreateModalVisible(false)
    }, [])

    const getErrorMessage = useCallback((code) => {
        switch (code) {
            case 502:
                return '歌曲已存在！'
            case 505:
                return '歌单已满！'
            default:
                return '添加失败，请稍后再试！'
        }
    }, [])

    const updatePlaylistSongs = useCallback((playlistId) => {
        if (updateLoading) {
            return
        }
        setUpdateLoading(true)
        updateUserPlaylistSongs({
            op: 'add',
            pid: playlistId,
            tracks: songIds.join(','),
        }).then((res) => {
            if (isMounted.current) {
                handleCancel()
                handleCreateModalCancel()
                const code = res?.body?.code
                if (code === 200) {
                    message.success({content: '收藏成功'})
                } else {
                    message.error({content: getErrorMessage(code)})
                }
            }
        }).finally(() => {
            setUpdateLoading(false)
        })
    }, [updateLoading, songIds, handleCancel, handleCreateModalCancel, getErrorMessage])

    const handleCreateModalOk = useCallback((playlistId) => {
        updatePlaylistSongs(playlistId)
    }, [updatePlaylistSongs])

    const onlyChildren = React.Children.only(children)

    return (
        <>
            {
                React.cloneElement(onlyChildren, {
                    onClick: addToPlaylist
                })
            }
            <Modal
                visible={visible}
                title="添加到歌单"
                width={480}
                height={414}
                onCancel={handleCancel}
            >
                <Playlist
                    userId={userId}
                    extraItem={<div styleName="create-item" onClick={showCreatePlaylistModal}>
                        <span styleName="plus-icon"/>新建歌单
                    </div>}
                    onItemClick={updatePlaylistSongs}
                />
            </Modal>
            <CreatePlaylistModal
                visible={createModalVisible}
                onOk={handleCreateModalOk}
                onCancel={handleCreateModalCancel}
            />
        </>
    )
}

AddToPlaylist.propTypes = {
    songIds: PropTypes.arrayOf(PropTypes.number),
}

AddToPlaylist.defaultProps = {
    songIds: [],
}

export default AddToPlaylist
