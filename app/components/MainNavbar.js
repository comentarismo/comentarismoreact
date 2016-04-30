'use strict';

var React = require('react');
import { Navbar,Nav,NavItem,NavDropdown,MenuItem } from 'react-bootstrap';

module.exports = React.createClass({
    displayName: 'MainNavbar',

    onError: function () {
        console.log('MainNavbar error - removing');
        this.getDOMNode().remove();
    },

    componentDidMount: function () {
    },

    render: function () {
        return (
            <Navbar inverse>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a className="navbar-brand" href="/"><img src="/static/img/comentarismo-extra-mini-logo.png" className="logo" alt="logo"/></a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavDropdown eventKey={3} title="World News & Headlines" id="basic-nav-dropdown">
                            <NavDropdown eventKey={3} title="English" id="basic-nav-dropdown">
                                <MenuItem eventKey={3.1} href="/news/operator/bbcuk">UK - BBC</MenuItem>
                                <MenuItem eventKey={3.2} href="/news/operator/telegraph">UK - Telegraph</MenuItem>
                                <MenuItem eventKey={3.3} href="/news/operator/theguardian">UK - Theguardian</MenuItem>
                                <MenuItem eventKey={3.4} href="/news/operator/independentuk">UK - Independent</MenuItem>
                                <MenuItem eventKey={3.5} href="/news/operator/washingtonpost">US - Washingtonpost</MenuItem>
                                <MenuItem eventKey={3.6} href="/news/operator/cnn">US - CNN</MenuItem>
                                <MenuItem eventKey={3.7} href="/news/operator/nytimes">US - NYTimes</MenuItem>
                                <MenuItem eventKey={3.8} href="/news/operator/rt">US - RT</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={4} title="French" id="basic-nav-dropdown">
                                <MenuItem eventKey={4.1} href="/news/operator/lemonde">France - Lemonde</MenuItem>
                                <MenuItem eventKey={4.2} href="/news/operator/lefigaro">France - Lefigaro</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={5} title="Spanish" id="basic-nav-dropdown">
                                <MenuItem eventKey={5.1} href="/news/operator/elpais">Spain - Elpais</MenuItem>
                                <MenuItem eventKey={5.2} href="/news/operator/marca">Spain - Marca</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={6} title="Italian" id="basic-nav-dropdown">
                                <MenuItem eventKey={6.1} href="/news/operator/repubblica">Italy - La Repubblica</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={7} title="Portuguese" id="basic-nav-dropdown">
                                <MenuItem eventKey={7.1} href="/news/operator/g1">Brazil - G1</MenuItem>
                                <MenuItem eventKey={7.1} href="/news/operator/uol">Brazil - UOL</MenuItem>
                                <MenuItem eventKey={7.1} href="/news/operator/ultimosegundo">Brazil - IG</MenuItem>
                                <MenuItem eventKey={7.1} href="/news/operator/folhapolitica">Brazil - FolhaPolitica</MenuItem>
                                <MenuItem eventKey={7.1} href="/news/operator/cartacapital">Brazil - CartaCapital</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={7} title="Croatian" id="basic-nav-dropdown">
                                <MenuItem eventKey={7.1} href="/news/operator/indexhr">Index.HR</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={7} title="Russian" id="basic-nav-dropdown">
                                <MenuItem eventKey={7.1} href="/news/operator/novayagazeta_ru">Novayagazeta</MenuItem>
                            </NavDropdown>
                        </NavDropdown>
                        <NavDropdown eventKey={3} title="World Commentator List" id="basic-nav-dropdown">
                            <NavDropdown eventKey={3} title="English" id="basic-nav-dropdown">
                                <MenuItem eventKey={3.1} href="/commentators/operator/bbcuk">UK - BBC</MenuItem>
                                <MenuItem eventKey={3.2} href="/commentators/operator/telegraph">UK - Telegraph</MenuItem>
                                <MenuItem eventKey={3.3} href="/commentators/operator/theguardian">UK - Theguardian</MenuItem>
                                <MenuItem eventKey={3.4} href="/commentators/operator/independentuk">UK - Independent</MenuItem>
                                <MenuItem eventKey={3.5} href="/commentators/operator/washingtonpost">US - Washingtonpost</MenuItem>
                                <MenuItem eventKey={3.6} href="/commentators/operator/cnn">US - CNN</MenuItem>
                                <MenuItem eventKey={3.7} href="/commentators/operator/nytimes">US - NYTimes</MenuItem>
                                <MenuItem eventKey={3.8} href="/commentators/operator/rt">US - RT</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={4} title="French" id="basic-nav-dropdown">
                                <MenuItem eventKey={4.1} href="/commentators/operator/lemonde">France - Lemonde</MenuItem>
                                <MenuItem eventKey={4.2} href="/commentators/operator/lefigaro">France - Lefigaro</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={5} title="Spanish" id="basic-nav-dropdown">
                                <MenuItem eventKey={5.1} href="/commentators/operator/elpais">Spain - Elpais</MenuItem>
                                <MenuItem eventKey={5.2} href="/commentators/operator/marca">Spain - Marca</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={6} title="Italian" id="basic-nav-dropdown">
                                <MenuItem eventKey={6.1} href="/commentators/operator/repubblica">Italy - La Repubblica</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={7} title="Portuguese" id="basic-nav-dropdown">
                                <MenuItem eventKey={7.1} href="/commentators/operator/g1">Brazil - G1</MenuItem>
                                <MenuItem eventKey={7.1} href="/commentators/operator/uol">Brazil - UOL</MenuItem>
                                <MenuItem eventKey={7.1} href="/commentators/operator/ultimosegundo">Brazil - IG</MenuItem>
                                <MenuItem eventKey={7.1} href="/commentators/operator/folhapolitica">Brazil - FolhaPolitica</MenuItem>
                                <MenuItem eventKey={7.1} href="/commentators/operator/cartacapital">Brazil - CartaCapital</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={7} title="Croatian" id="basic-nav-dropdown">
                                <MenuItem eventKey={7.1} href="/commentators/operator/indexhr">Index.HR</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={7} title="Russian" id="basic-nav-dropdown">
                                <MenuItem eventKey={7.1} href="commentators/operator/novayagazeta_ru">Novayagazeta</MenuItem>
                            </NavDropdown>
                        </NavDropdown>
                    </Nav>
                    <Nav pullRight>
                        <NavItem eventKey={9} href="https://comentarismo.on.spiceworks.com/portal" target="_blank"><span className="mobile-show">Support</span></NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
});
