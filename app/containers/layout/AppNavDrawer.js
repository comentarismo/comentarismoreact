import React, {Component, PropTypes} from 'react';
import Drawer from 'material-ui/Drawer';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {spacing, typography, zIndex} from 'material-ui/styles';
import {cyan500} from 'material-ui/styles/colors';

import Menu from './Menu';

const SelectableList = makeSelectable(List);

const styles = {
    logo: {
        cursor: 'pointer',
        fontSize: 16,
        color: typography.textFullWhite,
        lineHeight: `${spacing.desktopKeylineIncrement}px`,
        fontWeight: typography.fontWeightLight,
        backgroundColor:  "#166e66",
        paddingLeft: spacing.desktopGutter,
        marginBottom: 8,
    },
    version: {
        paddingLeft: spacing.desktopGutterLess,
        fontSize: 14,
    },
};

class AppNavDrawer extends Component {
    static propTypes = {
        docked: PropTypes.bool.isRequired,
        location: PropTypes.object.isRequired,
        onChangeList: PropTypes.func.isRequired,
        onRequestChangeNavDrawer: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
        style: PropTypes.object,
    };

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
    };

    state = {
        muiVersions: [],
    };

    componentDidMount() {
        const self = this;
        const url = '/versions.json';
        const request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                self.setState({
                    muiVersions: JSON.parse(request.responseText),
                    version: JSON.parse(request.responseText)[0],
                });
            }
        };

        request.open('GET', url, true);
        request.send();
    }

    firstNonPreReleaseVersion() {
        let version;
        for (let i = 0; i < this.state.muiVersions.length; i++) {
            version = this.state.muiVersions[i];
            // If the version doesn't contain '-' and isn't 'HEAD'
            if (!/-/.test(version) && version !== 'HEAD') {
                break;
            }
        }
        return version;
    }

    handleVersionChange = (event, index, value) => {
        if (value === this.firstNonPreReleaseVersion()) {
            window.location = 'http://www.material-ui.com/';
        } else {
            window.location = `http://www.material-ui.com/${value}`;
        }
    };

    currentVersion() {
        if (window.location.hostname === 'localhost') return this.state.muiVersions[0];
        if (window.location.pathname === '/') {
            return this.firstNonPreReleaseVersion();
        } else {
            return window.location.pathname.replace(/\//g, '');
        }
    }

    handleRequestChangeLink = (event, value) => {
        window.location = value;
    };

    handleTouchTapHeader = () => {
        this.context.router.push('/');
        this.props.onRequestChangeNavDrawer(false);
    };

    render() {
        const {
            location,
            docked,
            onRequestChangeNavDrawer,
            onChangeList,
            open,
            style,
            route,
        } = this.props;

        return (
            <Drawer
                style={style}
                docked={docked}
                open={open}
                onRequestChange={onRequestChangeNavDrawer}
                containerStyle={{zIndex: zIndex.drawer - 100}}
            >
                <div style={styles.logo} onTouchTap={this.handleTouchTapHeader}>
                    C O M E N T A R I S M O
                </div>
                <Menu/>
            </Drawer>
        );
    }
}

export default AppNavDrawer;
