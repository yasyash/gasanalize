import express from 'express';
import bcrypt from 'bcrypt';
import Promise from 'bluebird';
import isEmpty from 'lodash.isempty';
import jsonWT from 'jsonwebtoken';
import config from './config';
import format from 'node.date-time';
import authenticate from './shared/authenticate';



import url from 'url';
import qs from 'querystring';


import FTP from '../models/ftp';
import SOAP from '../models/soap';
import USERS from '../models/user';

let router = express.Router();




router.get('/ftp_get', authenticate, (req, resp) => {
    //  

    // let query = url.parse(req.url).query;
    //let obj = qs.parse(query);
    //let data = JSON.parse(obj.data);

    FTP.where({ isdeleted: false }).fetchAll().then(ftplist => {
        resp.json({ ftplist });
    }).catch(err => resp.status(500).json({ error: err }));
    // write the result

});


router.post('/ftp_update', authenticate, (req, resp) => {
    //  

    // let query = url.parse(req.url).query;
    // let obj = qs.parse(query);
    //let data = JSON.parse(obj.data);
    let data = req.body;
    //console.log(data.address);

    //   console.log(req.body);

    FTP.where({ id: data.idd })
        .save({
            address: data.address,
            username: data.username,
            pwd: data.pwd,
            periods: data.periods,
            date_time: new Date().format('Y-MM-dd HH:mm:SS')
        }, { patch: true })
        .then(result => {
            resp.json({ result });
        }).catch(err => resp.status(500).json({ error: err }));
    // write the result

})

router.post('/ftp_del', authenticate, (req, resp) => {
    //  

    // let query = url.parse(req.url).query;
    // let obj = qs.parse(query);
    //let data = JSON.parse(obj.data);
    let data = req.body;
    //console.log(data.idd);

    //  console.log(req.body);

    FTP.where({ id: data.id })
        .save({
            isdeleted: true
        }, { patch: true })
        .then(result => {
            resp.json({ result });
        }).catch(err => resp.status(500).json({ error: err }));
    // write the result

})

router.post('/ftp_insert', authenticate, (req, resp) => {
    //  

    // let query = url.parse(req.url).query;
    // let obj = qs.parse(query);
    //let data = JSON.parse(obj.data);
    let data = req.body;
    //console.log(data.address);

    //  console.log(req.body);

    FTP.query('where', 'id', '>', '0').orderBy('id', 'DESC').fetchAll()
        .then(result => {
            var result_parse0 = JSON.stringify(result);
            var arr = JSON.parse(result_parse0);
            console.log(String(Number(arr[0].id) + 1))
            let id = String(Number(arr[0].id) + 1);
            let address = data.address;
            let username = data.username;
            let pwd = data.pwd;
            let periods = data.periods;
            let date_time = new Date().format('Y-MM-dd HH:mm:SS');
            let isdeleted = false;
            //let id = Number(arr[0].idd) + 1;
            //   console.log({ "idd": idd, "address": address, "username": username, "pwd": pwd, "periods": periods, "date_time": date_time, "isdeleted": false })
            FTP.forge({ id }).save({
                address, username, pwd, periods, date_time, isdeleted

            }, { method: 'insert' })
                .then(result => resp.json({ success: true }))
                .catch(err => resp.status(500).json({ error: err }));


            //      console.log(arr[0].idd);



        }).catch(err => resp.status(500).json({ error: err }));
    // write the result

})

/// SOAP  API

router.get('/soap_get', authenticate, (req, resp) => {
    //  

    // let query = url.parse(req.url).query;
    //let obj = qs.parse(query);
    //let data = JSON.parse(obj.data);

    SOAP.where({ isdeleted: false }).fetchAll().then(ftplist => {
        resp.json({ ftplist });
    }).catch(err => resp.status(500).json({ error: err }));
    // write the result

});


router.post('/soap_update', authenticate, (req, resp) => {
    //  

    // let query = url.parse(req.url).query;
    // let obj = qs.parse(query);
    //let data = JSON.parse(obj.data);
    let data = req.body;
    //console.log(data.address);

    //   console.log(req.body);

    SOAP.where({ id: data.idd })
        .save({
            address: data.address,
            username: data.username,
            pwd: data.pwd,
            periods: data.periods,
            date_time: new Date().format('Y-MM-dd HH:mm:SS')
        }, { patch: true })
        .then(result => {
            resp.json({ result });
        }).catch(err => resp.status(500).json({ error: err }));
    // write the result

})

router.post('/soap_del', authenticate, (req, resp) => {
    //  

    // let query = url.parse(req.url).query;
    // let obj = qs.parse(query);
    //let data = JSON.parse(obj.data);
    let data = req.body;
    //console.log(data.idd);

    //  console.log(req.body);

    SOAP.where({ id: data.id })
        .save({
            isdeleted: true
        }, { patch: true })
        .then(result => {
            resp.json({ result });
        }).catch(err => resp.status(500).json({ error: err }));
    // write the result

})

router.post('/soap_insert', authenticate, (req, resp) => {
    //  

    // let query = url.parse(req.url).query;
    // let obj = qs.parse(query);
    //let data = JSON.parse(obj.data);
    let data = req.body;
    //console.log(data.address);

    //  console.log(req.body);

    SOAP.query('where', 'id', '>', '0').orderBy('id', 'DESC').fetchAll()
        .then(result => {
            var result_parse0 = JSON.stringify(result);
            var arr = JSON.parse(result_parse0);
            console.log(String(Number(arr[0].id) + 1))
            let id = String(Number(arr[0].id) + 1);
            let address = data.address;
            let username = data.username;
            let pwd = data.pwd;
            let periods = data.periods;
            let date_time = new Date().format('Y-MM-dd HH:mm:SS');
            let isdeleted = false;
            //let id = Number(arr[0].idd) + 1;
            //   console.log({ "idd": idd, "address": address, "username": username, "pwd": pwd, "periods": periods, "date_time": date_time, "isdeleted": false })
            SOAP.forge({ id }).save({
                address, username, pwd, periods, date_time, isdeleted

            }, { method: 'insert' })
                .then(result => resp.json({ success: true }))
                .catch(err => resp.status(500).json({ error: err }));


            //      console.log(arr[0].idd);



        }).catch(err => resp.status(500).json({ error: err }));
    // write the result

})

/// User's  API

router.get('/user_get', authenticate, (req, resp) => {
    //  

    // let query = url.parse(req.url).query;
    //let obj = qs.parse(query);
    //let data = JSON.parse(obj.data);

    USERS.fetchAll().then(userlist => {
        resp.json({ userlist });
    }).catch(err => resp.status(500).json({ error: err }));
    // write the result

});


router.post('/user_update', authenticate, (req, resp) => {
    //  

    // let query = url.parse(req.url).query;
    // let obj = qs.parse(query);
    //let data = JSON.parse(obj.data);
    let data = req.body;
    //console.log(data.address);

    //   console.log(req.body);

    USERS.where({ id: data.idd })
        .save({
            username: data.username,
            email: data.email,
            mobile: data.mobile,
            updated_at: new Date().format('Y-MM-dd HH:mm:SS'),
          //  is_active: data.is_active,
           // is_admin: data.is_admin,
        }, { patch: true })
        .then(result => {
            resp.json({ result });
        }).catch(err => resp.status(500).json({ error: err }));
    // write the result

})

router.post('/user_security_update', authenticate, (req, resp) => {
    //  

    // let query = url.parse(req.url).query;
    // let obj = qs.parse(query);
    //let data = JSON.parse(obj.data);
    let data = req.body;
    //console.log(data.address);

    //   console.log(req.body);

    USERS.where({ id: data.idd })
        .save({
          
           is_active: data.is_active,
            is_admin: data.is_admin,
        }, { patch: true })
        .then(result => {
            resp.json({ result });
        }).catch(err => resp.status(500).json({ error: err }));
    // write the result

})
router.post('/user_del', authenticate, (req, resp) => {
    //  

    // let query = url.parse(req.url).query;
    // let obj = qs.parse(query);
    //let data = JSON.parse(obj.data);
    let data = req.body;
    //console.log(data.idd);

    //  console.log(req.body);

    USERS.where({ id: data.id })
        .save({
            is_active: false
        }, { patch: true })
        .then(result => {
            resp.json({ result });
        }).catch(err => resp.status(500).json({ error: err }));
    // write the result

})

router.post('/user_insert', authenticate, (req, resp) => {
    //  

    // let query = url.parse(req.url).query;
    // let obj = qs.parse(query);
    //let data = JSON.parse(obj.data);
    let data = req.body;
    //console.log(data.address);

    //  console.log(req.body);

    USERS.query('where', 'id', '>', '0').orderBy('id', 'DESC').fetchAll()
        .then(result => {
            var result_parse0 = JSON.stringify(result);
            var arr = JSON.parse(result_parse0);
            console.log(String(Number(arr[0].id) + 1))
            let id = String(Number(arr[0].id) + 1);
            let address = data.address;
            let username = data.username;
            let pwd = data.pwd;
            let periods = data.periods;
            let date_time = new Date().format('Y-MM-dd HH:mm:SS');
            let isdeleted = false;
            //let id = Number(arr[0].idd) + 1;
            //   console.log({ "idd": idd, "address": address, "username": username, "pwd": pwd, "periods": periods, "date_time": date_time, "isdeleted": false })
            USERS.forge({ id }).save({
                address, username, pwd, periods, date_time, isdeleted

            }, { method: 'insert' })
                .then(result => resp.json({ success: true }))
                .catch(err => resp.status(500).json({ error: err }));


            //      console.log(arr[0].idd);



        }).catch(err => resp.status(500).json({ error: err }));
    // write the result

})
export default router;



