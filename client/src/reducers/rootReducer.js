import { combineReducers, applyMiddleware } from 'redux';
import flashMessages from './flashMessages';

import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore } from 'redux';
import thunk from 'redux-thunk';
import auth from './auth';

import dataList from './dataList';

import sensorsList from './sensorsList';

import meteoList from './meteoList';

export default createStore(
    combineReducers({meteoList,
        dataList, sensorsList, flashMessages, auth
    }),
    composeWithDevTools(applyMiddleware(thunk))
);

