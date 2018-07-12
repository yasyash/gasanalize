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

import CheckBox from '@material-ui/icons/CheckBox';
import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';

import canvas2pdf from 'canvas2pdf/src/canvas2pdf';

import { connect } from 'react-redux';



const ITEM_HEIGHT = 48;


const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    icon: {
        margin: theme.spacing.unit * 2,
        color: blue[600],
   
    },
    icon_mnu: {
        margin: theme.spacing.unit * 2,
        color: blue[600],
        margin: 0
   
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
});




class MenuChart extends Component {

    constructor(props) {
        let isNll = false;
        super(props);

        const { fixedHeader,

            isStation,
            isLoading,
            snack_msg,
            value,
            options,
            meteoOptions
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
            checked: []
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

    handlePdfClick = (name) => {

        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
          })
        
         // if (this.props.report_type == 'line_chart'){
                    var _html =  document.getElementById('line_chart');
                    var dom = document.createElement('line_chart');
         // };
        var cnvs =  document.getElementById("chartjs-render-monitor ");
        dom.operative_report = _html;
        //let pdfHTML = _html.childNodes[0];
        let canvas = doc.canvas;
        canvas.height = 210;
        canvas.width= 290;
        canvas.style= {width: 290, height: 210};
        
        const {dateTimeEnd} = this.state;
        //canvas.pdf = doc;
        
       // html2canvas(_html).then(function(_canvas) {
                   
        
        //});
        var opt = {
            margin:       15,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 5 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
          };

          var worker = html2pdf().from(_html.innerHTML).set(opt).save('Chart_'+new Date(dateTimeEnd).format('dd-MM-Y_H:mm')+'.pdf');
        
         

            
        }
   

    render() {

        const { classes } = this.props;
        const { anchorEl } = this.state;
        const { options } = this.state;
        const { meteoOptions } = this.state;

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
                            <div>
                                <Tooltip id="tooltip-charts-view" title="Отключение отображения графиков">

                                    <IconButton
                                        //menu begin
                                        color="primary"
                                        aria-label="Выбор графиков"
                                        aria-owns={anchorEl ? 'long-menu' : null}
                                        aria-haspopup="false"
                                        onClick={this.handleClick}
                                    >
                                        <MoreVertIcon className={classes.icon_mnu} />
                                    </IconButton></Tooltip>
                                <Menu
                                    id="long-menu"
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={this.handleClose}
                                    PaperProps={{
                                        style: {
                                            maxHeight: ITEM_HEIGHT * ((this.props.checkedMeteo && options.length)
                                            + (!this.props.checkedMeteo && 5) + 1),
                                            width: (this.props.checkedMeteo && 250)+(!this.props.checkedMeteo && 300),
                                        },
                                    }}
                                >

                                   {(options)&&
                                        options.map((option, i) => (this.props.checkedMeteo && 


                                        //<MenuItem key={option.chemical} onClick={this.handleClose.bind(this)}>
                                        <MenuItem key={'chart_menu_' + option.chemical}>

                                            <Checkbox
                                                key={option.chemical}
                                                checked={option.visible}
                                                color='primary'
                                                onChange={this.handleChange(option.chemical)}
                                                value={option.chemical}

                                            />{'график ' + option.chemical}
                                        </MenuItem>


                                        // 
                                    ))}
                                    { (meteoOptions)&&// if not empty
                                        meteoOptions.map((option, i) => (!this.props.checkedMeteo && 


                                        //<MenuItem key={option.chemical} onClick={this.handleClose.bind(this)}>
                                        <Tooltip key ={'tooltip_' + option.id} title={option.header}>

                                        <MenuItem key={'chart_meteo_' + option.id}>

                                            <Checkbox
                                                key={option.id}
                                                checked={option.visible}
                                                color='primary'
                                                onChange={this.handleChange(option.header)}
                                                value={option.header}

                                            />{'график ' + option.header}
                                        </MenuItem>
                                        </Tooltip  >

                                        // 
                                    ))
                                }

                                </Menu>
                            </div>


                        </div>

                        <div className={classes.root}>
                        <Tooltip id="tooltip-charts-topdf" title="Экспорт в PDF">
                            <IconButton className={classes.button} onClick = {this.handlePdfClick} aria-label="Экспорт в PDF">

                            <SvgIcon className={classes.icon}>
                                    <path  d="M14,9H19.5L14,3.5V9M7,2H15L21,8V20A2,2 0 0,1 19,22H7C5.89,22 
                                    5,21.1 5,20V4A2,2 0 0,1 7,2M11.93,12.44C12.34,13.34 12.86,14.08
                                     13.46,14.59L13.87,14.91C13,15.07 11.8,15.35 10.53,15.84V15.84L10.42,15.88L10.92,14.84C11.37,13.97
                                      11.7,13.18 11.93,12.44M18.41,16.25C18.59,16.07 18.68,15.84 18.69,15.59C18.72,15.39 18.67,15.2
                                       18.57,15.04C18.28,14.57 17.53,14.35 16.29,14.35L15,14.42L14.13,13.84C13.5,13.32 12.93,12.41 
                                       12.53,11.28L12.57,11.14C12.9,9.81 13.21,8.2 12.55,7.54C12.39,7.38 12.17,7.3 
                                       11.94,7.3H11.7C11.33,7.3 11,7.69 10.91,8.07C10.54,9.4 10.76,10.13 11.13,11.34V11.35C10.88,12.23
                                        10.56,13.25 10.05,14.28L9.09,16.08L8.2,16.57C7,17.32 6.43,18.16 6.32,18.69C6.28,18.88 6.3,19.05
                                         6.37,19.23L6.4,19.28L6.88,19.59L7.32,19.7C8.13,19.7 9.05,18.75 10.29,16.63L10.47,16.56C11.5,16.23
                                          12.78,16 14.5,15.81C15.53,16.32 16.74,16.55 17.5,16.55C17.94,16.55 18.24,16.44 
                                          18.41,16.25M18,15.54L18.09,15.65C18.08,15.75 18.05,15.76 18,15.78H17.96L17.77,15.8C17.31,15.8
                                           16.6,15.61 15.87,15.29C15.96,15.19 16,15.19 16.1,15.19C17.5,15.19 17.9,15.44 
                                           18,15.54M8.83,17C8.18,18.19 7.59,18.85 7.14,19C7.19,18.62 7.64,17.96
                                            8.35,17.31L8.83,17M11.85,10.09C11.62,9.19 11.61,8.46 
                                    11.78,8.04L11.85,7.92L12,7.97C12.17,8.21 12.19,8.53 12.09,9.07L12.06,9.23L11.9,10.05L11.85,10.09Z"/>
                                </SvgIcon>
                                </IconButton>
                            </Tooltip>

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
                                checked={this.props.checkedMeteo}
                                onChange={this.handleLocalChangeToggle('checkedMeteo')}
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






                            <Tooltip id="tooltip-charts-view1" title="Столбчатый график">

                                <SvgIcon className={classes.icon}>
                                    <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z" />
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
                                checked={this.props.checkedLine}
                                onChange={this.handleLocalChangeToggle('checkedLine')}
                                value={this.props.value}
                            />
                            <Tooltip id="tooltip-charts-view2" title="Линейный график">


                                <SvgIcon className={classes.icon}>
                                    <path d="M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z" />
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

MenuChart.propTypes = {

    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(MenuChart);