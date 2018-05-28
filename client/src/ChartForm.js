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

import checkboxHOC from "react-table/lib/hoc/selectTable";

import shortid from 'shortid';
import "react-table/react-table.css";
//import './Table.css';
//import './css/rwd-table.css';

const styles = {
    propContainer: {
        width: '80%',
        overflow: 'hidden',
        margin: '20px auto 0',
    },
    propToggleHeader: {
        margin: '20px auto 10px',
    },
    tableRow: {
        height: '20px'
    },
    tableRowColumn: {
        height: '20px '
    },
    tr: {
        height: '20px '
    }
};




class ChartForm extends React.Component {
    constructor(props) {
        super(props);
        const {


            fixedHeader,
            fixedFooter,
            stripedRows,
            showRowHover,
            selectable,
            multiSelectable,
            enableSelectAll,
            deselectOnClickaway,
            showCheckboxes,
            height,

            stationsList,
            sensorsList,
            dataList,


        } = props;



        this.state = {
            title: '',
            snack_msg:'',
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

            fixedHeader,
            fixedFooter,
            stripedRows,
            showRowHover,
            selectable,
            multiSelectable,
            enableSelectAll,
            deselectOnClickaway,
            showCheckboxes,
            height,

            selection: [],
            selectAll: false
        };


        this.onClick = this.onSubmit.bind(this);
      // this.onClose= this.handleClose.bind(this);
       //this.onExited= this.handleClose.bind(this);

        //   this.onRowSelection = this.onRowSelection.bind(this);
    }
 

    ////////////

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

    componentWillMount() {
        //const getStations = this.props.queryMeteoEvent(this.state);
        //this.setState({ stationsList: getStations });
        // this.loadData().then(data => this.setState({ stationsList: data }));
       // this.loadData(0).then(data => this.setState({ stationsList: this.setData(data) }));
        // this.loadData().then(data => this.setState({ stationsList: data }));


    };
    render() {
        const { toggleSelection, toggleAll, isSelected } = this;
        const { selection, selectAll, stationsList } = this.state;
        const { loadData } = this.props;
        
       

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
        ]

        return (


            <div>
                <Tabs>
                    <Tab
                        icon={<StationsIcon />}
                        label="Метеостанции">
                        <br />
                        
                    </Tab>
                    <Tab
                        icon={<SensorsIcon />}
                        label="Данные наблюдений"
                    >

                     

                    </Tab>
                    

                </Tabs>
                <IconButton
                    iconStyle={styles.smallIcon}
                    style={styles.small} tooltip={'Обновить'}
                    onClick={this.onSubmit}
                >
                    <Renew />

                </IconButton>
                
         
            </div >
        );
    }
}

function mapStateToProps(state) {
    return {

        /*  fixedHeader: state.fixedHeader,
          fixedFooter: state.fixedFooter,
          stripedRows: state.stripedRows,
          showRowHover: state.showRowHover,
          selectable: state.selectable,
          multiSelectable: state.multiSelectable,
          enableSelectAll: state.enableSelectAll,
          deselectOnClickaway: state.deselectOnClickaway,
          showCheckboxes: state.showCheckboxes,*/
        sensorsList: state.sensorsList


    };
}


ChartForm.propTypes = {
    queryMeteoEvent: PropTypes.func.isRequired,
    //loadData: PropTypes.func.isRequired
}

ChartForm.contextType = {
    router: PropTypes.object.isRequired
}

export default connect(null, { queryMeteoEvent })(withRouter(ChartForm));