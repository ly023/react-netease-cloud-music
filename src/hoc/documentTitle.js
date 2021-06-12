import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Helmet, HelmetProvider} from 'react-helmet-async'

const documentTitleDecorator = (option = {}) => {

    return (WrappedComponent) => {

        @withRouter
        class DocumentTitleEnhance extends Component {
            static displayName = 'DocumentTitleEnhance'

            getPageTitle = () => {
                const {title, overrideTitle} = option
                if (typeof title === 'string') {
                    return title
                }
                if (typeof overrideTitle === 'function') {
                    return overrideTitle(this.props)
                }
            }

            render() {
                const title = this.getPageTitle()

                return (
                    <>
                        <HelmetProvider>
                            <Helmet>
                                <title>{title}</title>
                            </Helmet>
                        </HelmetProvider>
                        <WrappedComponent {...this.props}/>
                    </>
                )
            }
        }

        return DocumentTitleEnhance
    }
}

export default documentTitleDecorator
