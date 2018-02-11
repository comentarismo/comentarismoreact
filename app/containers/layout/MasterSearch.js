import React, {Component } from 'react';
import PropTypes from 'prop-types';
// import Title from 'react-title-component';
import AppBar from 'material-ui/AppBar';
// import IconButton from 'material-ui/IconButton';
import spacing from 'material-ui/styles/spacing';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {darkWhite, lightWhite, grey900} from 'material-ui/styles/colors';
import AppNavDrawer from './AppNavDrawer';
// import FullWidthSection from './FullWidthSection';
import withWidth, {MEDIUM, LARGE} from 'material-ui/utils/withWidth';
import LoginStore from 'store/LoginStore';
import config from 'config'
var host = config.API_URL;
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Link} from 'react-router';
import Helmet from "react-helmet";
var GIT_HASH = require("../../server/version.js").GIT_HASH;

import {Row} from 'react-styled-flexboxgrid';
import {Tabs, Tab} from 'material-ui/Tabs';

import {
    cyan500, cyan700,
    grey100, grey300, grey400, grey500,
    white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';

class MasterSearch extends Component {
    static propTypes = {
        children: PropTypes.node,
        location: PropTypes.object,
        width: PropTypes.number.isRequired,
    };

    static contextTypes = {
        router: PropTypes.object.isRequired,
    };

    static childContextTypes = {
        muiTheme: PropTypes.object,
    };

    state = {
        navDrawerOpen: false,
    };

    getChildContext() {
        return {
            muiTheme: this.state.muiTheme,
        };
    }

    componentWillMount() {
        this.setState({
            muiTheme: getMuiTheme({
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
                userAgent: global.navigator.userAgent || 'all'
            }),
        });
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
        this.setState({
            muiTheme: newMuiTheme,
        });
    }

    getStyles() {
        const styles = {
            appBar: {
                position: 'fixed',
                // Needed to overlap the examples
                zIndex: this.state.muiTheme.zIndex.appBar + 1,
                top: 0,
            },
            root: {
                paddingTop: spacing.desktopKeylineIncrement,
                minHeight: 400,
            },
            content: {
                margin: spacing.desktopGutter,
            },
            contentWhenMedium: {
                margin: `${spacing.desktopGutter * 2}px ${spacing.desktopGutter * 3}px`,
            },
            footer: {
                backgroundColor: grey900,
                textAlign: 'center',
            },
            a: {
                color: darkWhite,
            },
            p: {
                margin: '0 auto',
                padding: 0,
                color: lightWhite,
                maxWidth: 356,
            },
            browserstack: {
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                margin: '25px 15px 0',
                padding: 0,
                color: lightWhite,
                lineHeight: '25px',
                fontSize: 12,
            },
            browserstackLogo: {
                margin: '0 3px',
            },
            iconButton: {
                color: darkWhite,
            },

        };

        if (this.props.width === MEDIUM || this.props.width === LARGE) {
            styles.content = Object.assign(styles.content, styles.contentWhenMedium);
        }

        return styles;
    }

    handleTouchTapLeftIconButton = () => {
        this.setState({
            navDrawerOpen: !this.state.navDrawerOpen,
        });
    };

    handleChangeRequestNavDrawer = (open) => {
        this.setState({
            navDrawerOpen: open,
        });
    };

    handleChangeList = (event, value) => {
        this.context.router.push(value);
        this.setState({
            navDrawerOpen: false,
        });
    };

    handleChangeMuiTheme = (muiTheme) => {
        this.setState({
            muiTheme: muiTheme,
        });
    };
    
    showHome () {
        if (typeof window !== 'undefined') {
            window.location.href = '/'
        }
    }

    render() {
        const {
            location,
            children,
        } = this.props;

        let {
            navDrawerOpen,
        } = this.state;

        const {
            prepareStyles,
        } = this.state.muiTheme;

        const styles = this.getStyles();
        const title = '';

        let docked = false;
        let showMenuIconButton = true;

        if (this.props.width === LARGE) {
            docked = true;
            navDrawerOpen = true;
            showMenuIconButton = false;

            styles.navDrawer = {
                zIndex: styles.appBar.zIndex - 1,
            };
            styles.root.paddingLeft = 256;
            styles.footer.paddingLeft = 256;
        }

        return (
            <div>
                <Helmet
                    htmlAttributes={{"lang": "en"}} // amp takes no value
                    title="Latest news, world news, sports, business, comment, analysis and reviews from the world's leading liberal comments website."
                    titleTemplate="Comentarismo.com - %s"
                    meta={[
                        {"name": "description", "content": "Welcome to Comentarismo"},
                    ]}>
                   <script dangerouslySetInnerHTML={{
                     __html: `(function() {
                       if(‘serviceWorker’ in navigator) {
                        navigator.serviceWorker.register(‘/comentarismo-sw-file.js’);
                       }
                     })();`
                    }}/>
                </Helmet>
                
                <AppBar
                    onLeftIconButtonClick={this.handleTouchTapLeftIconButton}
                    title={ <a href="/#" onClick={this.showHome}
                                 style={{color: '#fff', textDecoration: 'none', float: 'left', fontSize: '16px'}}> C O M E N T A R I S M O </a>}
                    zDepth={0}
                    iconElementRight={ LoginStore.isLoggedIn() ?
                        <a href={`${host}/logout`} style={{color: '#fff !important', visited: '#fff !important'}} > Welcome back { LoginStore.user.username}! &#160;
                            <FlatButton backgroundColor='#fff' className="logout-button" label="Log out"/> </a> :
                        <a href={`${host}/login`} style={{color: '#fff !important', visited: '#fff !important'}}>
                            <FlatButton backgroundColor='#fff' rippleColor='#fff' className="login-button" label="Log In"/> </a> }

                    style={styles.appBar}
                    showMenuIconButton={showMenuIconButton}
                />
                <div style={{
                paddingTop: '64px',

                }}>{children}</div>
                <AppNavDrawer
                    style={styles.navDrawer}
                    location={location}
                    docked={docked}
                    onRequestChangeNavDrawer={this.handleChangeRequestNavDrawer}
                    onChangeList={this.handleChangeList}
                    open={navDrawerOpen}
                />
               
            </div>
        );
    }
}


MasterSearch.propTypes = {
    children: PropTypes.node,
    route: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {};
}

import {connect} from 'react-redux';


export default connect(
    mapStateToProps,
)(MasterSearch);