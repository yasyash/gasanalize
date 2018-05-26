import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import format from 'node.date-time';
import isEmpty from 'lodash.isempty';


import TxtFieldGroup from './stuff/txtField';
import { queryEvent } from './actions/queryActions';
import MenuTable from './menuTable';
import { Tabs, Tab } from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import MapsPersonPin from 'material-ui/svg-icons/maps/person-pin';
import SensorsIcon from 'material-ui/svg-icons/action/settings-input-component';
import StationsIcon from 'material-ui/svg-icons/action/account-balance';
import DataIcon from 'material-ui/svg-icons/action/timeline';


import ReactTable from "react-table";



import checkboxHOC from "react-table/lib/hoc/selectTable";
const CheckboxTable = checkboxHOC(ReactTable);
Object.assign(CheckboxTable, {
    previousText: 'Предыдущие',
    nextText: 'Следующие',
    loadingText: 'Loading...',
    noDataText: 'Записей не найдено',
    pageText: 'Страница',
    ofText: 'из',
    rowsText: 'записей',
});
import shortid from 'shortid';

import {
    Table,
    TableBody,
    TableFooter,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

class TableSensors extends React.Component {
    constructor(props) {
        super(props);
        const {
            queryEvent,

            fixedHeader,
            fixedFooter,
            stripedRows,
            showRowHover,
            selectable,
            multiSelectable,
            enableSelectAll,
            deselectOnClickaway,
            showCheckboxes,
            station_actual,
            stationsList,
            sensorsList,
            dataList,

            dateTimeBegin,
            dateTimeEnd,
            sensors_actual,
            snack_msg

        } = props;


        this.state = {
            title: '',
            snack_msg:'',
            errors: {},
            isLoading: false,

            dateTimeBegin,
            dateTimeEnd,
            station_actual,
            stationsList,
            sensorsList,
            dataList,
            selected: [],
            sensors_actual,

            fixedHeader,
            fixedFooter,
            stripedRows,
            showRowHover,
            selectable,
            multiSelectable,
            enableSelectAll,
            deselectOnClickaway,
            showCheckboxes,
            height: '300px',

            selection: [],
            selectAll: false
        };


        this.onSubmit = this.onSubmit.bind(this);

    }
    // this.onChange = this.onChange.bind(this);
    // this.onChange = this.onChange.bind(this);

    // this.handleToggle = this.handleToggle.bind(this);
    //this.handleChange = this.handleChange.bind(this);

    /// begin of table functions
    setData(data_in) {
        const data = data_in.map(item => {
            const _id = shortid.generate();


            Object.assign(item, { _id: _id });
            return item;
        });
        return data;
    }

    toggleSelection(key, shift, row) {
        /*
          Implementation of how to manage the selection state is up to the developer.
          This implementation uses an array stored in the component state.
          Other implementations could use object keys, a Javascript Set, or Redux... etc.
        */
        // start off with the existing state - sensors
        let selection = [...this.state.selection];
        let sensors_actual = [...this.state.sensors_actual];

        const keyIndex = selection.indexOf(key);
        // check to see if the key exists
        if (keyIndex >= 0) {
            // it does exist so we will remove it using destructing
            selection = [
                ...selection.slice(0, keyIndex),
                ...selection.slice(keyIndex + 1)
            ];
            sensors_actual = [
                ...sensors_actual.slice(0, keyIndex),
                ...sensors_actual.slice(keyIndex + 1)
            ];
        } else {
            // it does not exist so add it
            selection.push(key);
            sensors_actual.push(row.serialnum);
        }
        // update the state
        this.setState({ selection, sensors_actual });
    };

    toggleAll() {
        /*
          'toggleAll' is a tricky concept with any filterable table
          do you just select ALL the records that are in your data?
          OR
          do you only select ALL the records that are in the current filtered data?
          
          The latter makes more sense because 'selection' is a visual thing for the user.
          This is especially true if you are going to implement a set of external functions
          that act on the selected information (you would not want to DELETE the wrong thing!).
          
          So, to that end, access to the internals of ReactTable are required to get what is
          currently visible in the table (either on the current page or any other page).
          
          The HOC provides a method call 'getWrappedInstance' to get a ref to the wrapped
          ReactTable and then get the internal state and the 'sortedData'. 
          That can then be iterrated to get all the currently visible records and set
          the selection state.
        */
        const selectAll = this.state.selectAll ? false : true;
        const selection = [];
        if (selectAll) {
            // we need to get at the internals of ReactTable
            const wrappedInstance = this.checkboxTable.getWrappedInstance();
            // the 'sortedData' property contains the currently accessible records based on the filter and sort
            const currentRecords = wrappedInstance.getResolvedState().sortedData;
            // we just push all the IDs onto the selection array
            currentRecords.forEach(item => {
                selection.push(item._original._id);
            });
        }
        this.setState({ selectAll, selection });
    };

    isSelected(key) {
        /*
          Instead of passing our external selection state we provide an 'isSelected'
          callback and detect the selection state ourselves. This allows any implementation
          for selection (either an array, object keys, or even a Javascript Set object).
        */
        return this.state.selection.includes(key);
    };

    //// end of table fuctions


    //}

    handleToggle(event, toggled) {
        this.setState({
            [event.target.name]: toggled
        });
    };



    handleChange(event) {
        this.setState({ height: event.target.value });
    };

    ////////////
    handleRowSelection(selectedRows) {
        let id_sensor = (this.props.sensorsList[selectedRows].id);

        this.setState({
            selected: selectedRows,
            sensors_actual: id_sensor
        });
    };



    onSubmit(e) {
        e.preventDefault();
        //   this.props.createMyEvent(this.state);
    };

    onRefresh(e) {
        let params = {};
        //e.preventDefault();

        //this.loadData().then(data => this.setState({ sensorsList: data }));


        // 0 - all stations, 1- all sensors of the station, 2 - selected sensors
        if (!isEmpty(this.state.sensors_actual)) {
            params.period_from = this.state.dateTimeBegin;
            params.period_to = this.state.dateTimeEnd;


            params.station = this.props.station_actual;
            params.sensors = this.state.sensors_actual;
            this.props.queryEvent(params).then(data => {
                if (data) {
                    this.setState({ dataList: data })
                    this.setState({ isLoading: true })
                    this.setState({ snack_msg: 'Данные успешно загружены...' })

                }
                else {
                    this.setState({ isLoading: false })
                    this.setState({ snack_msg: 'Данные отсутствуют...' })

                }
            });
        }
        //this.props.loadData(2).then(data => this.setState({ dataList: this.setData(data) }));
        //alert('load Data');

        //   this.props.createMyEvent(this.state);
    };
    handleClose() {
        this.setState({ isLoading: false });
    };
    //onChange(e) {
    //  this.setState({ [e.target.name]: e.target.value });
    //}
    componentWillMount() {
        //const getStations = this.props.queryEvent(this.state);
        //this.setState({ stationsList: getStations });
        // this.loadData().then(data => this.setState({ stationsList: data }));
        //  this.loadData().then(data => this.setState({ stationsList: data }));
        // this.loadData().then(data => this.setState({ stationsList: data }));


    };

    render() {
        const { toggleSelection, toggleAll, isSelected } = this;
        const { selection, selectAll } = this.state;
        const { sensorsList } = this.props;

        const checkboxProps = {
            selection,
            selectAll,
            isSelected: isSelected.bind(this),
            toggleSelection: toggleSelection.bind(this),
            toggleAll: toggleAll.bind(this),
            selectType: "checkbox",
            getTrProps: (s, r) => {
                let selected = false;
                // someone asked for an example of a background color change
                // here it is...
                if (r) {
                    selected = this.isSelected(r.original._id);
                }
                return {
                    style: {
                        backgroundColor: selected ? "lightblue" : "inherit"
                        // color: selected ? 'white' : 'inherit',
                    }
                };
            }
        };

        const Tips = () =>
            <div style={{ textAlign: "center" }}>
                <em>Для сортировки по нескольким полям удерживайте клавишу Shift!</em>
            </div>;

        const Title = [
            {
                Header: "Перечень датчиков сбора информации",
                columns: [{
                    Header: "Тип",
                    id: "typemeasure",
                    accessor: "typemeasure"
                },
                {
                    Header: "Макс. концентрация",
                    id: "max_consentration",
                    accessor: "max_consentration"
                },
                {
                    Header: "Макс. дневная концентрация",
                    id: "max_day_consentration",
                    accessor: "max_day_consentration"
                },
                {
                    Header: "Ед. измерения",
                    id: "unit_name",
                    accessor: "unit_name"
                }, {
                    Header: "Время наблюдения",
                    id: "date_time_out",
                    accessor: "date_time_out"
                },
                {
                    Header: "ID датчика",
                    id: "serialnum",
                    accessor: d => d.serialnum
                },

                {
                    Header: "Начало наблюдений",
                    id: "date_time_in",
                    accessor: "date_time_in"
                },
                {
                    Header: "Период усреднения",
                    id: "average_period",
                    accessor: "average_period"
                },

                {
                    Header: "Цвет линии на графике",
                    id: "def_colour",
                    accessor: "def_colour"
                }]
            }
        ]

        return (


            <div>
                <br />
                <MenuTable {...this.state} handleToggle={this.handleToggle.bind(this)}
                    handleChange={this.handleChange.bind(this)}
                    onRefresh={this.onRefresh.bind(this)}
                    handleClose={this.handleClose.bind(this)}
                    height={this.state.height}
                />
                <br />
                <CheckboxTable
                    ref={r => (this.checkboxTable = r)}
                    data={sensorsList}
                    columns={Title}
                    {...checkboxProps}
                    defaultPageSize={20}
                    className="-striped -highlight"
                    previousText={'Предыдущие'}
                    nextText={'Следующие'}
                    loadingText={'Loading...'}
                    noDataText={'Записи не загружены...'}
                    pageText={'Страница'}
                    ofText={'из'}
                    rowsText={'записей'}
                    {...this.state}
                />
                <br />
                <Tips />

            </div>
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
        height: state.height


    };
}


TableSensors.propTypes = {
    queryEvent: PropTypes.func.isRequired,
    //loadData: PropTypes.func.isRequired
}

TableSensors.contextType = {
    router: PropTypes.object.isRequired
}

export default connect(null, { queryEvent })(withRouter(TableSensors));