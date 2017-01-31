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
        router: PropTypes.object.isRequired,
    };
    //
    //
    // handleTouchTapHeader = () => {
    //     // this.context.router.push('/');
    //     this.props.onRequestChangeNavDrawer(false);
    // };

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
                <div style={styles.logo}>
                    C O M E N T A R I S M O
                </div>
                <Menu/>
            </Drawer>
        );
    }
}

export default AppNavDrawer;
