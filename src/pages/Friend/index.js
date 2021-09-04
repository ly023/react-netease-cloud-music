import {useEffect, useState, useMemo} from 'react'
import Page from 'components/Page'
import authDecorator from 'hoc/auth'
import {requestLoginStatus} from 'services/user'
import {getCsrfToken} from 'utils'
import LoginTip from './components/LoginTip'

function Friend() {
    const [loading, setLoading] = useState(false)
    const [showLogin, setShowLogin] = useState(false)

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
        return <div className="main">
            Friend
        </div>
    }, [loading, showLogin])

    return <Page showFooter>
        {renderContent}
    </Page>
}

export default authDecorator()(Friend)
