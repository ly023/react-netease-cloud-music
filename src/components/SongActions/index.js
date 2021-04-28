import {useCallback} from 'react'
import PropTypes from 'prop-types'
import {PLAY_TYPE} from 'constants/play'
import Add from 'components/Add'
import AddToPlaylist from 'components/AddToPlaylist'

import './index.scss'

const ACTION_TYPES = {
    add: '添加到播放列表',
    favorite: '收藏',
    share: '分享',
    download: '下载',
    delete: '删除',
}

const defaultActions = Object.keys(ACTION_TYPES)

function SongActions(props) {
    const {id, actions = defaultActions, isSelf = false} = props

    const hasAction = useCallback((action) => {
        return actions.includes(action)
    }, [actions])

    return <div styleName="actions">
        {
            hasAction('add') ? <Add id={id} type={PLAY_TYPE.SINGLE.TYPE}>
                <a href={null} styleName="icon add">{ACTION_TYPES.add}</a>
            </Add> : null
        }
        {
            hasAction('favorite')
                ? <AddToPlaylist songIds={[id]}>
                    <a href={null} styleName="icon favorite">{ACTION_TYPES.favorite}</a>
                </AddToPlaylist>
                : null
        }
        {
            hasAction('share') ? <a href={null} styleName="icon share">{ACTION_TYPES.share}</a> : null
        }
        {
            hasAction('download') ? <a href={null} styleName="icon download">{ACTION_TYPES.download}</a> : null
        }
        {
            hasAction('delete') && isSelf ? <a href={null} styleName="icon delete">{ACTION_TYPES.delete}</a> : null
        }
    </div>
}

SongActions.propTypes = {
    id: PropTypes.number.isRequired,
    actions: PropTypes.arrayOf(function (propValue, key, componentName, location, propFullName) {
        if (!actions.includes(propValue[key])) {
            return new Error(
                'Invalid prop `' + propFullName + '` supplied to' +
                ' `' + componentName + '`. Validation failed.'
            )
        }
    }),
    isSelf: PropTypes.bool,
}

export default SongActions
