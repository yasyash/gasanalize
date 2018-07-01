import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import format from 'node.date-time';


import FontIcon from 'material-ui/FontIcon';
import MapsPersonPin from 'material-ui/svg-icons/maps/person-pin';
import SensorsIcon from 'material-ui/svg-icons/action/settings-input-component';
import StationsIcon from 'material-ui/svg-icons/action/account-balance';
import DataIcon from 'material-ui/svg-icons/action/timeline';
import IconButton from 'material-ui/IconButton';
import Renew from 'material-ui/svg-icons/action/autorenew';
import Snackbar from '@material-ui/core/Snackbar';
import Slider from '@material-ui/core/Slide';
import Switch from '@material-ui/core/Switch';
import SvgIcon from '@material-ui/core/SvgIcon';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';

import shortid from 'shortid';
import isEmpty from 'lodash.isempty';
import toUpper from 'lodash/toUpper';
import isNumber from 'lodash.isnumber';
import classnames from 'classnames';

import MenuReport from './menuReport';

import { queryOperativeEvent, queryEvent, queryMeteoEvent } from './actions/queryActions';
import { reportGen } from './actions/genReportActions';
import { dateAddAction } from './actions/dateAddAction';


const styles = theme => ({

    _td: { textAlign: 'center' },
    alert_macs1_ylw: {
        backgroundColor: '#ffff1a'
    },
    alert_macs5_orng: {
        backgroundColor: '#ff4d00'
    },

    alert_macs10_red: {
        backgroundColor: '#ff0000'
    },
    alert_success: {
        color: '#000000',
        backgroundColor: '#ffffff'
    }



});


class DailyReport extends React.Component {
    constructor(props) {
        super(props);
        const {

            chartData,

            station_actual,
            stationsList,
            sensorsList,
            dataList,
            sensors_actual



        } = props;
        let today = new Date();

        this.state = {
            title: '',
            snack_msg: '',
            errors: {},
            isLoading: false,
            dateTimeBegin: new Date(today).format('Y-MM-ddT') + '00:00',
            dateTimeEnd: new Date(today).format('Y-MM-ddT') + '23:59:59',
            station_actual,
            station_name: '',
            sensors_actual,
            stationsList,
            sensorsList,
            dataList,
            selected: [],
            selection: [],
            selectAll: false,
            chemical: [],
            options: [],
            barThickness: null,
            beginChartData: [],
            data_raw: [],
            avrg_measure: [],
            data_4_report: [],
            queryFields: {
                'P': 'Атм. давление',
                'Tout': 'Темп. внешняя',
                'Tin': 'Темп. внутренняя',
                'Hout': 'Влажность внеш.',
                'Hin': 'Влажность внутр.',
                'WindV': 'Скорость ветра',
                'WindD': 'Направление ветра',
                'Rain': 'Интенс. осадков',
                'Ts1': 'Темп. зонда 1',
                'Ts2': 'Темп. зонда 2',
                'Ts3': 'Темп. зонда 3',
                'U': 'Напряжение питания',
                'Dr': 'Дверь',
                'Fr': 'Пожар'
            }
        };


        dateAddAction({ 'dateTimeBegin': this.state.dateTimeBegin });
        dateAddAction({ 'dateTimeEnd': this.state.dateTimeEnd });
        // this.onClick = this.onSubmit.bind(this);
        // this.onClose= this.handleClose.bind(this);
        //this.onExited= this.handleClose.bind(this);

        //   this.onRowSelection = this.onRowSelection.bind(this);
    }

    static defaultProps = {
        displayTitle: true,
        displayLegend: true,
        legendPosition: 'right',
        locations: ''
    };

    ////////////    
    handleChangeToggle = (name, event) => {
        this.setState({ [name]: event.target.checked });
        if (name === 'checkedMeteo') {
            // this.setState({ [name]: event.target.checked });
            this.getChartData(event.target.checked);
        }
    };
    onSubmit(e) {
        e.preventDefault();

        alert('OK');

        //   this.props.createMyEvent(this.state);
    };
    async    loadData(params) {


        let data = await (this.props.queryOperativeEvent(params));
        //console.log(data);
        return data;
    };

    async    loadMeteoData(params) {

        let data = await (this.props.queryMeteoEvent(params));

        return data;
    };

    handleReportChange = (state) => {
        this.setState({ station_actual: state.station_actual, station_name: state.station_name });

        let params = {};
        //e.preventDefault();
        // this.setState({ dateTimeBegin: this.props.dateTimeBegin, dateTimeEnd: this.props.dateTimeEnd });
        //this.loadData().then(data => this.setState({ sensorsList: data }));

        const template_chemical = ['NO', 'NO2', 'SO2', 'H2S', 'O3', 'CO', 'PM2.5', 'PM10'];
        if (isEmpty(state.dateTimeBegin)) {
            params.period_from = this.props.dateTimeBegin;
            params.period_to = this.props.dateTimeEnd;
        }
        else {
            params.period_from = state.dateTimeBegin;
            params.period_to = state.dateTimeEnd;
        };
        params.station = state.station_actual;
        this.loadData(params).then(data => {
            if (data) {
                let dataList = data.dataTable;
                let sensorsList = data.sensorsTable;
                let macsList = data.macsTable;
                let avrg_measure = [];
                let data_raw = [];
                let times = 0;
                let time_frame = [];
                let mill_sec = 0;


                this.setState({ dataList: dataList });
                this.setState({ sensorsList: sensorsList });
                this.setState({ macsList: macsList });

                for (var ms = -6060000; ms < 80340000; ms += 1200000) {
                    time_frame.push(new Date(ms).format('HH:mm'));
                }
                // addActiveSensorsList(this.state.selection);
                //getFirstActiveStationsList();
                //addActiveStationsList({ sensors: this.state.selection });


                macsList.forEach((element, indx) => {
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
                        let counter_macs1 = 0;
                        let counter_macs5 = 0;
                        let counter_macs10 = 0;
                        let time_in = 0;
                        let tim_out = '';
                        let temp_raw = [];

                        if (!isEmpty(filter)) {


                            time_frame.forEach((item, indx) => {

                                let tmp = item.split(':');
                                let up_sec = tmp[0] * 3600 + tmp[1] * 60;
                                let time_now = 0
                                // console.log('raw ' + up_sec);

                                let obj = filter.filter((elem, i, arr) => {

                                    time_now = new Date(elem.date_time).getHours() * 3600 +
                                        new Date(elem.date_time).getMinutes() * 60 + new Date(elem.date_time).getSeconds();
                                    // console.log('base ' + time_now);


                                    return ((up_sec >= time_now) && (time_in <= time_now));
                                });
                                time_in = up_sec;

                                let sum = 0;
                                let local_cnt = 0;
                                if (!isEmpty(obj)) {
                                    obj.forEach((unit => {
                                        sum += unit.measure;
                                        local_cnt++;

                                        counter++;

                                        sum_all += unit.measure;

                                        if (unit.measure < min) {
                                            min = unit.measure;
                                            min_time = new Date(unit.date_time).format('H:mm:SS');
                                        }

                                        if (unit.measure > max) {
                                            max = unit.measure;
                                            max_time = new Date(unit.date_time).format('H:mm:SS');
                                        }

                                    }))
                                    sum = sum / local_cnt;

                                    if (times == 0) {
                                        data_raw.push({ 'time': item, [element.chemical]: sum.toFixed(8) });

                                    }
                                    else {
                                        data_raw[indx] = { ...data_raw[indx], [element.chemical]: sum.toFixed(8) };

                                    }


                                    if (sum > element.max_m)
                                        counter_macs1++;
                                    if ((sum / 5) >= element.max_m)
                                        counter_macs5++;
                                    if ((sum / 10) >= element.max_m)
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
                                'min': min, 'min_time': min_time,
                                'max': max, 'max_time': max_time,
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
                let min = [];
                let min_time = []
                let max = [];
                let max_time = [];
                let counter_macs1 = [];
                let counter_macs5 = [];
                let counter_macs10 = [];
                let className = [];

                chemical.push('Наименование');
                value.push('Среднесуточное значение');
                counts.push('Количество');
                min.push('Минимальное значение');
                min_time.push('Время минимального значения');
                max.push('Максимальное значение');
                max_time.push('Время максимального значения');
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
                            min.push(Number(element.min).toFixed(8));
                            min_time.push(element.min_time);
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
                        min.push('-');
                        min_time.push('-');
                        max.push('-');
                        max_time.push('-');
                        counter_macs1.push('-');
                        counter_macs5.push('-');
                        counter_macs10.push('-');
                        className.push('');

                    };
                });
                let _avrg_measure = [];
                _avrg_measure.push(chemical, value, counts, max, max_time, min, min_time, counter_macs1, counter_macs5,
                    counter_macs10, className);


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
                    date: new Date(this.props.dateTimeBegin).format('dd-MM-Y'), pollution: pollution
                });
                data.push({ station: this.state.station_name, values: values });

                this.setState({ 'data_4_report': data });
                // this.setState({ 'station_name': state.station_name });
                this.setState({ 'data_raw': data_raw });
                this.setState({ 'avrg_measure': _avrg_measure });

                this.setState({ isLoading: true });
                this.setState({ snack_msg: 'Данные успешно загружены...' });
            }
            else {
                this.setState({ isLoading: false })
                this.setState({ snack_msg: 'Данные отсутствуют...' })

            };


        });


    };


    handleSnackClose() {
        this.setState({ isLoading: false });
        this.setState({ isUpdated: false });

    };


    componentWillMount() {


    }



    render() {
        const { classes } = this.props;
        const { data_raw } = this.state;
        const { avrg_measure } = this.state;
        const { snack_msg, isLoading } = this.state;
        const alert = 'ТРЕВОГА';
        const norm = 'отсутствует';

        const Title_operative = [{
            Header: "Параметры загрязнения",
            style: { 'width': '50%' },
            columns: [
                {
                    Header: "№",
                    id: "id",
                    style: { 'width': '10%' }
                },
                {
                    Header: "Наименование",
                    id: "name",
                    style: { 'width': '20%' }
                },
                {
                    Header: "ПДКмр, мг/м.куб.",
                    id: "pdk_mr",
                    style: { 'width': '20%' }
                },
                {
                    Header: "Разовая концентрация (средняя за 20 мин), мг/м.куб.",
                    style: { 'width': '50%' },
                    columns: [
                        {
                            Header: "дата время",
                            id: "date_time",
                            style: { 'width': '25%' }
                        },
                        {
                            Header: "значение",
                            id: "date_time",
                            style: { 'width': '25%' }
                        }
                    ]
                }
            ]
        }

        ];




        return (


            <Paper >
                <br />
                <MenuReport
                    {...this.props} snack_msg={snack_msg} isLoading={isLoading}
                    station_name={this.state.station_name}
                    station_actual={this.state.station_actual}
                    //dateTimeBegin={this.state.dateTimeBegin}
                    report_type='daily'
                    data_4_report={this.state.data_4_report}
                    handleReportChange={this.handleReportChange.bind(this)}
                    handleSnackClose={this.handleSnackClose.bind(this)}

                />

                <Typography component="div" style={{ padding: 2 * 1 }} id="daily_report">

                    <table style={{ "width": '100%' }} id="daily_report_table_header">
                        <tbody>
                            <tr>
                                <td style={{ 'width': '45%' }}>Станция: {this.state.station_name}</td>

                                <td style={{ 'width': '45%', 'textAlign': 'right' }}>{new Date(this.props.dateTimeBegin).format('dd-MM-Y')}</td>
                                <td style={{ 'width': '5%' }}>&nbsp;</td>
                            </tr>
                        </tbody>
                    </table>


                    <table border="1" width="100%" style={{ 'Align': 'center' }} className={classes._td} id="operative_report_table">
                        <tbody>
                            <tr >
                                <td style={{ 'width': '15%' }} rowSpan="2">
                                    <b> Время</b>
                                </td>
                                <td style={{ 'width': '85%' }} colSpan="8">
                                    <b> Концентрация, мг/м. куб.</b>
                                </td>
                            </tr>
                            <tr >
                                <td style={{ 'width': '10%' }} >
                                    NO
                                 </td>
                                <td style={{ 'width': '10%' }} >
                                    NO2
                                 </td>
                                <td style={{ 'width': '10%' }} >
                                    SO2
                                 </td>
                                <td style={{ 'width': '10%' }} >
                                    H2S
                                 </td>
                                <td style={{ 'width': '10%' }} >
                                    O3
                                 </td>
                                <td style={{ 'width': '10%' }} >
                                    CO
                                 </td>
                                <td style={{ 'width': '10%' }} >
                                    PM2.5
                                 </td>
                                <td style={{ 'width': '10%' }} >
                                    PM10
                                 </td>
                            </tr>


                            {(data_raw) &&// if not empty
                                data_raw.map((option, i) => (
                                    <tr key={'tr_' + i}>
                                        <td> {option.time}</td>
                                        <td> {option.NO}</td>
                                        <td> {option.NO2}</td>
                                        <td> {option.SO2}</td>
                                        <td> {option.H2S}</td>
                                        <td> {option.O3}</td>
                                        <td> {option.CO}</td>
                                        <td> {option['PM2.5']}</td>
                                        <td> {option.PM10}</td>

                                    </tr>
                                ))}
                            <tr>

                            </tr>
                            {(avrg_measure) &&// if not empty
                                avrg_measure.map((option, i) => (
                                    (i > 0 && i < avrg_measure.length - 1) &&
                                    <tr key={'trm_' + i}>
                                        <td> {option[0]}</td>
                                        <td> {option[1]}</td>
                                        <td> {option[2]}</td>
                                        <td> {option[3]}</td>
                                        <td> {option[4]}</td>
                                        <td> {option[5]}</td>
                                        <td> {option[6]}</td>
                                        <td> {option[7]}</td>
                                        <td> {option[8]}</td>

                                    </tr>
                                ))}



                        </tbody>
                    </table>
                </Typography>
            </Paper >
        );
    }
}

function mapStateToProps(state) {


    return {
        dateTimeBegin: state.datePickers.dateTimeBegin,
        dateTimeEnd: state.datePickers.dateTimeEnd

    };
}


DailyReport.propTypes = {
    classes: PropTypes.object.isRequired,
    queryOperativeEvent: PropTypes.func.isRequired,    //loadData: PropTypes.func.isRequired
    queryMeteoEvent: PropTypes.func.isRequired,
    reportGen: PropTypes.func.isRequired
}

DailyReport.contextType = {
    router: PropTypes.object.isRequired
}

export default connect(mapStateToProps, { queryOperativeEvent, queryMeteoEvent, reportGen })(withRouter(withStyles(styles)(DailyReport)));