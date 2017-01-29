import React, {PropTypes} from 'react';
import Menu from './Menu';

import {connect} from 'react-redux';
import {Link} from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {fade} from 'material-ui/utils/colorManipulator';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import config from 'config'
var host = config.API_URL;

import {
    cyan500, cyan700,
    grey100, grey300, grey400, grey500,
    white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';

import LoginStore from 'store/LoginStore';
import FlatButton from 'material-ui/FlatButton';

const muiTheme = getMuiTheme({
    datePicker: {
        selectColor: "#166e66"
    },
    fontFamily: 'Open Sans, sans-serif !important',
    palette: {
        primary1Color: "#166e66",
        primary2Color: cyan700,
        primary3Color: grey400,
        accent1Color: "#d75c59",
        accent2Color: grey100,
        accent3Color: grey500,
        textColor: darkBlack,
        alternateTextColor: white,
        canvasColor: white,
        borderColor: grey300,
        disabledColor: fade(darkBlack, 0.3),
        pickerHeaderColor: cyan500,
        clockCircleColor: fade(darkBlack, 0.07),
        shadowColor: fullBlack,
    },
    appBar: {
        height: 50,
    },
    userAgent: 'all'
});

const Layout = ({isLoading, children, route, myuser}) => (
    <MuiThemeProvider muiTheme={muiTheme}>
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
            <AppBar style={{position: 'fixed', top: 0, left: 0}}
                    title={<Link to="/"
                                 style={{color: '#fff', textDecoration: 'none', float: 'left', fontSize: '16px'}}> C
                        O M E N T A R I S M O </Link>}
                    iconElementRight={ LoginStore.isLoggedIn() ?
                        <a href={`${host}/logout`} style={{color: '#fff'}}> Welcome back { LoginStore.user.username} !
                            <FlatButton className="logout-button" label="Log out"/> </a> :
                        <a href={`${host}/login`} style={{color: '#fff'}}>
                            <FlatButton className="login-button" label="Log In"/> </a> }/>
            <div className="body" style={{display: 'flex', flex: '1', backgroundColor: '#edecec'}}>
                <Card style={{
                    flex: 1,
                    border: 0,
                    paddingTop: '4%',
                    paddingLeft: '20%',
                }}>{children}</Card>
                <Menu resources={route.resources}/>
            </div>
        </div>
    </MuiThemeProvider>
);

Layout.propTypes = {
    children: PropTypes.node,
    route: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
)(Layout);
