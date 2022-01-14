import {useEffect, useState, useRef} from 'react'
import {useHistory} from 'react-router-dom'
import authDecorator from 'hoc/auth'
import useShallowEqualSelector from 'utils/useShallowEqualSelector'
import {requestDetail as requestUserDetail} from 'services/user'
import {DEFAULT_DOCUMENT_TITLE} from 'constants'
import Page from 'components/Page'
import RankingList from 'components/business/ListenMusicRankingList'

function UserSongsRank(props) {
    const history = useHistory()

    const userId = props.match?.params?.id

    const {userInfo} = useShallowEqualSelector(({user}) => ({
        userInfo: user.userInfo,
    }))

    const [userDetail, setUserDetail] = useState(null)

    const isMounted = useRef(false)

    useEffect(() => {
        isMounted.current = true

        const fetchUserDetail = async () => {
            try {
                const res = await requestUserDetail({uid: userId})
                if (isMounted.current) {
                    if (res?.code === -2) {
                        history.push('/401')
                    } else {
                        if (res?.peopleCanSeeMyPlayRecord || (userInfo?.userId === Number(userId))) {
                            setUserDetail(res)
                        } else {
                            history.push('/404')
                        }
                        setUserDetail(res)
                    }
                }
            } catch (e) {
                const code = e?.responseJson?.code
                if (code === 404) {
                    history.push('/404')
                }
            }
        }

        if (userId) {
            fetchUserDetail()
        }

        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <Page title={DEFAULT_DOCUMENT_TITLE}>
        <div className="main">
            <div className="gutter">
                {userDetail ? <RankingList
                    userId={userId}
                    listenSongs={userDetail?.listenSongs}
                /> : null}
            </div>
        </div>
    </Page>
}

export default authDecorator()(UserSongsRank)
