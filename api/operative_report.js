import express from 'express';
import bcrypt from 'bcrypt';
import Promise from 'bluebird';
import isEmpty from 'lodash.isempty';
import jsonWT from 'jsonwebtoken';
import config from './config';

import authenticate from './shared/authenticate';

import commonValidations from './shared/validations';
import Stations from '../models/stations';
import Sensors from '../models/sensors';
import Data from '../models/data';

import User from '../models/user';
import Meteo from '../models/meteo';
import MeteoStations from '../models/meteostations';
import url from 'url';
import qs from 'querystring';

import officegen from 'officegen';
import fs from 'fs';
import path from 'path';
import mime from 'mime';

import carbone from 'carbone';


let router = express.Router();




router.get('/', authenticate, (req, resp) => {
    //  

    let query = url.parse(req.url).query;
    let obj = qs.parse(query);
    let data = JSON.parse(obj.data);
    //  if (query) {
    //    obj = JSON.parse(decodeURIComponent(query))
    //}
    //const between_date = [data.period_from, data.period_to];
    // const between_date = ['2018-05-21 00:00:00', '2018-05-21 19:05:00']
    // console.log('sensors ', data.sensors[0]);
    //if (data.report == 'operative') {
    //console.log(data.html);
    if (data.report == 'operative') {
        var filename = 'OperativeReport_station_' + data.station + '_' + data.date + '.docx';
        var filereport = 'operative_templ.docx' 
    };

    if (data.report == 'daily') {
        var filename = 'DailyReport_station_' + data.station + '_' + data.date + '.docx';
        var filereport = 'daily_templ.docx'
    };
    var filepath = './reports/';

    var table = [
        [{
            val: "Станция: " + data.station,
            opts: {
                cellColWidth: 2900,
                b: false,
                sz: '14',
                align: "left"

            }
        },

        {
            val: data.date,
            opts: {
                cellColWidth: 2900,
                b: false,
                sz: '14',
                align: "right"

            }
        }
        ]
        , [{
            val: "Параметры загрязнения",
            opts: {
                cellColWidth: 5800,
                b: true,
                sz: '16',

            }
        }],
        [{
            val: "№",
            opts: {
                cellColWidth: 600,
                b: false,
                sz: '16',

            }
        },
        {
            val: "Наименование",
            opts: {
                cellColWidth: 600,
                b: false,
                sz: '16',

            }
        },
        {
            val: "ПДКмр, мг/м.куб.	",
            opts: {
                cellColWidth: 1000,
                b: false,
                sz: '16',

            }
        },

        {
            val: "Разовая концентрация (средняя за 20 мин), мг/м.куб.",
            opts: {
                cellColWidth: 2900,
                b: false,
                sz: '16',

            }
        }
        ],



    ]

    var tableStyle = {
        tableColWidth: 5800,
        tableSize: 24,
        tableAlign: "center",
        tableFontFamily: "Times New Roman",
        boders: true,
        fill: "FFFFFF"

    }

    var jsontbl = [{
        type: "table",
        val: table,
        opt: tableStyle
    }
    ]

    // Data to inject
    var data2 = [{
        station: 'OPTEC_M',

        values: [{
            date: '25-06-2018 21:06:56',
            pollution: [{
                num: '1',
                chemical: 'O3, мг/м.куб.',
                macs: '0.16',
                date: '24-06-2018',
                time: '17:45:00',
                value: '0.00195223'
            },
            {
                num: '2',
                chemical: 'CO, мг/м.куб.',
                macs: '5',
                date: '24-06-2018',
                time: '17:45:00',
                value: '0.23'
            }],
            P: '764',
            Tout: '27',
            Hout: '93',
            WindV: '0.75',
            WindD: '145',
            Rain: '0',
            Hin: '27',
            Ts1: '23',
            Ts2: '23',
            Ts3: '23.2',
            Tin: '23.6',
            U: '232.2',
            Dr: 'нет',
            Fr: 'нет'
        }],



    }];

    /*
    { P: '764' },
    { Tout: '27' },
    { Hout: '93' },
    { WindV: '0.75' },
    { WindD: '145' },
    { Rain: '0' },
    { Hin: '27' },
    { Ts1: '23' },
    { Ts2: '23' },
    { Ts3: '23.2' },
    { Tin: '23.6' },
    { U: '232.2' },
    { Dr: 'нет' },
    { Fr: 'нет' }
    ];*/



    // console.log('this is HEAD\n');
    /* officegen.setVerboseMode(true);
 
     var docx = officegen({
         type: 'docx',
         orientation: 'landscape',
         pageMargins: { top: 1000, left: 1000, bottom: 1000, right: 1000 }
         // The theme support is NOT working yet...
         // themeXml: themeXml
     });
     docx.createTable(table, tableStyle);*/
    // docx.createP();
    // docx.createByJson(jsontbl);
    //console.log('resp is = ', docx.data);
    // var ws = fs.createWriteStream(path.resolve(filepath + filename));
    resp.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    resp.setHeader('Content-disposition', 'attachment; filename=' + filename);

    carbone.render(path.resolve(filepath + filereport), data.data_4_report, function (err, result) {
        if (err) {
            return console.log(err);
        }
        // write the result

        // write the result
        resp.send(result);

    });

    /*  docx.generate(resp, {
          'finalize': function () {
              console.log('Finish to create a Docx file.\n');
          },
          'error': function (err) {
              console.log(err);
          }
      }
  
  
      );*/


    //  ws.close;

    //var filestream = fs.createReadStream(path.resolve(filepath + filename));
    // console.log();
    // filestream.pipe(resp);
    // filestream.close;
    //ws = createReadStream(path.resolve(filepath + filename));
    //resp.attachment(path.resolve(filepath + filename));
    //resp.download(path.resolve(filepath + filename));
    //resp.download(filepath + filename);
    /*resp.sendFile(path.resolve(filepath + filename), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Sent:', filename);
        }
    });*/


    //let response = ['Ok'];
    //resp.json({ response });
    //}




})

export default router;