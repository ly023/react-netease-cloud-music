import ReactDOMClient from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import configureStore from 'store/configureStore'
import rootSaga from 'sagas'
import ErrorBoundary from 'components/ErrorBoundary'
import App from './App'

const store = configureStore()
store.runSaga(rootSaga)

const container = document.getElementById('root')

// Create a root.
const root = ReactDOMClient.createRoot(container)

// Initial render: Render an element to the root.
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <ErrorBoundary>
              <App/>
            </ErrorBoundary>
        </BrowserRouter>
    </Provider>
)

