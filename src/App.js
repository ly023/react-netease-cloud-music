import React from 'react'
import {hot} from 'react-hot-loader/root'
import {setConfig} from 'react-hot-loader'
import {connect} from 'react-redux'
import NavBar from 'components/NavBar'
import SubContent from 'components/SubContent'
import PlayBar from 'components/PlayBar'
import {getCsrfToken} from 'utils'
import {requestLoginStatus} from 'actions/user'

@connect()
class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            subContentHeight: 0
        }
        this.resizeTimer = 0
        this.navBarRef = React.createRef()
    }

    componentDidMount() {
        const csrfToken = getCsrfToken()
        if (csrfToken) {
            this.props.dispatch(requestLoginStatus())
        }
        this.setSubContentHeight()
        window.addEventListener('resize', this.resize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
        window.clearTimeout(this.resizeTimer)
    }

    setSubContentHeight = () => {
        const navBar = this.navBarRef.current
        const documentClientHeight = document.documentElement.clientHeight
        const subContentHeight = navBar ? documentClientHeight - navBar.clientHeight : documentClientHeight
        this.setState({
            subContentHeight
        })
    }

    resize = () => {
        if (this.resizeTimer) {
            window.clearTimeout(this.resizeTimer)
        }
        this.resizeTimer = window.setTimeout(this.setSubContentHeight, 100)
    }

    render() {
        const {subContentHeight} = this.state

        return (
            <>
                <NavBar ref={this.navBarRef}/>
                <SubContent height={subContentHeight}/>
                <PlayBar/>
            </>
        )
    }
}

setConfig({
    logLevel: 'debug',
})

export default hot(App)
