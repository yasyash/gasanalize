import { SET_METEO_LIST, DELETE_METEO_LIST } from './types'
import store from '../reducers/rootReducer';

export function addMeteoList(data) {
    store.dispatch({ type: SET_METEO_LIST, data });
}

export function deleteMeteoList() {
    store.dispatch({ type: DELETE_METEO_LIST });
}