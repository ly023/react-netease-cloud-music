import PropTypes from 'prop-types'
import AddIcon from '@mui/icons-material/Add'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import ShareIcon from '@mui/icons-material/Share'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import DeleteIcon from '@mui/icons-material/Delete'
import { PLAY_TYPE } from 'constants/music'
import Add from 'components/business/Add'
import AddToPlaylist from 'components/business/AddToPlaylist'

import styles from './index.scss'

const ACTION_TYPES = {
  add: '添加到播放列表',
  favorite: '收藏',
  share: '分享',
  download: '下载',
  delete: '删除'
}

const defaultActions = Object.keys(ACTION_TYPES)

function SongActions(props) {
  const { id, actions = defaultActions, isSelf = false } = props

  const hasAction = (action) => {
    return actions.includes(action)
  }

  return (
    <div className={styles.actions}>
      {hasAction('add') ? (
        <Add id={id} type={PLAY_TYPE.SINGLE.TYPE}>
          <a href={null} className={styles['icon-box']}>
            <AddIcon className={styles.icon} />
            <span>{ACTION_TYPES.add}</span>
          </a>
        </Add>
      ) : null}
      {hasAction('favorite') ? (
        <AddToPlaylist songIds={[id]}>
          <a href={null} className={styles['icon-box']}>
            <LibraryAddIcon className={styles.icon} />
            <span>{ACTION_TYPES.favorite}</span>
          </a>
        </AddToPlaylist>
      ) : null}
      {hasAction('share') ? (
        <a href={null} className={styles['icon-box']}>
          <ShareIcon className={styles.icon} />
          <span>{ACTION_TYPES.share}</span>
        </a>
      ) : null}
      {hasAction('download') ? (
        <a href={null} className={styles['icon-box']}>
          <CloudDownloadIcon className={styles.icon} />
          <span>{ACTION_TYPES.download}</span>
        </a>
      ) : null}
      {hasAction('delete') && isSelf ? (
        <a href={null} className={styles['icon-box']}>
          <DeleteIcon className={styles.icon} />
          <span>{ACTION_TYPES.delete}</span>
        </a>
      ) : null}
    </div>
  )
}

SongActions.propTypes = {
  id: PropTypes.number.isRequired,
  actions: PropTypes.array,
  isSelf: PropTypes.bool
}

export default SongActions
