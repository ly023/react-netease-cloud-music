import {useEffect, useState, useMemo} from 'react'
import Page from 'components/Page'
import MyMusicSidebar from 'components/MyMusicSidebar'
import PlaylistDetail from 'components/PlaylistDetail'
import authDecorator from 'hoc/auth'
import {requestLoginStatus} from 'services/user'
import useWindowSize from 'utils/useWindowSize'
import {getCsrfToken} from 'utils'
import LoginTip from './components/LoginTip'

import './index.scss'

function MyPlaylist(props) {
    const playlistId = Number(props.match?.params?.id)

    const {contentHeight} = useWindowSize()

    const [loading, setLoading] = useState(false)
    const [showLogin, setShowLogin] = useState(false)

    const style = useMemo(() => ({height: contentHeight}), [contentHeight])

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
        if(loading) {
            return null
        }
        if(showLogin) {
            return <LoginTip/>
        }
        return <div>
            <div styleName="sidebar">
                <MyMusicSidebar style={style} playlistId={playlistId}/>
            </div>
            <div styleName="content">
                <PlaylistDetail id={playlistId}/>
            </div>
        </div>
    }, [loading, showLogin, style, playlistId])

    return <Page title="我的音乐" showFooter={showLogin}>
        <div style={style} styleName="wrapper">
            {renderContent}
        </div>
    </Page>
}

export default authDecorator()(MyPlaylist)
