import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
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


import BarChart from '@material-ui/icons/Equalizer';
import TimeLine from '@material-ui/icons/Timeline';
import Switch from '@material-ui/core/Switch';
import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';

import { connect } from 'react-redux';
import timeline from 'material-ui/svg-icons/action/timeline';

/**
 * Three controlled examples, the first allowing a single selection, the second multiple selections,
 * the third using internal state.
 */
const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    icon: {
        margin: theme.spacing.unit * 2,
        color: blue[600]
    },
    iOSSwitchBase: {
        '&$iOSChecked': {
            color: theme.palette.common.white,
            '& + $iOSBar': {
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
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
    }
});


class MenuChart extends Component {

    constructor(props) {
        let isNll = false;
        super(props);

        const { fixedHeader,

            isStation,
            isLoading,
            snack_msg,
            value
        } = props;

        if (isStation) { isNll = true }

        this.state = {

            isStation: isNll,
            isLoading,
            snack_msg,
            value
        };




        // this.handleClose = this.handleClose.bind (this);

    }


    render() {

        const { classes } = this.props;

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



                        </div>

                        <div className={classes.root}>

                            <BarChart className={classes.icon} />

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
                                onChange={this.props.handleChangeToggle}
                                value={this.props.value}
                            />
                            <TimeLine className={classes.icon} />




                        </div>
                        <Snackbar
                            open={this.props.isLoading}
                            // TransitionComponent={<Slider direction="up" />}
                            autoHideDuration={4000}
                            onClose={this.props.handleClose}

                            message={<span id="message-id">{this.props.snack_msg}</span>}

                        />
                    </nav>
                </Paper><br /></div>
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
          showCheckboxes: state.showCheckboxes,
          height: state.height*/


    };
}

MenuChart.propTypes = {

    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(MenuChart);