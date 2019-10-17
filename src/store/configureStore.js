import {applyMiddleware, createStore} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly'
// import logger from 'redux-logger'
import AppReducer from 'reducers'

// applyMiddleware: Redux 的原生方法，将所有中间件组成一个数组，依次执行

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

const middlewares = [sagaMiddleware]

if (process.env.NODE_ENV === 'development') {
    // applyMiddleware logger就一定要放在最后，否则输出结果会不正确
    // middlewares.push(logger)
}

export default function configureStore() {

    return {
        ...createStore(
            AppReducer,
            // mount it on the Store
            composeWithDevTools(applyMiddleware(...middlewares))
        ),
        runSaga: sagaMiddleware.run
    }
}
