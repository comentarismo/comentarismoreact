var runtime = require('offline-plugin/runtime');
runtime.install({
  onUpdating: () => {
    console.log('*&*&*& Comentarismo SW Event:', 'onUpdating');
  },
  onUpdateReady: () => {
    console.log('*&*&*& Comentarismo SW Event:', 'onUpdateReady');
    // Tells to new SW to take control immediately
    runtime.applyUpdate();
  },
  onUpdated: () => {
    console.log('*&*&*& Comentarismo SW Event:', 'onUpdated');
    // Reload the webpage to load into the new version
    window.location.reload();
  },

  onUpdateFailed: () => {
    console.log('*&*&*& Comentarismo SW Event:', 'onUpdateFailed');
  }
});

import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'

import configureStore from 'store/configureStore'
import createRoutes from 'routes/index'
import { Provider } from 'react-redux'

const preloadedState = window.__INITIAL_APP_STATE__
if (!preloadedState) {
    console.log('*&*&*& ERROR: REACT FAILED TO HYDRATE STATE!! ', window.__INITIAL_APP_STATE__)
}
delete window.__INITIAL_APP_STATE__

const store = configureStore(preloadedState)

ReactDOM.hydrate(
    <Provider store={store}>
        {createRoutes(browserHistory)}
    </Provider>,
 document.getElementById('root')
)
