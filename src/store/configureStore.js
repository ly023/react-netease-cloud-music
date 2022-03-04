import {applyMiddleware, createStore} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {composeWithDevTools} from '@redux-devtools/extension'
// import logger from 'redux-logger'
import AppReducer from 'reducers'

// applyMiddleware: Redux提供的方法，将所有中间件组成一个数组，依次执行

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

const middlewares = [sagaMiddleware]

if (process.env.NODE_ENV === 'development') {
    // applyMiddleware logger就一定要放在最后，否则输出结果会不正确
    // middlewares.push(logger)
}

export default function configureStore() {
    const composeEnhancers = composeWithDevTools({
        // Specify name here, actionsDenylist, actionsCreators and other options if needed
    })

    const store = createStore(
        AppReducer,
        // 忽略preloadedState
        // mount it on the Store
        composeEnhancers(
            applyMiddleware(...middlewares)
        ))

    return {
        ...store,
        runSaga: sagaMiddleware.run
    }
}
