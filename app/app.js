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
    let preloadedState = window.__INITIAL_APP_STATE__
    if (!preloadedState) {
        console.log('*&*&*& ERROR: REACT FAILED TO HYDRATE STATE!! ',
            window.__INITIAL_APP_STATE__)
        console.log(
            '*&*&*& ERROR: REACT FALLBACK HYDRATE STATE on localStorage!! ')
        
        preloadedState = localStorage.getItem('__INITIAL_APP_STATE__' +
            window.location.href)
        if (!preloadedState) {
            console.log(
                '*&*&*& ERROR: REACT FAILED TO HYDRATE STATE from localStorage !! ')
        }
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

const intervalId = window.setInterval(() => {
    const preloadedState = localStorage.getItem('__INITIAL_APP_STATE__' +
            window.location.href)
    
    if (window.__INITIAL_APP_STATE__ || preloadedState){
        try {
            startState();
        } catch (e){
            console.log("*&*&*& ERROR: REACT FAILED TO HYDRATE STATE,  will retry, ",e);
        } finally {
            console.log("*&*&*& INFO: REACT HYDRATED STATE ?", !(window.__INITIAL_APP_STATE__));
            // Clear the intervalId
            window.clearInterval(intervalId);
        }
    }else {
        console.log("*&*&*& ERROR: REACT FAILED TO HYDRATE STATE, will retry, ");
    }
}, 10);