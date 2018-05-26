import Axios from "axios";
import format from 'node.date-time';
import { addDataList, deleteDataList } from './dataAddActions';
import { addSensorsList, deleteSensorsList } from './sensorsAddAction';
import shortid from 'shortid';
import isEmpty from 'lodash.isempty';

function wrapData(data_in) {
    const data = data_in.map(item => {
        const _id = shortid.generate();


        Object.assign(item, { _id: _id });
        return item;
    });
    return data;
}

export function queryEvent(paramstr) {
    return dispatch => {
        const data = JSON.stringify(paramstr);
        //  console.log('parameters is ', data);

        return Axios.get('/api/query/', { params: { data } })
            .then(resp => resp.data)
            .then(data => {
                const dataTable = [];
                deleteDataList(); // add with id for table element
                deleteSensorsList();
                if (data.stations) {
                    let stations = data.stations;
                    stations.forEach(element => {
                        dataTable.push({
                            id: element.idd,
                            code: element.code,
                            namestation: element.namestation,
                            date_time_in: new Date(element.date_time_in).format('Y-MM-dd HH:mm:SS'),
                            date_time_out: new Date(element.date_time_out).format('Y-MM-dd HH:mm:SS')
                        });
                    });
                    return dataTable;
                };

                if (data.sensors) {
                    let sensors = data.sensors;
                    sensors.forEach(element => {
                        dataTable.push({
                            id: element.idd,
                            typemeasure: element.typemeasure,
                            serialnum: element.serialnum,
                            date_time_in: new Date(element.date_time_in).format('Y-MM-dd HH:mm:SS'),
                            date_time_out: new Date(element.date_time_out).format('Y-MM-dd HH:mm:SS'),
                            average_period: element.average_period,
                            unit_name: element.unit_name,
                            measure_class: element.measure_class,
                            is_wind_sensor: element.is_wind_sensor,
                            max_consentration: element.max_consentration,
                            max_day_consentration: element.max_day_consentration,
                            def_colour: element.def_colour

                        });
                    });
                    
                    return dataTable;
                };
                if (data.response) {
                    let data_list = data.response[0];
                    let sensors_list = data.response[1];
                    let unit_name = '';
                    let prev = '';
                    let i = 0;

                    if (sensors_list.length == 1) {

                        data_list.forEach(element => {
                            let filter = sensors_list.filter((item, i, arr) => {
                                return item.serialnum == element.serialnum;
                            });
                            if (!isEmpty(filter[0])) { unit_name = filter[0].unit_name }
                            dataTable.push({
                                id: element.idd,
                                typemeasure: element.typemeasure,
                                serialnum: element.serialnum,
                                date_time: new Date(element.date_time).format('Y-MM-dd HH:mm:SS'),
                                unit_name: unit_name,
                                measure: element.measure,
                                is_alert: element.is_alert ? 'тревога' : 'нет',
                            });

                        });
                    }

                    else {
                        let size_arr = sensors_list.length + 1;//datetime, sensor1, ..., sensorN
                        let obj = { date_time: 'Время наблюдения' };
                        //tmp_arr.push({});//table header - first element
                        sensors_list.forEach(_id => {
                            obj[_id.serialnum] = _id.typemeasure + ' (' + _id.unit_name + ')';
                        });

                        dataTable.push(obj); //insert first element


                        let tmp_arr = data_list;

                        while (tmp_arr.length > 0) {
                            let obj = {};
                            let one = tmp_arr[0];
                            let nex_arr = [];

                            tmp_arr.forEach(element => {

                                if (element.date_time !== one.date_time) {
                                    nex_arr.push(element);
                                }
                                else {
                                    obj['date_time'] = new Date(element.date_time).format('Y-MM-dd HH:mm:SS');
                                    obj[element.serialnum] = element.measure;
                                }




                            });
                            tmp_arr = nex_arr;
                            dataTable.push(obj);
                        }

                    };
                    addDataList(wrapData(dataTable)); // add with id for table element
                    addSensorsList(wrapData(sensors_list));

                    return dataTable;
                };

                return dataTable;

            });
    }
};
/* export function queryEvent(params) {
    return dispatch => {
        return Axios.get('/api/query', params).then(resp => {
            let stations = resp.stations;
            return stations;
        });


    }
}; */