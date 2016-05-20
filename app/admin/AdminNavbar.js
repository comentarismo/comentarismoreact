'use strict';

var React = require('react');
import { Navbar,Nav,NavItem,NavDropdown,MenuItem } from 'react-bootstrap';

import config from 'config'
var host = config.API_URL;
var analytics = require('ga-browser')();
import LoginStore from 'store/LoginStore';

module.exports = React.createClass({
    displayName: 'AdminNavbar',

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
                                                                  className="logo" alt="logo"/>ADMIN</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>

                        <NavDropdown eventKey={1} title="Users" id="basic-nav-dropdown">
                            <MenuItem eventKey={1.1} href="/admin/l/user/provider/google/0/50/name">Google</MenuItem>
                            <MenuItem eventKey={1.2} href="/admin/l/user/provider/facebook/0/50/name">Facebook</MenuItem>
                            <MenuItem eventKey={1.3} href="/admin/l/user/provider/twitter/0/50/name">Twitter</MenuItem>
                            <MenuItem eventKey={1.4} href="/admin/l/user/provider/github/0/50/name">GitHub</MenuItem>
                        </NavDropdown>

                        <NavDropdown eventKey={1} title="Commentators" id="basic-nav-dropdown">
                            <MenuItem eventKey={1.1} href="/admin/l/commentator/languages/english/0/50/maxdate">English</MenuItem>
                            <MenuItem eventKey={1.2} href="/admin/l/commentator/languages/spanish/0/50/maxDate">Spanish</MenuItem>
                            <MenuItem eventKey={1.3} href="/admin/l/commentator/languages/french/0/50/maxDate">French</MenuItem>
                            <MenuItem eventKey={1.4} href="/admin/l/commentator/languages/italian/0/50/maxDate">Italian</MenuItem>
                            <MenuItem eventKey={1.4} href="/admin/l/commentator/languages/portuguese/0/50/maxDate">Portuguese</MenuItem>
                            <MenuItem eventKey={1.4} href="/admin/l/commentator/languages/croatian/0/50/maxDate">Croatian</MenuItem>
                            <MenuItem eventKey={1.4} href="/admin/l/commentator/languages/russian/0/50/maxDate">Russian</MenuItem>
                        </NavDropdown>

                        <NavDropdown eventKey={1} title="News" id="basic-nav-dropdown">
                            <MenuItem eventKey={1.1} href="/admin/l/news/languages/english/0/50/date">English</MenuItem>
                            <MenuItem eventKey={1.2} href="/admin/l/news/languages/spanish/0/50/date">Spanish</MenuItem>
                            <MenuItem eventKey={1.3} href="/admin/l/news/languages/french/0/50/date">French</MenuItem>
                            <MenuItem eventKey={1.4} href="/admin/l/news/languages/italian/0/50/date">Italian</MenuItem>
                            <MenuItem eventKey={1.4} href="/admin/l/news/languages/portuguese/0/50/date">Portuguese</MenuItem>
                            <MenuItem eventKey={1.4} href="/admin/l/news/languages/croatian/0/50/date">Croatian</MenuItem>
                            <MenuItem eventKey={1.4} href="/admin/l/news/languages/russian/0/50/date">Russian</MenuItem>
                        </NavDropdown>

                        <NavDropdown eventKey={1} title="Commentaries" id="basic-nav-dropdown">
                            <MenuItem eventKey={1.1} href="/admin/l/commentaries/languages/english/0/50/date">English</MenuItem>
                            <MenuItem eventKey={1.2} href="/admin/l/commentaries/languages/spanish/0/50/date">Spanish</MenuItem>
                            <MenuItem eventKey={1.3} href="/admin/l/commentaries/languages/french/0/50/date">French</MenuItem>
                            <MenuItem eventKey={1.4} href="/admin/l/commentaries/languages/italian/0/50/date">Italian</MenuItem>
                            <MenuItem eventKey={1.4} href="/admin/l/commentaries/languages/portuguese/0/50/date">Portuguese</MenuItem>
                            <MenuItem eventKey={1.4} href="/admin/l/commentaries/languages/croatian/0/50/date">Croatian</MenuItem>
                            <MenuItem eventKey={1.4} href="/admin/l/commentaries/languages/russian/0/50/date">Russian</MenuItem>
                        </NavDropdown>


                    </Nav>
                    <Nav pullRight>
                        <NavItem eventKey={8} href={`${host}/login`}>
                            <span
                                className="mobile-show">{LoginStore.isLoggedIn() ? ''+LoginStore.user.username : 'Login'}
                            </span>
                        </NavItem>
                    </Nav>
                    <Nav pullRight>
                        <NavItem eventKey={9} href="https://comentarismo.on.spiceworks.com/portal" target="_blank"><span
                            className="mobile-show">Support</span></NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
});
