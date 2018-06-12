import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconMenu from 'material-ui/IconMenu';
import RaisedButton from 'material-ui/RaisedButton';
import Settings from 'material-ui/svg-icons/action/settings';
import ContentFilter from 'material-ui/svg-icons/content/filter-list';
import FileFileDownload from 'material-ui/svg-icons/file/file-download';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import Renew from 'material-ui/svg-icons/action/autorenew';
import Snackbar from '@material-ui/core/Snackbar';
import Slider from '@material-ui/core/Slide';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

import SvgIcon from '@material-ui/core/SvgIcon';

import WbCloudy from '@material-ui/icons/WbCloudy'
import BarChart from '@material-ui/icons/Equalizer';
import TimeLine from '@material-ui/icons/Timeline';
import Switch from '@material-ui/core/Switch';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import Tooltip from '@material-ui/core/Tooltip';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

import CheckBox from '@material-ui/icons/CheckBox';
import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';

import { connect } from 'react-redux';

import isEmpty from 'lodash.isempty';

const ITEM_HEIGHT = 48;


const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexWrap: 'wrap'
    },formControl: {
        margin: theme.spacing.unit,
        minWidth: 160,
      },
      selectEmpty: {
        marginTop: theme.spacing.unit * 2,
      },
    icon: {
        margin: theme.spacing.unit * 2,
        color: blue[600]
    },
    iOSSwitchBase: {
        '&$iOSChecked': {
            color: theme.palette.common.white,
            '& + $iOSBar': {
                backgroundColor: blue[600],
            },
        },
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
            easing: theme.transitions.easing.sharp,
        }),
    },
    iOSChecked: {
        transform: 'translateX(15px)',
        '& + $iOSBar': {
            opacity: 1,
            border: 'none',
        },
    },
    iOSBar: {
        borderRadius: 13,
        width: 42,
        height: 26,
        marginTop: -13,
        marginLeft: -21,
        border: 'solid 1px',
        borderColor: theme.palette.grey[400],
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    iOSIcon: {
        width: 24,
        height: 24,
    },
    iOSIconChecked: {
        boxShadow: theme.shadows[1],
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 250,
    },
    _td: { textAlign: 'center' }

});




class MenuReport extends Component {

    constructor(props) {
        let isNll = false;
        super(props);

        const { fixedHeader,

            isStation,
            isLoading,
            snack_msg,
            value,
            options,
            meteoOptions,
            dateTimeBegin,
            dateTimeEnd,
            station_actual,
            stationsList,
            sensorsList,
            dataList,
            selected: [],
            sensors_actual,
            station_name
        } = props;

        if (isStation) { isNll = true }

        this.state = {

            isStation: isNll,
            isLoading,
            snack_msg,
            value,
            anchorEl: null,
            options,
            meteoOptions,
            checked: [],

            dateTimeBegin,
            dateTimeEnd,
            station_actual,
            stationsList,
            sensorsList,
            dataList,
            selected: [],
            sensors_actual,
            station_name
        };




        //this.handleClose = this.handleClose.bind (this);
        //this.handleClick = this.handleClick.bind (this);
        // this.handleChange = this.handleChange.bind (this);

    }
    handleLocalChangeToggle = name => event =>{
       // const{meteoOptions} = this.props;
       // const{options} = this.props;

        this.props.handleChangeToggle (name, event);
       // this.setState({meteoOptions});
       // this.setState({options});

    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
        this.setState({ meteoOptions: this.props.meteoOptions });
        this.setState({ options: this.props.options });

    };

    handleClose = () => {
        this.setState({ anchorEl: null });

    };
    handleChange = name => event => {
        if (this.props.checkedMeteo){
        const { options } = this.state;

        // indx = options.chemical.indexOf(name);
        for (var key in options) {
            if (options[key].chemical === name) {
                options[key]['visible'] = event.target.checked;

            };
        };
    
        this.setState({ options });
        this.props.hideLine({ options });

    } else {
        const { meteoOptions } = this.state;

        // indx = options.chemical.indexOf(name);
        for (var key in meteoOptions) {
            if (meteoOptions[key].header === name) {
                meteoOptions[key]['visible'] = event.target.checked;

            };
        };
    
        this.setState({ meteoOptions });
        this.props.hideLine({ meteoOptions });

    };
    };
    handleSelectChange = event => {
        const {stationsList} = this.props;
        let filter = stationsList.filter((item, i, arr) => {
            return item.namestation == event.target.value;});

        this.setState({ [event.target.name]: event.target.value });
        if(!isEmpty(filter)) 
        this.props.handleReportChange({station_name: event.target.value,station_actual: filter[0].id});
      };
   

    render() {

        const { classes } = this.props;
        const { anchorEl } = this.state;
        const {stationsList} = this.props;
        let namestation ='';
        let filter = stationsList.filter((item, i, arr) => {
            return item.id == this.state.station_actual;});
            if(!isEmpty(filter))  namestation = filter[0].namestation;

            //console.log('menu '+stationsList);
        /*let { fixedHeader,
            fixedFooter,
            stripedRows,
            showRowHover,
            selectable,
            multiSelectable,
            enableSelectAll,
            deselectOnClickaway,
            showCheckboxes,
            height
        } = this.props;*/
        return (
            <div>


                <Paper >

                    <nav className="navbar form-control">


                        <div className="navbar-header">
                        <form className={classes.root} autoComplete="off">
                        <FormControl className={classes.formControl}>

                            <InputLabel htmlFor="station_name" >Отчет по станции</InputLabel>

                                <Select
                                    value={this.state.station_name}
                                   onChange={this.handleSelectChange}
                                  inputProps={{
                                   name: 'station_name',
                                      id: 'station_name',
                                  }}>
                                {  (stationsList)&&// if not empty
                                        stationsList.map((option, i) => (
                                 <MenuItem key={option.namestation} value={option.namestation}>
                                        {option.namestation}
                                 </MenuItem>
                                 ))
                                }
                                 </Select>
                        </FormControl>
                        </form>

                        </div>

                        <div className={classes.root}>
                            <Tooltip id="tooltip-charts-view3" title="Метеоданные">
                            <SvgIcon className={classes.icon}>
                                    <path  d="M6,6L6.69,6.06C7.32,3.72 9.46,2 12,2A5.5,5.5 0 0,1 
                                    17.5,7.5L17.42,8.45C17.88,8.16 18.42,8 19,8A3,3 0 0,1 22,11A3,3
                                     0 0,1 19,14H6A4,4 0 0,1 2,10A4,4 0 0,1 6,6M6,8A2,2 0 0,0
                                      4,10A2,2 0 0,0 6,12H19A1,1 0 0,0 20,11A1,1 0 0,0 
                                      19,10H15.5V7.5A3.5,3.5 0 0,0 12,4A3.5,3.5 0 0,0 8.5,7.5V8H6M18,
                                      18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1
                                       18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1
                                        15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89
                                         17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z"/>
                                </SvgIcon>
                            </Tooltip>

                            <Switch

                                classes={{
                                    switchBase: classes.iOSSwitchBase,
                                    bar: classes.iOSBar,
                                    icon: classes.iOSIcon,
                                    iconChecked: classes.iOSIconChecked,
                                    checked: classes.iOSChecked,
                                }}
                                disableRipple
                                checked='true'
                                //onChange={this.handleLocalChangeToggle('checkedMeteo')}
                                value={this.props.valueMeteo}
                            />


                            <Tooltip id="tooltip-charts-view4" title="Газоаналитические данные">
                                <SvgIcon className={classes.icon}>
                                    <path d="M5,19A1,1 0 0,0 6,20H18A1,1 0 0,0 19,19C19,18.79 18.93,18.59
                                     18.82,18.43L13,8.35V4H11V8.35L5.18,18.43C5.07,18.59 5,18.79 5,19M6,22A3,3
                                      0 0,1 3,19C3,18.4 3.18,17.84 3.5,17.37L9,7.81V6A1,1 0 0,1 8,5V4A2,2 0 0,1 
                                      10,2H14A2,2 0 0,1 16,4V5A1,1 0 0,1 15,6V7.81L20.5,17.37C20.82,17.84 21,18.4 
                                      21,19A3,3 0 0,1 18,22H6M13,16L14.34,14.66L16.27,18H7.73L10.39,13.39L13,16M12.5,
                                      12A0.5,0.5 0 0,1 13,12.5A0.5,0.5 0 0,1 12.5,13A0.5,0.5 0 0,1 12,12.5A0.5,0.5 0 0,1 12.5,12Z" />
                                </SvgIcon>
                            </Tooltip>







                        </div>



                        <Snackbar
                            open={this.props.isLoading}
                            // TransitionComponent={<Slider direction="up" />}
                            autoHideDuration={4000}
                            onClose={this.props.handleClose}

                            message={<span id="message-id">{this.props.snack_msg}</span>}

                        />
                    </nav>
                </Paper> <br /></div >
        );
    }
}
//<MenuItem key={option} selected={option === 'Pyxis'} onClick={this.handleClose}>
//   {option}
// </MenuItem>



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
          showCheckboxes: state.showCheckboxes,
          height: state.height*/


    };
}

MenuReport.propTypes = {

    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(MenuReport);