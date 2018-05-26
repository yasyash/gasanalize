import { combineReducers, applyMiddleware } from 'redux';
import flashMessages from './flashMessages';

import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore } from 'redux';
import thunk from 'redux-thunk';
import auth from './auth';

import dataList from './dataList';

import sensorsList from './sensorsList';

export default createStore(
    combineReducers({
        dataList, sensorsList, flashMessages, auth
    }),
    composeWithDevTools(applyMiddleware(thunk))
);

