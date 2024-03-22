import { useEffect, useState, useMemo } from 'react'
import Page from 'components/Page'
import PlaylistDetail from 'components/business/PlaylistDetail'
import authDecorator from 'hoc/auth'
import { requestLoginStatus } from 'services/user'
import useWindowSize from 'hook/useWindowSize'
import { getCsrfToken } from 'utils'
import LoginTip from './components/LoginTip'
import MyMusicSidebar from './components/MyMusicSidebar'

import styles from './index.scss'

function MyPlaylist(props) {
  const playlistId = Number(props?.params?.id)

  const { contentHeight } = useWindowSize()

  const [loading, setLoading] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const style = useMemo(() => ({ height: contentHeight }), [contentHeight])

  useEffect(() => {
    const csrfToken = getCsrfToken()
    if (csrfToken) {
      setLoading(true)
      requestLoginStatus()
        .then((res) => {
          const data = res?.data
          if (!data?.profile) {
            setShowLogin(true)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setShowLogin(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderContent = useMemo(() => {
    if (loading) {
      return null
    }
    if (showLogin) {
      return <LoginTip />
    }
    return (
      <div>
        <div className={styles.sidebar}>
          <MyMusicSidebar style={style} playlistId={playlistId} />
        </div>
        <div className={styles.content}>
          <PlaylistDetail id={playlistId} />
        </div>
      </div>
    )
  }, [loading, showLogin, style, playlistId])

  return (
    <Page title="我的音乐" showFooter={showLogin}>
      <div style={style} className={styles.wrapper}>
        {renderContent}
      </div>
    </Page>
  )
}

export default authDecorator()(MyPlaylist)
