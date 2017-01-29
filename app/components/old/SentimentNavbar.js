'use strict';

var React = require('react');
import { Navbar,Nav,NavItem,NavDropdown,MenuItem } from 'react-bootstrap';

import config from 'config'
var host = config.API_URL;
var analytics = require('ga-browser')();
import LoginStore from 'store/LoginStore';

module.exports = React.createClass({
    displayName: 'MainNavbar',

    onError: function () {
        console.log('MainNavbar error - removing');
        this.getDOMNode().remove();
    },

    componentDidMount: function () {
        analytics('create', 'UA-51773618-1', 'auto');
        setInterval(function () {
            ga('send', 'event', 'ping', window.location.href, {}, 0)
        }, 20000);
    },

    render: function () {
        return (
            <Navbar inverse>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a className="navbar-brand" href="/"><img src="/static/img/comentarismo-extra-mini-logo.png"
                                                                  className="logo" alt="logo"/></a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
            </Navbar>
        );
    }
});
