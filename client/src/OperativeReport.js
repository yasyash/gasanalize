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

import ReactTable from "react-table";
import "react-table/react-table.css";

import shortid from 'shortid';
import isEmpty from 'lodash.isempty';
import toUpper from 'lodash/toUpper';
import "react-table/react-table.css";
import isNumber from 'lodash.isnumber';

import MenuReport from './menuReport';




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
            sensors_actual,
            stationsList,
            sensorsList,
            dataList,
            selected: [],
            selection: [],
            selectAll: false,
            chartData,
            locations: '',
            checkedLine: true,
            checkedMeteo: true,
            pointStyle: 'crossRot',
            radius: 2,
            borderWidth: 1,
            borderDash: [5, 10],
            chemical: [],
            options: [],
            barThickness: null,
            beginChartData: [],
            meteoOptions: []
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

  handleReportChange = (station_actual) =>{
      this.setState({station_actual});
  }



    componentWillMount() {


    }



    render() {
        const { toggleSelection, toggleAll, isSelected } = this;
        const { selection, selectAll, stationsList } = this.state;
        const { loadData } = this.props;
        const { classes } = this.props;
        const { sensorsList } = this.props;
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


        Object.assign(ReactTable, {
            previousText: 'Предыдущие',
            nextText: 'Следующие',
            loadingText: 'Loading...',
            noDataText: 'Записей не найдено',
            pageText: 'Страница',
            ofText: 'из',
            rowsText: 'записей',
        });

        return (


            <Paper >
                <br />
                <MenuReport
                   {...this.props}
                   handleReportChange = {this.props.handleReportChange.bind(this)}

                />
                <Typography component="div" style={{ padding: 2 * 1 }}>
                    <table style={{ "width": '100%' }} >
                        <tbody>
                            <tr>
                                <td style={{ 'width': '45%' }}>Станция: {this.state.station_actual}</td>

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
                            <tr>
                                <td> 1  </td>
                                <td>  СО, мг/м3</td>
                                <td>   5</td>
                                <td>   {new Date().format('dd-MM-Y')}</td>
                                <td>   {new Date().format('H:mm:SS')}</td>
                                <td>   0.35 </td>

                            </tr>
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
                                <td ></td>
                                <td >1</td>
                                <td >Т зонд 1, °С</td>
                                <td ></td>
                            </tr>
                            <tr >
                                <td >2</td>
                                <td >Т, °С</td>
                                <td ></td>
                                <td >2</td>
                                <td >Т зонд 2, °С</td>
                                <td ></td>
                            </tr>
                            <tr >
                                <td >3</td>
                                <td >Н, %</td>
                                <td ></td>
                                <td >3</td>
                                <td >Т зонд 3, °С</td>
                                <td ></td>
                            </tr>
                            <tr >
                                <td >4</td>
                                <td >V, м/с</td>
                                <td ></td>
                                <td >4</td>
                                <td >Т пав., °С</td>
                                <td ></td>
                            </tr>
                            <tr >
                                <td >5</td>
                                <td >N, градус</td>
                                <td ></td>
                                <td >5</td>
                                <td >U, В</td>
                                <td ></td>
                            </tr>
                            <tr >
                                <td >6</td>
                                <td >Осадки, мм.</td>
                                <td ></td>
                                <td >6</td>
                                <td >Вскрытие</td>
                                <td ></td>
                            </tr>
                            <tr >
                                <td >7</td>
                                <td >H пав., %</td>
                                <td ></td>
                                <td >7</td>
                                <td >Пожар</td>
                                <td ></td>
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
    classes: PropTypes.object.isRequired    //loadData: PropTypes.func.isRequired
}

OperativeReport.contextType = {
    router: PropTypes.object.isRequired
}

export default (withRouter(withStyles(styles)(OperativeReport)));