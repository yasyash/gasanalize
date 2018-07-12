import Axios from "axios";
import format from 'node.date-time';

import shortid from 'shortid';
import isEmpty from 'lodash.isempty';
import FileDownload from 'js-file-download';

function wrapData(data_in) {
    const data = data_in.map(item => {
        const _id = shortid.generate();


        Object.assign(item, { _id: _id });
        return item;
    });
    return data;
}


export function getFtp() {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.get('/api/admin/ftp_get')
            .then(resp => {
                let list = [];
                let data = resp.data.ftplist;

                data.forEach(element => {
                    list.push({
                        address: element.address,
                        username: element.username,
                        pwd: element.pwd,
                        periods: element.periods,
                        date_time: new Date(element.date_time).format('dd-MM-Y HH:mm:SS'),
                        idd: element.id
                    })

                });


                return wrapData(list);
            })
    };
};

export function updateFtp(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/ftp_update', ...paramstr)
            .then(resp => resp)
    };
};

export function deleteFtp(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/ftp_del', { id: paramstr })
            .then(resp => resp)
    };
};

export function insertFtp(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/ftp_insert', paramstr)
            .then(resp => resp)
    };
};