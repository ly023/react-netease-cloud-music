import {Component} from 'react'

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    componentDidCatch(error, info) {
        console.log(error, info)
        this.setState({ hasError: true })
    }

    render() {
        if (this.state.hasError) {
            return (
                <div>
                   error
                </div>
            )
        }

        return this.props.children
    }
}
