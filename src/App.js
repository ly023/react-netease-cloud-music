import React from 'react'
import {connect} from 'react-redux'
import {BrowserRouter} from 'react-router-dom'
import {hot} from 'react-hot-loader/root'
import {setConfig} from 'react-hot-loader'
import NavBar from 'components/NavBar'
import SubContent from 'components/SubContent'
// import PlayBar from 'components/PlayBar'
import {getCsrfToken} from 'utils'
import {requestLoginStatus} from 'actions/user'

@connect(({user}) => ({
    user,
}))
class App extends React.Component {

    componentDidMount() {
        const csrfToken = getCsrfToken()
        if(csrfToken) {
            this.props.dispatch(requestLoginStatus())
        }
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <NavBar/>
                    <SubContent/>
                    {/*<PlayBar/>*/}
                </div>
            </BrowserRouter>
        )
    }
}

setConfig({
    logLevel: 'debug',
})

export default hot(App)
