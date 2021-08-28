import {useEffect, useState, useMemo} from 'react'
import {useHistory} from 'react-router-dom'
import Page from 'components/Page'
import MyMusicSidebar from 'components/MyMusicSidebar'
import PlaylistDetail from 'components/PlaylistDetail'
import authDecorator from 'hoc/auth'
import {requestLoginStatus} from 'services/user'
import useWindowSize from 'utils/useWindowSize'
import {getCsrfToken} from 'utils'

import './index.scss'

function MyPlaylist(props) {
    const history = useHistory()
    const playlistId = Number(props.match?.params?.id)

    const {contentHeight} = useWindowSize()

    const [loading, setLoading] = useState(false)

    const style = useMemo(() => ({height: contentHeight}), [contentHeight])

    useEffect(() => {
        const csrfToken = getCsrfToken()
        if (csrfToken) {
            setLoading(true)
            requestLoginStatus()
                .then((res) => {
                    const data = res?.data
                    if (!data?.profile) {
                        history.push('/401')
                    }
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            history.push('/401')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <Page title="我的音乐" showFooter={false}>
        <div style={style} styleName="wrapper">
            {
                loading ? null :  <div>
                    <div styleName="sidebar">
                        <MyMusicSidebar style={style} playlistId={playlistId}/>
                    </div>
                    <div styleName="content">
                        <PlaylistDetail id={playlistId}/>
                    </div>
                </div>
            }
        </div>
    </Page>
}

export default authDecorator()(MyPlaylist)
