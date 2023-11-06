import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import localStorage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import AppReducers from './reducers/AppReducers';


console.warn(" ARTAKA  ------ Start Registration firebase");
if ("serviceWorker" in navigator) {
  console.warn(" ARTAKA  ------ serviceWorker exists");
  navigator.serviceWorker
    .register("./firebase-messaging-sw.js")
    .then(function(registration) {
      console.log("Registration successful, scope is:", registration.scope);
    })
    .catch(function(err) {
      console.log("Service worker registration failed, error:", err);
    });
}

const persistConfig = {
    key: 'reducer',
    storage: localStorage,
    //whitelist: ['reducer'] // or blacklist to exclude specific reducers
};
const presistedReducer = persistReducer(persistConfig, AppReducers);

const store = createStore(presistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store)

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();



/*
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import localStorage from 'redux-persist/lib/storage'

import AppReducers from './reducers/AppReducers';

const store = createStore(AppReducers, applyMiddleware(thunk));

console.warn(" ARTAKA  ------ Start Registration firebase");
if ("serviceWorker" in navigator) {
  console.warn(" ARTAKA  ------ serviceWorker exists");
  navigator.serviceWorker
    .register("./firebase-messaging-sw.js")
    .then(function(registration) {
      console.log("Registration successful, scope is:", registration.scope);
    })
    .catch(function(err) {
      console.log("Service worker registration failed, error:", err);
    });
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);*/
