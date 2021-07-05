import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import configureStore from 'store/configureStore'
import rootSaga from 'sagas'
import App from './App'

const store = configureStore()
store.runSaga(rootSaga)

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>, document.getElementById('root')
)

