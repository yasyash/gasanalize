import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import format from 'node.date-time';

import { queryMeteoEvent } from './actions/queryActions';
import MenuTable from './menuTable';

import { Tabs, Tab } from 'material-ui/Tabs';
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

import { Bar, Line, Pie } from 'react-chartjs-2';

import shortid from 'shortid';
import isEmpty from 'lodash.isempty';
import "react-table/react-table.css";
import isNumber from 'lodash.isnumber';

import MenuChart from './menuChart';



const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },


});



class ChartForm extends React.Component {
    constructor(props) {
        super(props);
        const {

            chartData,
            stationsList,
            sensorsList,
            sensors_actual,
            station_actual,
            dataList,


        } = props;



        this.state = {
            title: '',
            snack_msg: '',
            errors: {},
            isLoading: false,

            dateTimeBegin: new Date().format('Y-MM-dd') + ' 00:00:00',
            dateTimeEnd: new Date().format('Y-MM-dd H:m:SS'),
            station_actual: '',
            sensors_actual: [],
            stationsList,
            sensorsList,
            dataList,
            selected: [],
            selection: [],
            selectAll: false,
            chartData,
            locations: '',
            checkedLine: true
        };


        this.onClick = this.onSubmit.bind(this);
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
    handleChangeToggle = name => event => {
        this.setState({ [name]: event.target.checked });
    };
    onSubmit(e) {
        e.preventDefault();

        alert('OK');

        //   this.props.createMyEvent(this.state);
    };

    onRefresh() {

        // e.preventDefault();

        this.loadData(1).then(data => {
            if (data) {
                this.setState({ dataList: this.setData(data) })
                this.setState({ isLoading: true })
                this.setState({ snack_msg: 'Данные успешно загружены...' })

            }
            else {
                this.setState({ isLoading: false })
                this.setState({ snack_msg: 'Данные отсутствуют...' })

            }
        });

        //alert('loadData');

        //   this.props.createMyEvent(this.state);
    };

    async    loadData(qtype) {
        let params = {};
        // 0 - all stations, 1- all sensors of the station, 2 - selected sensors

        params.period_from = this.state.dateTimeBegin;
        params.period_to = this.state.dateTimeEnd;
        if (qtype === 1) {
            params.station = this.state.station_actual;
        }

        let data = await (this.props.queryMeteoEvent(params));
        //console.log(data);
        return data;
    };



    getChartData() {
        // Ajax calls here
        const { dataList } = this.props;
        const { sensors_actual } = this.props;
        const { sensorsList } = this.props;
        let obj = [];
        let _boderColor = 'rgba(255, 99, 132, 0.6)';


        let chartData = {
            labels: ['0', '1', '2', '3', '4', '5'],

            datasets: [
                {
                    label: 'Загрузите данные',
                    fill: false,
                    borderColor: _boderColor,
                    backgroundColor: _boderColor,

                    data: [
                        0,
                        1,
                        0,
                        1,
                        0,
                        3
                    ],

                }
            ]
        };

        let title = 'данные не заданы';
        let _timeaxis = [];

        if (dataList.length > 1) {
            let tmp = [];
            let _tmp = '';
            let filter = '';
            let i = 0;
            let label = '';
            let counter = 0;
            if (sensorsList.length > 0) {

                chartData.datasets[0].data = [];
                if (sensors_actual.length > 1) {
                    sensors_actual.forEach(element => {

                        dataList.forEach(item => {
                            if (isEmpty(filter)) {
                                filter = sensorsList.filter((_item, i, arr) => {
                                    return _item._id === element;
                                });
                            };
                            if (filter[0].serialnum) _tmp = item[filter[0].serialnum];
                            if (isNumber(_tmp)) {
                                tmp.push(_tmp);
                                if (counter === 0) {
                                    _timeaxis.push(item['date_time']);
                                };
                            } else {
                                if (i === 0) label = _tmp;
                            };

                            i++;
                        });

                        //chartData.datasets[counter].data = Object.freeze(tmp);
                        // if (!isEmpty(filter[0].def_colour)) {
                        let n = '#' + (filter[0].def_colour.toString(16));
                        let m = '#' + ((filter[0].def_colour + 20).toString(16));
                        // chartData.datasets[counter].borderColor = n;
                        //chartData.datasets[counter].backgroundColor = m;
                        //};
                        // if (!isEmpty(label))

                        //chartData.datasets[counter].label = label;
                        // let obj = chartData.datasets.concat(emptydatasets);
                        let emptydatasets =
                            {
                                label: label,
                                fill: false,
                                borderColor: n,
                                backgroundColor: m,
                                data: tmp
                            };
                        //chartData.datasets = obj;
                        if (!isEmpty(title)) title += ',';
                        title = title + ' ' + label;
                        //this.setState({ 'locations': title });
                        label = '';
                        tmp = [];

                        filter = '';
                        i = 0;
                        // chartData.datasets[0].data = 
                        obj.push(emptydatasets);

                        counter++;
                    });
                    //chartData.datasets.splice(chartData.datasets.length - 1, );
                    //   chartData.labels = _timeaxis;
                    chartData.datasets = obj;
                };
            }; //end multidata section
            if (sensors_actual.length === 1) {
                dataList.forEach(element => {
                    tmp.push(element.measure);
                    _timeaxis.push(element['date_time']);

                });
                filter = sensorsList.filter((_item, i, arr) => {
                    return _item._id === sensors_actual[0];
                });
                let n = '#' + (filter[0].def_colour.toString(16));
                let m = '#' + ((filter[0].def_colour + 20).toString(16));

                chartData.datasets[0].borderColor = n;
                chartData.datasets[0].backgroundColor = m;
                chartData.datasets[0].data = tmp;
                chartData.datasets[0].label = dataList[0].typemeasure;
                title = dataList[0].typemeasure + ' (' + dataList[0].unit_name + ')';

            };

            chartData.labels = _timeaxis;

        }; // end fetch section when data is exist
        //console.log('data = ', chartData.datasets[0].data);

        this.setState({ 'locations': title });

        this.setState({ chartData });
    };

    componentWillMount() {
        this.getChartData();
    }

    render() {
        const { toggleSelection, toggleAll, isSelected } = this;
        const { selection, selectAll, stationsList } = this.state;
        const { loadData } = this.props;
        const { classes } = this.props;
        const { sensorsList } = this.props;
        let titles = {
            display: this.props.displayTitle,
            text: 'Данные отсутствуют - сформируйте запрос',
            fontSize: 15
        };
        const Title = [
            {
                Header: "Перечень метеостанций",
                columns: [{
                    Header: "ID станции",
                    id: "id",
                    accessor: d => d.id
                },
                {
                    Header: "Наименование",
                    id: "namestation",
                    accessor: "namestation"
                },
                {
                    Header: "Период обновления",
                    id: "updateperiod",
                    accessor: "updateperiod"
                },
                {
                    Header: "Последнее обращение",
                    id: "date_time_out",
                    accessor: "date_time_out"
                },
                {
                    Header: "Станция добавлена",
                    id: "date_time_in",
                    accessor: "date_time_in"
                }]
            }
        ];
        if (sensorsList.length > 0) {


            titles = {
                display: this.props.displayTitle,
                text: 'График: ' + this.state.locations,
                fontSize: 15
            };
        };

        return (


            <Paper className={classes.root}>
                <MenuChart
                    {...this.state}
                    handleChangeToggle={this.handleChangeToggle('checkedLine').bind(this)}
                    value="checkedLine"
                />
                {(this.state.checkedLine) &&
                    <Line
                        data={this.state.chartData}
                        options={{
                            title: titles,
                            legend: {
                                display: this.props.displayLegend,
                                position: this.props.legendPosition
                            }
                        }}
                    />}
                {(!this.state.checkedLine) &&
                    <Bar
                        data={this.state.chartData}
                        options={{
                            title: titles,
                            legend: {
                                display: this.props.displayLegend,
                                position: this.props.legendPosition
                            }
                        }}
                    />}
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


    return {
        sensorsList: state.activeSensorsList,
        dataList: state.dataList,
        station_actual: station,
        sensors_actual: sensors

    };
}


ChartForm.propTypes = {
    queryMeteoEvent: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
    //loadData: PropTypes.func.isRequired
}

ChartForm.contextType = {
    router: PropTypes.object.isRequired
}

export default connect(mapStateToProps, { queryMeteoEvent })(withRouter(withStyles(styles)(ChartForm)));