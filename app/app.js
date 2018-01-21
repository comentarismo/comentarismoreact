import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'

import configureStore from 'store/configureStore'
import createRoutes from 'routes/index'
import { Provider } from 'react-redux'

const preloadedState = window.__PRELOADED_STATE__
if (!preloadedState) {
    console.log('REACT FAILED TO HYDRATE STATE!! ', window.__PRELOADED_STATE__)
}
delete window.__PRELOADED_STATE__

const store = configureStore(preloadedState)

ReactDOM.render((
    <Provider store={store}>
        {createRoutes(browserHistory)}
    </Provider>
), document.getElementById('root'))
