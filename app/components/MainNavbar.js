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
                <Navbar.Collapse>
                    <Nav pullRight>
                        <NavDropdown eventKey={3} title="Videos" id="basic-nav-dropdown">
                            <MenuItem eventKey={3.1} href="/topvideos/type/YouTubeVideo">Youtube</MenuItem>
                        </NavDropdown>

                        <NavDropdown eventKey={3} title="Products" id="basic-nav-dropdown">
                            <MenuItem eventKey={3.1} href="/product/genre/bestseller">Amazon Best Seller</MenuItem>
                        </NavDropdown>

                        <NavDropdown eventKey={3} title="World News" id="basic-nav-dropdown">
                            <NavDropdown eventKey={3} title="English" id="basic-nav-dropdown">
                                <NavDropdown eventKey={3} title="Categories" id="basic-nav-dropdown">
                                    <MenuItem eventKey={3.1} href="/news/genre/business">Business</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/football">Football</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/lifestyle">Lifestyle</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/motoring">Motoring</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/politics">Politics</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/ru_politics">Russian Politics</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/sports">Sports</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/technology">Technology</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/world">World</MenuItem>
                                </NavDropdown>
                                <NavDropdown eventKey={3} title="UK" id="basic-nav-dropdown">
                                    <MenuItem eventKey={3.1} href="/news/operator/bbcuk">BBC</MenuItem>
                                    <MenuItem eventKey={3.2} href="/news/operator/telegraph">Telegraph</MenuItem>
                                    <MenuItem eventKey={3.3} href="/news/operator/theguardian">Theguardian</MenuItem>
                                    <MenuItem eventKey={3.4} href="/news/operator/independentuk">Independent</MenuItem>
                                </NavDropdown>
                                <NavDropdown eventKey={3} title="US" id="basic-nav-dropdown">
                                    <MenuItem eventKey={3.5}
                                              href="/news/operator/washingtonpost">Washingtonpost</MenuItem>
                                    <MenuItem eventKey={3.6} href="/news/operator/cnn">CNN</MenuItem>
                                    <MenuItem eventKey={3.7} href="/news/operator/nytimes">NYTimes</MenuItem>
                                    <MenuItem eventKey={3.8} href="/news/operator/rt">RT</MenuItem>
                                </NavDropdown>
                                <MenuItem eventKey={3.1} href="/news/languages/english">English All</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={4} title="French" id="basic-nav-dropdown">
                                <NavDropdown eventKey={3} title="Categories" id="basic-nav-dropdown">
                                    <MenuItem eventKey={3.1} href="/news/genre/economie">Economie</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/fr_football">Football</MenuItem>
                                    <MenuItem eventKey={3.1}
                                              href="/news/genre/fr_international">International</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/fr_technology">Technology</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/politique">Politique</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/societe">Societe</MenuItem>
                                </NavDropdown>
                                <NavDropdown eventKey={3} title="France" id="basic-nav-dropdown">
                                    <MenuItem eventKey={4.1} href="/news/operator/lemonde">Lemonde</MenuItem>
                                    <MenuItem eventKey={4.2} href="/news/operator/lefigaro">Lefigaro</MenuItem>
                                </NavDropdown>
                                <MenuItem eventKey={3.1} href="/news/languages/french">French All</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={5} title="Spanish" id="basic-nav-dropdown">
                                <NavDropdown eventKey={3} title="Categories" id="basic-nav-dropdown">
                                    <MenuItem eventKey={3.1} href="/news/genre/es_ciencia">Ciencia</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/es_economia">Economia</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/es_futbol">Futbol</MenuItem>
                                    <MenuItem eventKey={3.1}
                                              href="/news/genre/es_internacional">Internacional</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/es_politica">Politica</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/es_tecnologia">Tecnologia</MenuItem>
                                </NavDropdown>
                                <NavDropdown eventKey={3} title="Spain" id="basic-nav-dropdown">
                                    <MenuItem eventKey={5.1} href="/news/operator/elpais">Elpais</MenuItem>
                                    <MenuItem eventKey={5.2} href="/news/operator/marca">Marca</MenuItem>
                                </NavDropdown>
                                <MenuItem eventKey={3.1} href="/news/languages/spanish">Spanish All</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={6} title="Italian" id="basic-nav-dropdown">
                                <NavDropdown eventKey={3} title="Categories" id="basic-nav-dropdown">
                                    <MenuItem eventKey={3.1} href="/news/genre/it_economia">Economia</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/it_politica">Politica</MenuItem>
                                </NavDropdown>
                                <NavDropdown eventKey={3} title="Italy" id="basic-nav-dropdown">
                                    <MenuItem eventKey={6.1} href="/news/operator/repubblica">La Repubblica</MenuItem>
                                </NavDropdown>
                                <MenuItem eventKey={3.1} href="/news/languages/italian">Italian All</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={7} title="Portuguese" id="basic-nav-dropdown">
                                <NavDropdown eventKey={3} title="Categories" id="basic-nav-dropdown">
                                    <MenuItem eventKey={3.1} href="/news/genre/economia">Economia</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/futebol">Futebol</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/mundo">Mundo</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/olimpiadas">Olimpiadas</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/politica">Politica</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/tecnologia">Tecnologia</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/brasil">Brasil</MenuItem>
                                </NavDropdown>
                                <NavDropdown eventKey={3} title="Brazil" id="basic-nav-dropdown">
                                    <MenuItem eventKey={7.1} href="/news/operator/g1">G1</MenuItem>
                                    <MenuItem eventKey={7.2} href="/news/operator/uol">UOL</MenuItem>
                                    <MenuItem eventKey={7.3} href="/news/operator/ultimosegundo">IG</MenuItem>
                                    <MenuItem eventKey={7.4}
                                              href="/news/operator/folhapolitica">FolhaPolitica</MenuItem>
                                    <MenuItem eventKey={7.5} href="/news/operator/cartacapital">CartaCapital</MenuItem>
                                    <MenuItem eventKey={7.6} href="/news/operator/jornalggn">JornalGGN</MenuItem>
                                </NavDropdown>
                                <MenuItem eventKey={3.1} href="/news/languages/portuguese">Portuguese All</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={7} title="Croatian" id="basic-nav-dropdown">
                                <NavDropdown eventKey={3} title="Categories" id="basic-nav-dropdown">
                                    <MenuItem eventKey={3.1} href="/news/genre/hr_auto">Auto</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/hr_black">Black</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/hr_sport">Sport</MenuItem>
                                    <MenuItem eventKey={3.1} href="/news/genre/hr_hot">Hot</MenuItem>
                                </NavDropdown>
                                <NavDropdown eventKey={3} title="Croatia" id="basic-nav-dropdown">
                                    <MenuItem eventKey={7.1} href="/news/operator/indexhr">Index.HR</MenuItem>
                                </NavDropdown>
                                <MenuItem eventKey={3.1} href="/news/languages/croatian">Croatian All</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={7} title="Russian" id="basic-nav-dropdown">
                                <NavDropdown eventKey={3} title="Categories" id="basic-nav-dropdown">
                                    <MenuItem eventKey={3.1} href="/news/genre/news">News</MenuItem>
                                </NavDropdown>
                                <NavDropdown eventKey={3} title="Russia" id="basic-nav-dropdown">
                                    <MenuItem eventKey={7.1}
                                              href="/news/operator/novayagazeta_ru">Novayagazeta</MenuItem>
                                </NavDropdown>
                                <MenuItem eventKey={3.1} href="/news/languages/russian">Russian All</MenuItem>
                            </NavDropdown>
                        </NavDropdown>
                        <NavDropdown eventKey={3} title="World Commentators" id="basic-nav-dropdown">
                            <NavDropdown eventKey={3} title="English" id="basic-nav-dropdown">
                                <NavDropdown eventKey={3} title="UK" id="basic-nav-dropdown">
                                    <MenuItem eventKey={3.1} href="/commentators/operator/bbcuk">BBC</MenuItem>
                                    <MenuItem eventKey={3.2}
                                              href="/commentators/operator/telegraph">Telegraph</MenuItem>
                                    <MenuItem eventKey={3.3}
                                              href="/commentators/operator/theguardian">Theguardian</MenuItem>
                                    <MenuItem eventKey={3.4}
                                              href="/commentators/operator/independentuk">Independent</MenuItem>
                                </NavDropdown>
                                <NavDropdown eventKey={3} title="US" id="basic-nav-dropdown">
                                    <MenuItem eventKey={3.5}
                                              href="/commentators/operator/washingtonpost">Washingtonpost</MenuItem>
                                    <MenuItem eventKey={3.6} href="/commentators/operator/cnn">CNN</MenuItem>
                                    <MenuItem eventKey={3.7} href="/commentators/operator/nytimes">NYTimes</MenuItem>
                                    <MenuItem eventKey={3.8} href="/commentators/operator/rt">RT</MenuItem>
                                </NavDropdown>
                                <MenuItem eventKey={3.1} href="/commentators/languages/english">English All</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={4} title="French" id="basic-nav-dropdown">
                                <NavDropdown eventKey={3} title="France" id="basic-nav-dropdown">
                                    <MenuItem eventKey={4.1} href="/commentators/operator/lemonde">Lemonde</MenuItem>
                                    <MenuItem eventKey={4.2} href="/commentators/operator/lefigaro">Lefigaro</MenuItem>
                                </NavDropdown>
                                <MenuItem eventKey={3.1} href="/commentators/languages/french">French All</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={5} title="Spanish" id="basic-nav-dropdown">
                                <NavDropdown eventKey={3} title="Spain" id="basic-nav-dropdown">
                                    <MenuItem eventKey={5.1} href="/commentators/operator/elpais">Elpais</MenuItem>
                                    <MenuItem eventKey={5.2} href="/commentators/operator/marca">Marca</MenuItem>
                                </NavDropdown>
                                <MenuItem eventKey={3.1} href="/commentators/languages/spanish">Spanish All</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={6} title="Italian" id="basic-nav-dropdown">
                                <NavDropdown eventKey={3} title="Italy" id="basic-nav-dropdown">
                                    <MenuItem eventKey={6.1} href="/commentators/operator/repubblica">La
                                        Repubblica</MenuItem>
                                </NavDropdown>
                                <MenuItem eventKey={3.1} href="/commentators/languages/italian">Italian All</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={7} title="Portuguese" id="basic-nav-dropdown">
                                <NavDropdown eventKey={3} title="Brazil" id="basic-nav-dropdown">
                                    <MenuItem eventKey={7.1} href="/commentators/operator/g1">G1</MenuItem>
                                    <MenuItem eventKey={7.1} href="/commentators/operator/uol">UOL</MenuItem>
                                    <MenuItem eventKey={7.1} href="/commentators/operator/ultimosegundo">IG</MenuItem>
                                    <MenuItem eventKey={7.1}
                                              href="/commentators/operator/folhapolitica">FolhaPolitica</MenuItem>
                                    <MenuItem eventKey={7.1}
                                              href="/commentators/operator/cartacapital">CartaCapital</MenuItem>
                                </NavDropdown>
                                <MenuItem eventKey={3.1} href="/commentators/languages/portuguese">Portuguese
                                    All</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={7} title="Croatian" id="basic-nav-dropdown">
                                <NavDropdown eventKey={3} title="Croatia" id="basic-nav-dropdown">
                                    <MenuItem eventKey={7.1} href="/commentators/operator/indexhr">Index.HR</MenuItem>
                                </NavDropdown>
                                <MenuItem eventKey={3.1} href="/commentators/languages/croatian">Croatian All</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={7} title="Russian" id="basic-nav-dropdown">
                                <NavDropdown eventKey={3} title="Russia" id="basic-nav-dropdown">
                                    <MenuItem eventKey={7.1}
                                              href="/commentators/operator/novayagazeta_ru">Novayagazeta</MenuItem>
                                </NavDropdown>
                                <MenuItem eventKey={3.1} href="/commentators/languages/russian">Russian All</MenuItem>
                            </NavDropdown>
                        </NavDropdown>

                        <NavItem eventKey={8} href={`${host}/login`}>
                            <span
                                className="mobile-show">{LoginStore.isLoggedIn() ? ''+LoginStore.user.username : 'Login'}
                            </span>
                        </NavItem>

                        <NavItem eventKey={9} href="https://comentarismo.on.spiceworks.com/portal" target="_blank"><span
                            className="mobile-show">Support</span></NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
});
