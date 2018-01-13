import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'

import configureStore from 'store/configureStore'
import createRoutes from 'routes/index'
import { Provider } from 'react-redux'

let reduxState = window.__data
if (reduxState && typeof reduxState === 'string') {
    try {
        reduxState = JSON.parse(reduxState)
    } catch (e) {
        console.log('REACT FAILED TO HYDRATE STATE!! ', e)
    }
} else if (!reduxState) {
    console.log('REACT FAILED TO HYDRATE STATE!! ', window.__data)
}

const store = configureStore(reduxState)

ReactDOM.render((
    <Provider store={store}>
        {createRoutes(browserHistory)}
    </Provider>
), document.getElementById('root'))
