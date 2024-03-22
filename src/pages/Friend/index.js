import { useEffect, useState, useMemo, useRef } from 'react'
import Page from 'components/Page'
import authDecorator from 'hoc/auth'
import { requestLoginStatus } from 'services/user'
import { getCsrfToken } from 'utils'
import LoginTip from './components/LoginTip'

function Friend() {
  const [loading, setLoading] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true

    const csrfToken = getCsrfToken()
    if (csrfToken) {
      setLoading(true)
      requestLoginStatus()
        .then((res) => {
          const data = res?.data
          if (!data?.profile) {
            mounted.current && setShowLogin(true)
          }
        })
        .finally(() => {
          mounted.current && setLoading(false)
        })
    } else {
      setShowLogin(true)
    }

    return () => {
      mounted.current = false
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
    return <div className="main">Friend</div>
  }, [loading, showLogin])

  return <Page showFooter={!loading && !showLogin}>{renderContent}</Page>
}

export default authDecorator()(Friend)
