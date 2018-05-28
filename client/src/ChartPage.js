

import React from 'react';
import UserEventForm from './userEventForm';
import { queryMeteoEvent } from './actions/queryActions';
import { connect } from 'react-redux';

import ChartForm from './ChartForm';


class ChartPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            errors: {},
            isLoading: false,

            fixedHeader: true,
            fixedFooter: true,
            stripedRows: true,
            showRowHover: false,
            selectable: true,
            multiSelectable: false,
            enableSelectAll: false,
            deselectOnClickaway: false,
            showCheckboxes: true,
            height: '100px',

            stationsList: [] ,
            sensorsList: [] ,
            dataList:[]


        }
    }

    render() {
        return (
            <div className="container">

                <ChartForm  {...this.state} />

            </div>
        );
    }
}

function mapStateToProps(state) {
    return { 
        fixedHeader: state.fixedHeader,
        fixedFooter: state.fixedFooter,
        stripedRows: state.stripedRows,
        showRowHover: state.showRowHover,
        selectable: state.selectable,
        multiSelectable: state.multiSelectable,
        enableSelectAll: state.enableSelectAll,
        deselectOnClickaway: state.deselectOnClickaway,
        showCheckboxes: state.showCheckboxes,
        height: state.height
    };
  }


export default connect(null, { queryMeteoEvent })(ChartPage);