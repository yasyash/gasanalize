import { SET_SENSORS_LIST, DELETE_SENSORS_LIST } from './types'
import store from '../reducers/rootReducer';

export function addSensorsList(data) {
    store.dispatch({ type: SET_SENSORS_LIST, data });
}

export function deleteSensorsList() {
    store.dispatch({ type: DELETE_SENSORS_LIST });
}