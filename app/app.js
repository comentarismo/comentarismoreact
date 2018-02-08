var runtime = require('offline-plugin/runtime')
runtime.install({
    onUpdating: () => {
        console.log('*&*&*& Comentarismo SW Event:', 'onUpdating')
    },
    onUpdateReady: () => {
        console.log('*&*&*& Comentarismo SW Event:', 'onUpdateReady')
        // Tells to new SW to take control immediately
        runtime.applyUpdate()
    },
    onUpdated: () => {
        console.log('*&*&*& Comentarismo SW Event:', 'onUpdated')
        // Reload the webpage to load into the new version
        window.location.reload()
    },
    
    onUpdateFailed: () => {
        console.log('*&*&*& Comentarismo SW Event:', 'onUpdateFailed')
    },
})

import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'

import configureStore from 'store/configureStore'
import createRoutes from 'routes/index'
import { Provider } from 'react-redux'

import { syncHistoryWithStore } from 'react-router-redux'

function startState () {
    const preloadedState = window.__INITIAL_APP_STATE__
    if (!preloadedState) {
        console.log('*&*&*& ERROR: REACT FAILED TO HYDRATE STATE!! ',
            window.__INITIAL_APP_STATE__)
    }
    
    const store = configureStore(browserHistory, preloadedState)
    
    const history = syncHistoryWithStore(browserHistory, store, {
        selectLocationState: () => (state => state.routing),
    })
    
    ReactDOM.hydrate(
        <Provider store={store} key="provider">
            {createRoutes(history)}
        </Provider>,
        document.getElementById('root'),
    )
    
    delete window.__INITIAL_APP_STATE__
    
    if (process.env.NODE_ENV !== 'production') {
        window.React = React // enable debugger
        
    }
    
}

var raf = requestAnimationFrame || mozRequestAnimationFrame ||
    webkitRequestAnimationFrame || msRequestAnimationFrame
if (raf && !window.__INITIAL_APP_STATE__) {
    raf(function () { window.setTimeout(startState, 0) })
} else {
    window.addEventListener('load', startState)
}

