/**
 *  收藏歌曲到歌单
 */
import {useState, useEffect, useCallback, useRef, cloneElement, Children } from 'react'
import PropTypes from 'prop-types'
import toast, { Toaster } from 'react-hot-toast'
import Modal from 'components/Modal'
import pubsub from 'utils/pubsub'
import useShallowEqualSelector from 'hook/useShallowEqualSelector'
import {updateUserPlaylistSongs} from 'services/playlist'
import Playlist from './components/Playlist'
import CreatePlaylistModal from './components/CreatePlaylistModal'

import './index.scss'

function AddToPlaylist(props) {
    const {children, songIds = []} = props

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
        pubsub.publish('login')
    }, [userId])

    const handleCancel = () => {
        setVisible(false)
    }

    const showCreatePlaylistModal = () => {
        setVisible(false)
        setCreateModalVisible(true)
    }

    const handleCreateModalCancel = () => {
        setCreateModalVisible(false)
    }

    const getErrorMessage = (code) => {
        switch (code) {
            case 502:
                return '歌曲已存在！'
            case 505:
                return '歌单已满！'
            default:
                return '添加失败，请稍后再试！'
        }
    }

    const updatePlaylistSongs = useCallback((playlistId) => {
        if (updateLoading) {
            return
        }
        setUpdateLoading(true)
        updateUserPlaylistSongs({
            op: 'add',
            pid: playlistId,
            tracks: songIds.join(','),
        }).then(() => {
            if (isMounted.current) {
                handleCancel()
                handleCreateModalCancel()
                toast.success('收藏成功')
            }
        }).catch((err) => {
            toast.error(getErrorMessage(err.message))
        }).finally(() => {
            setUpdateLoading(false)
        })
    }, [updateLoading, songIds])

    const handleCreateModalOk = (playlistId) => {
        updatePlaylistSongs(playlistId)
    }

    const onlyChildren = Children.only(children)

    return (
        <>
            {
                cloneElement(onlyChildren, {
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
            <Toaster/>
        </>
    )
}

AddToPlaylist.propTypes = {
    songIds: PropTypes.arrayOf(PropTypes.number),
}

export default AddToPlaylist
