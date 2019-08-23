import React from 'react'

export default loadComponent => (
    class AsyncComponent extends React.Component {
        state = {
            component: null
        }

        async componentDidMount() {
            if (this.state.component !== null) return
            try {
                const {default: component} = await loadComponent()
                this.setState({component})
            } catch (err) {
                console.error(`Cannot load component in <AsyncComponent />`)
                throw err
            }
        }

        render() {
            const {component: Component} = this.state
            return (Component) ? <Component {...this.props} /> : null
        }
    }
)
