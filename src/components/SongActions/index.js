import React from 'react'
import PropTypes from 'prop-types'
import {PLAY_TYPE} from 'constants/play'
import Add from 'components/Add'

import './index.scss'

const ACTION_TYPES = {
    add: '添加到播放列表',
    favorite: '收藏',
    share: '分享',
    download: '下载',
    delete: '删除',
}

const actions = Object.keys(ACTION_TYPES)

function SongActions(props) {
    const {id, isSelf} = props

    const hasAction = (action) => {
        return props.actions.includes(action)
    }

    return <div styleName="actions">
        {
            hasAction('add') ? <Add id={id} type={PLAY_TYPE.SINGLE.TYPE}>
                <a href={null} styleName="icon add">{ACTION_TYPES.add}</a>
            </Add> : null
        }
        {
            hasAction('favorite') ? <a href={null} styleName="icon favorite">{ACTION_TYPES.favorite}</a> : null
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

SongActions.defaultProps = {
    actions: actions,
    isSelf: false,
}

export default SongActions
