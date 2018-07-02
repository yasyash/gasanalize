import express from 'express';
import bcrypt from 'bcrypt';
import Promise from 'bluebird';
import isEmpty from 'lodash.isempty';
import jsonWT from 'jsonwebtoken';
import config from './config';

import authenticate from './shared/authenticate';

import Sensors from '../models/sensors';
import Data from '../models/data';

import url from 'url';
import qs from 'querystring';

import officegen from 'officegen';
import fs from 'fs';
import path from 'path';
import mime from 'mime';
import date from 'date-and-time';

import carbone from 'carbone';


import Macs from '../models/macs';

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

    if (data.report == 'monthly') {
        var filename = 'MonthlyReport_station_' + data.station + '_' + data.date + '.docx';
        var filereport = 'monthly_templ.docx'
    };
    var filepath = './reports/';




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

function daysInMonth(month) {
    let days = 33 - new Date(new Date().getFullYear(), month, 33).getDate();
    return days;

};

async function loadData(station, between_date, station_name) {

    //consoleconsole.log('loadData');
    let data = await Promise.join(
        Data.query('whereBetween', 'date_time', between_date)
            .query('where', 'idd', station)
            .orderBy('date_time', 'ASC').fetchAll()
            .catch(err => resp.status(500).json({ error: err })),
        Sensors.query({
            select: ['serialnum', 'typemeasure', 'unit_name', 'is_wind_sensor'],
            where: ({ is_present: true }),
            andWhere: ({ idd: station }),
        })
            .fetchAll()
            .catch(err => resp.status(500).json({ error: err })),
        Macs.fetchAll()
            .catch(err => resp.status(500).json({ error: err })),
        ((data_list, data_sensors, consentration) => {
            let data = [data_list, data_sensors, consentration];
            return data;
        })
    )
        .catch(err => resp.status(500).json({ error: err }));
    return data;

};

router.get('/get', authenticate, (req, resp) => {
    //  

    let query = url.parse(req.url).query;
    let obj = qs.parse(query);
    let data = JSON.parse(obj.data);
    let station_name = data.station_name;

    const between_date = [data.period_from, data.period_to];
    //     console.log('data ', between_date);


    loadData(data.station, between_date, station_name).then(result => {

        let result_parse0 = JSON.stringify(result[0]);
        let arr0 = JSON.parse(result_parse0);
        let result_parse1 = JSON.stringify(result[1]);
        let arr1 = JSON.parse(result_parse1);
        let result_parse2 = JSON.stringify(result[2]);
        let arr2 = JSON.parse(result_parse2);

        const template_chemical = ['NO', 'NO2', 'SO2', 'H2S', 'O3', 'CO', 'PM2.5', 'PM10'];

        let dataList = arr0;
        let sensorsList = arr1;
        let macsList = arr2;
        let avrg_measure = [];
        let data_raw = [];
        let times = 0;
        let time_frame = [];
        var last_day = '';
        let period_from = between_date[0];

        if (new Date().getMonth() != new Date(period_from).getMonth()) {
            last_day = daysInMonth(new Date(period_from).getMonth());
        } else {
            last_day = new Date().getDate();
        }


        for (var ms = 1; ms < last_day + 1; ms++) {

            time_frame.push(date.format(new Date(new Date(period_from).getFullYear(), new Date(period_from).getMonth(), ms), 'DD-MM-YYYY'));
            // console.log('date ', date.format(new Date(new Date(period_from).getFullYear(), new Date(period_from).getMonth(), ms), 'DD-MM-YYYY'));

        }
        //  console.log('macs', macsList.length);
        macsList.forEach((element, indx) => {
            //    console.log('Macs list ', element);
            if ((element.chemical == 'NO') || (element.chemical == 'NO2') ||
                (element.chemical == 'SO2') || (element.chemical == 'H2S') ||
                (element.chemical == 'O3') || (element.chemical == 'CO') ||
                (element.chemical == 'PM2.5') || (element.chemical == 'PM10')) {



                let filter = dataList.filter((item, i, arr) => {
                    return item.typemeasure == element.chemical;
                });
                let sum_all = 0;
                let counter = 0;
                let class_css;
                let quotient = 0;
                let range_macs = 0; // range of macs surplus
                let max = 0;
                let max_time = '00:00:00';
                let min = 1000000;
                let min_time = '00:00:00';
                let max_sum = 0;
                let max_time_sum = '00:00:00';
                let min_sum = 1000000;
                let min_time_sum = '00:00:00';
                let counter_macs1 = 0;
                let counter_macs5 = 0;
                let counter_macs10 = 0;
                let time_in = 0;
                let tim_out = '';
                let temp_raw = [];
                let day_now = 0;

                if (!isEmpty(filter)) {


                    time_frame.forEach((item, indx) => {
                        //         console.log('item ', item);

                        // let tmp = item.split(':');
                        //let up_sec = tmp[0] * 3600 + tmp[1] * 60;

                        // console.log('raw ' + up_sec);

                        let obj = filter.filter((elem, i, arr) => {

                            day_now = date.format(new Date(elem.date_time), 'DD-MM-YYYY');
                            //            console.log('day now ' + day_now);


                            return (day_now == item);
                        });
                        //time_in = up_sec;

                        let sum = 0;
                        let local_cnt = 0;
                        if (!isEmpty(obj)) {
                            obj.forEach((unit => {
                                //               console.log('unit ', unit);


                                sum += unit.measure;
                                local_cnt++;

                                counter++;

                                sum_all += unit.measure;

                                if (unit.measure < min) {
                                    min = unit.measure;
                                    min_time = date.format(new Date(unit.date_time), 'DD-MM-YYYY HH:mm:ss');
                                }

                                if (unit.measure > max) {
                                    max = unit.measure;
                                    max_time = date.format(new Date(unit.date_time), 'DD-MM-YYYY HH:mm:ss');
                                }

                            }))
                            sum = sum / local_cnt;

                            if (times == 0) {
                                data_raw.push({ 'time': item, [element.chemical]: sum.toFixed(8) });

                            }
                            else {
                                data_raw[indx] = { ...data_raw[indx], [element.chemical]: sum.toFixed(8) };

                            }

                            if (sum < min_sum) {
                                min_sum = sum;
                                min_time_sum = item;
                            }

                            if (sum > max_sum) {
                                max_sum = sum;
                                max_time_sum = item;
                            }

                            if (sum > element.max_d)
                                counter_macs1++;
                            if ((sum / 5) >= element.max_d)
                                counter_macs5++;
                            if ((sum / 10) >= element.max_d)
                                counter_macs10++;

                        };


                    });

                    quotient = (sum_all / counter);
                    range_macs = quotient / element.max_d;
                    class_css = 'alert_success';
                    times++;

                    if (range_macs > 1)
                        class_css = 'alert_macs1_ylw'; //outranged of a macs in 1 time
                    if (range_macs >= 5)
                        class_css = 'alert_macs5_orng'; //outranged of a macs in 5 times
                    if (range_macs >= 10)
                        class_css = 'alert_macs10_red'; //outranged of a macs in  more than 10 times


                    avrg_measure.push({

                        'chemical': element.chemical,
                        'value': quotient.toFixed(8), 'counts': counter,
                        //'min': min, 'min_time': min_time,
                        'max': max, 'max_time': max_time,
                        'min_sum': min_sum, 'min_time_sum': min_time_sum,
                        'max_sum': max_sum, 'max_time_sum': max_time_sum,
                        'counter_macs1': counter_macs1,
                        'counter_macs5': counter_macs5,
                        'counter_macs10': counter_macs10,
                        'className': class_css
                    })
                };

            };
        });
        let name
        let chemical = [];
        let value = [];
        let counts = [];
        //let min = [];
        //let min_time = []
        let max = [];
        let max_time = [];
        let min_sum = [];
        let min_time_sum = []
        let max_sum = [];
        let max_time_sum = [];
        let counter_macs1 = [];
        let counter_macs5 = [];
        let counter_macs10 = [];
        let className = [];

        chemical.push('Наименование');
        value.push('Среднемесячное значение');
        counts.push('Количество');
        min_sum.push('Минимальное значение');
        min_time_sum.push('Время минимального значения');
        max_sum.push('Максимальное значение');
        max_time_sum.push('Время максимального значения');
        // min.push('Мин. разовая концентрация');
        // min_time.push('Дата наблюдения мин.р. концентрации');
        max.push('Макс. разовая концентрация');
        max_time.push('Дата наблюдения макс. р. концентрации');
        counter_macs1.push('Количество превышений ПДК');
        counter_macs5.push('Количество превышений 5*ПДК');
        counter_macs10.push('Количество превышений 10*ПДК');

        className.push('ClassName');

        template_chemical.forEach(item => {


            let filter = avrg_measure.filter((opt, i, arr) => {
                return item == opt.chemical;
            });

            if (isEmpty(filter)) {
                data_raw.forEach((opt, indx) => {
                    data_raw[indx] = { ...data_raw[indx], [item]: '-' };

                });
            }

            if (!isEmpty(filter)) {
                filter.forEach(element => {
                    chemical.push(element.chemical);
                    value.push(Number(element.value).toFixed(8));
                    counts.push(element.counts);
                    min_sum.push(Number(element.min_sum).toFixed(8));
                    min_time_sum.push(element.min_time_sum);
                    max_sum.push(Number(element.max_sum).toFixed(8));
                    max_time_sum.push(element.max_time_sum);
                    // min.push(Number(element.min).toFixed(8));
                    // min_time.push(element.min_time);
                    max.push(Number(element.max).toFixed(8));
                    max_time.push(element.max_time);
                    counter_macs1.push(element.counter_macs1);
                    counter_macs5.push(element.counter_macs5);
                    counter_macs10.push(element.counter_macs10);
                    className.push(element.className);

                });
            } else {
                chemical.push(item);
                value.push('-');
                counts.push('-');
                min_sum.push('-');
                min_time_sum.push('-');
                max_sum.push('-');
                max_time_sum.push('-');
                //  min.push('-');
                //  min_time.push('-');
                max.push('-');
                max_time.push('-');
                counter_macs1.push('-');
                counter_macs5.push('-');
                counter_macs10.push('-');
                className.push('');

            };
        });
        let _avrg_measure = [];
        _avrg_measure.push(chemical, value, counts, max_sum, max_time_sum, min_sum, min_time_sum,
            max, max_time, counter_macs1, counter_macs5, counter_macs10, className);


        // rendering of array for docx template

        var pollution = [];
        var values = [];
        var data = [];
        data_raw.forEach((element, ind) => {
            pollution.push({
                time: element.time, valueNO: element.NO, valueNO2: element.NO2, valueSO2: element.SO2,
                valueH2S: element.H2S, valueO3: element.O3, valueCO: element.CO, valuePM10: element.PM10,
                valuePM25: element['PM2.5']
            });
        })
        // values.push({
        //    date: new Date().format('dd-MM-Y'), pollution: pollution
        //});
        // let str = '';
        //  let measure = [];
        _avrg_measure.forEach((element, ind) => {
            if ((ind > 0) && (ind < _avrg_measure.length - 1)) {
                pollution.push({
                    time: element[0], valueNO: element[1], valueNO2: element[2], valueSO2: element[3],
                    valueH2S: element[4], valueO3: element[5], valueCO: element[6], valuePM10: element[7],
                    valuePM25: element[8]

                });
            }
        });
        //values.push(measure);
        values.push({
            year: date.format(new Date(period_from), 'YYYY'),
            month: date.format(new Date(period_from), 'MM'), pollution: pollution
        });
        data.push({ station: station_name, values: values });

        let response = {};

        response.data_raw = data_raw;
        response.avrg_measure = _avrg_measure;
        response.data = data;
        resp.json({ response });
    });





    //begin rendering




});




export default router;




