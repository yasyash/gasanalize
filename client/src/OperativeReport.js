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



const styles = theme => ({

    _td: { textAlign: 'center' }

});


class OperativeReport extends React.Component {
    constructor(props) {
        super(props);
        const {

            chartData,
            dateTimeBegin,
            dateTimeEnd,
            station_actual,
            stationsList,
            sensorsList,
            dataList,
            sensors_actual



        } = props;

        this.state = {
            title: '',
            snack_msg: '',
            errors: {},
            isLoading: false,

            dateTimeBegin,
            dateTimeEnd,
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
            rows_measure: [],
            rows_service: {},
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
        this.setState({ dateTimeBegin: this.props.dateTimeBegin, dateTimeEnd: this.props.dateTimeEnd });
        //this.loadData().then(data => this.setState({ sensorsList: data }));



        params.period_from = this.state.dateTimeBegin;
        params.period_to = this.state.dateTimeEnd;
        params.station = state.station_actual;
        this.loadData(params).then(data => {
            if (data) {
                let dataList = data.dataTable;
                let sensorsList = data.sensorsTable;
                let macsList = data.macsTable;
                let rows_measure = [];

                this.setState({ dataList: dataList });
                this.setState({ sensorsList: sensorsList });
                this.setState({ macsList: macsList });


                // addActiveSensorsList(this.state.selection);
                //getFirstActiveStationsList();
                //addActiveStationsList({ sensors: this.state.selection });
                macsList.forEach((element, indx) => {
                    let filter = dataList.filter((item, i, arr) => {
                        return item.typemeasure == element.chemical;
                    });
                    let sum = 0;
                    let counter = 0;

                    if (!isEmpty(filter)) {
                        filter.forEach(item => {
                            sum += item.measure;
                            counter++;
                        });
                        rows_measure.push({
                            'chemical': element.chemical + ', мг/м.куб.', 'macs': element.max_m,
                            'date': new Date(this.state.dateTimeEnd).format('dd-MM-Y'),
                            'time': new Date().format('H:mm:SS'), 'value': (sum / counter)
                        })
                    };
                });


                // for service rows
                const { queryFields } = this.state;
                var rows_service = {};
                if (!isEmpty(dataList)) {
                    for (var key in queryFields) {
                        let filter = dataList.filter((item, i, arr) => {
                            return item.typemeasure == queryFields[key];
                        });
                        if (!isEmpty(filter)) {
                            if ((key == 'Fr') || (key == 'Dr')) {
                                rows_service[key] = true;
                            } else {
                                let sum = 0;
                                let counter = 0;
                                filter.forEach(item => {
                                    sum += item.measure;
                                    counter++;
                                });
                                rows_service[key] = sum / counter;
                            };
                        } else {

                            if ((key == 'Fr') || (key == 'Dr')) {
                                rows_service[key] = false;
                            };
                            if ((key == 'U')) {
                                rows_service[key] = '223.1';
                            };
                            if ((key == 'Ts1') || (key == 'Ts2') || (key == 'Ts3')) {
                                rows_service[key] = rows_service.Tin + 0.5;
                            };
                        };

                    };
                };
                this.setState({ 'rows_measure': rows_measure });
                this.setState({ 'rows_service': rows_service });

            }
            else {
                this.setState({ isLoading: false })
                this.setState({ snack_msg: 'Данные отсутствуют...' })

            };


        });


    };





    componentWillMount() {


    }



    render() {
        const { classes } = this.props;
        const { rows_measure } = this.state;
        const { rows_service } = this.state;
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
                    {...this.props}
                    station_name={this.state.station_name}
                    handleReportChange={this.handleReportChange.bind(this)}

                />
                <Typography component="div" style={{ padding: 2 * 1 }}>
                    <table style={{ "width": '100%' }} >
                        <tbody>
                            <tr>
                                <td style={{ 'width': '45%' }}>Станция: {this.state.station_name}</td>

                                <td style={{ 'width': '45%', 'textAlign': 'right' }}>{new Date().format('dd-MM-Y H:mm:SS')}</td>
                                <td style={{ 'width': '5%' }}>&nbsp;</td>
                            </tr>
                        </tbody>
                    </table>


                    <table border="1" width="100%" className={classes._td}>
                        <tbody>
                            <tr>
                                <td style={{ 'width': '100%' }} colSpan="6">
                                    <b> Параметры загрязнения</b>
                                </td>
                            </tr>
                            <tr >
                                <td style={{ 'width': '5%' }} rowSpan="2">
                                    №
                                </td>
                                <td style={{ 'width': '25%' }} rowSpan="2">
                                    Наименование
                    </td>
                                <td style={{ 'width': '20%' }} rowSpan="2">
                                    ПДКмр, мг/м.куб.
                </td>
                                <td style={{ 'width': '50%' }} colSpan="3">
                                    Разовая концентрация (средняя за 20 мин), мг/м.куб.
                </td>
                            </tr>
                            <tr>
                                <td style={{ 'width': '15%' }} >
                                    дата
                </td>
                                <td style={{ 'width': '15%' }} >
                                    время
                </td>
                                <td style={{ 'width': '20%' }} >
                                    значение
                </td>
                            </tr>
                            {(rows_measure) &&// if not empty
                                rows_measure.map((option, i) => (
                                    <tr key={'tr_' + i}>
                                        <td> {i + 1}  </td>
                                        <td> {option.chemical}</td>
                                        <td> {option.macs}</td>
                                        <td> {option.date}</td>
                                        <td> {option.time}</td>
                                        <td> {option.value} </td>

                                    </tr>
                                ))}
                            <tr >
                                <td style={{ 'width': '50%' }} colSpan="3" ><b> Метеоданные</b>  </td>
                                <td style={{ 'width': '50%' }} colSpan="3"> <b>Служебная информация </b> </td>
                            </tr>
                            <tr >
                                <td style={{ 'width': '5%' }} >
                                    №     </td>
                                <td style={{ 'width': '25%' }} >
                                    Наименование           </td>
                                <td style={{ 'width': '20%' }} >
                                    Значение      </td>
                                <td style={{ 'width': '15%' }} >
                                    №     </td>
                                <td style={{ 'width': '15%' }} >
                                    Наименование           </td>
                                <td style={{ 'width': '20%' }} >
                                    Значение      </td>
                            </tr>
                            <tr >
                                <td >1</td>
                                <td >Р, мм.рт.ст.</td>
                                <td >{rows_service.P}</td>
                                <td >1</td>
                                <td >Т зонд 1, °С</td>
                                <td >{rows_service.Ts1}</td>
                            </tr>
                            <tr >
                                <td >2</td>
                                <td >Т, °С</td>
                                <td >{rows_service.Tout}</td>
                                <td >2</td>
                                <td >Т зонд 2, °С</td>
                                <td >{rows_service.Ts2}</td>
                            </tr>
                            <tr >
                                <td >3</td>
                                <td >Н, %</td>
                                <td >{rows_service.Hout}</td>
                                <td >3</td>
                                <td >Т зонд 3, °С</td>
                                <td >{rows_service.Ts3}</td>
                            </tr>
                            <tr >
                                <td >4</td>
                                <td >V, м/с</td>
                                <td >{rows_service.WindV}</td>
                                <td >4</td>
                                <td >Т пав., °С</td>
                                <td >{rows_service.Tin}</td>
                            </tr>
                            <tr >
                                <td >5</td>
                                <td >N, градус</td>
                                <td >{rows_service.WindD}</td>
                                <td >5</td>
                                <td >U, В</td>
                                <td >{rows_service.U}</td>
                            </tr>
                            <tr >
                                <td >6</td>
                                <td >Осадки, мм.</td>
                                <td >{rows_service.Rain}</td>
                                <td >6</td>
                                <td >Вскрытие</td>
                                <td >
                                    {(!isEmpty(rows_service)) && <label style={{  padding: '0', marginBottom: '0' }} className={classnames('alert', {
                                        'alert-danger': rows_service.Dr === true
                                    })}> {rows_service.Dr ? alert : norm} </label>}

                                </td>
                            </tr>
                            <tr >
                                <td >7</td>
                                <td >H пав., %</td>
                                <td >{rows_service.Hin}</td>
                                <td >7</td>
                                <td >Пожар</td>
                                <td >
                                    {(!isEmpty(rows_service)) && <label style={{padding: '0', marginBottom: '0' }} className={classnames('alert', {
                                        'alert-danger': rows_service.Fr === true
                                    })}> {rows_service.Fr ? alert : norm} </label>}</td>
                            </tr>

                        </tbody>
                    </table>
                </Typography>
            </Paper >
        );
    }
}

function mapStateToProps(state) {
    let sensors = '';
    let station = '';
    let tmp = '';
    if (state.activeStationsList[1]) {
        tmp = state.activeStationsList.slice(state.activeStationsList.length - 1, );
        sensors = tmp[0].sensors;

    };

    if (state.activeStationsList[0]) {
        station = state.activeStationsList[0].station;

    };
    if (!isEmpty(station)) { tmp = true } else { tmp = false };


    return {
        sensorsList: state.activeSensorsList,
        dataList: state.dataList,
        station_actual: station,
        sensors_actual: sensors,
        macs: state.macsList,
        selectedSensors: state.sensorsList,
        checkedMeteo: tmp,
        meteoList: state.meteoList

    };
}


OperativeReport.propTypes = {
    classes: PropTypes.object.isRequired,
    queryOperativeEvent: PropTypes.func.isRequired,    //loadData: PropTypes.func.isRequired
    queryMeteoEvent: PropTypes.func.isRequired
}

OperativeReport.contextType = {
    router: PropTypes.object.isRequired
}

export default connect(null, { queryOperativeEvent, queryMeteoEvent })(withRouter(withStyles(styles)(OperativeReport)));