'use strict';

var React = require('react');
import { Navbar,Nav,NavItem,NavDropdown,MenuItem } from 'react-bootstrap';
var analytics = require('ga-browser')();

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
                    <Nav>
                        <NavDropdown eventKey={3} title="Play World News & Headlines" id="basic-nav-dropdown">
                            <NavDropdown eventKey={3} title="English" id="basic-nav-dropdown">
                                <NavDropdown eventKey={3} title="Categories" id="basic-nav-dropdown">
                                    <MenuItem eventKey={3.1} href="/play/genre/business/0/50/">Play Business</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/football/0/50/">Play Football</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/lifestyle/0/50/">Play Lifestyle</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/motoring/0/50/">Play Motoring</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/politics/0/50/">Play Politics</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/ru_politics/0/50/">Play Russian Politics</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/sports/0/50/">Play Sports</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/technology/0/50/">Play Technology</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/world/0/50/">Play World</MenuItem>
                                </NavDropdown>
                                <NavDropdown eventKey={3} title="UK" id="basic-nav-dropdown">
                                    <MenuItem eventKey={3.1} href="/play/operator/bbcuk/0/50/">Play BBC</MenuItem>
                                    <MenuItem eventKey={3.2} href="/play/operator/telegraph/0/50/">Play Telegraph</MenuItem>
                                    <MenuItem eventKey={3.3} href="/play/operator/theguardian/0/50/">Play Theguardian</MenuItem>
                                    <MenuItem eventKey={3.4} href="/play/operator/independentuk/0/50/">Play Independent</MenuItem>
                                </NavDropdown>
                                <NavDropdown eventKey={3} title="US" id="basic-nav-dropdown">
                                    <MenuItem eventKey={3.5}
                                              href="/play/operator/washingtonpost/0/50/">Play Washingtonpost</MenuItem>
                                    <MenuItem eventKey={3.6} href="/play/operator/cnn/0/50/">Play CNN</MenuItem>
                                    <MenuItem eventKey={3.7} href="/play/operator/nytimes/0/50/">Play NYTimes</MenuItem>
                                    <MenuItem eventKey={3.8} href="/play/operator/rt/0/50/">Play RT</MenuItem>
                                </NavDropdown>
                                <MenuItem eventKey={3.1} href="/play/languages/english/0/50/">Play English All</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={4} title="French" id="basic-nav-dropdown">
                                <NavDropdown eventKey={3} title="Categories" id="basic-nav-dropdown">
                                    <MenuItem eventKey={3.1} href="/play/genre/economie/0/50/">Play Economie</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/fr_football/0/50/">Play Football</MenuItem>
                                    <MenuItem eventKey={3.1}
                                              href="/play/genre/fr_international">Play International</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/fr_technology/0/50/">Play Technology</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/politique/0/50/">Play Politique</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/societe/0/50/">Play Societe</MenuItem>
                                </NavDropdown>
                                <NavDropdown eventKey={3} title="France" id="basic-nav-dropdown">
                                    <MenuItem eventKey={4.1} href="/play/operator/lemonde/0/50/">Play Lemonde</MenuItem>
                                    <MenuItem eventKey={4.2} href="/play/operator/lefigaro/0/50/">Play Lefigaro</MenuItem>
                                </NavDropdown>
                                <MenuItem eventKey={3.1} href="/play/languages/french/0/50/">Play French All</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={5} title="Spanish" id="basic-nav-dropdown">
                                <NavDropdown eventKey={3} title="Categories" id="basic-nav-dropdown">
                                    <MenuItem eventKey={3.1} href="/play/genre/es_ciencia/0/50/">Play Ciencia</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/es_economia/0/50/">Play Economia</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/es_futbol/0/50/">Play Futbol</MenuItem>
                                    <MenuItem eventKey={3.1}
                                              href="/play/genre/es_internacional/0/50/">Play Internacional</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/es_politica/0/50/">Play Politica</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/es_tecnologia/0/50/">Play Tecnologia</MenuItem>
                                </NavDropdown>
                                <NavDropdown eventKey={3} title="Spain" id="basic-nav-dropdown">
                                    <MenuItem eventKey={5.1} href="/play/operator/elpais/0/50/">Play Elpais</MenuItem>
                                    <MenuItem eventKey={5.2} href="/play/operator/marca/0/50/">Play Marca</MenuItem>
                                </NavDropdown>
                                <MenuItem eventKey={3.1} href="/news/languages/spanish/0/50/">Play Spanish All</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={6} title="Italian" id="basic-nav-dropdown">
                                <NavDropdown eventKey={3} title="Categories" id="basic-nav-dropdown">
                                    <MenuItem eventKey={3.1} href="/play/genre/it_economia/0/50/">Play Economia</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/it_politica/0/50/">Play Politica</MenuItem>
                                </NavDropdown>
                                <NavDropdown eventKey={3} title="Italy" id="basic-nav-dropdown">
                                    <MenuItem eventKey={6.1} href="/play/operator/repubblica/0/50/">Play La Repubblica</MenuItem>
                                </NavDropdown>
                                <MenuItem eventKey={3.1} href="/play/languages/italian/0/50/">Play Italian All</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={7} title="Portuguese" id="basic-nav-dropdown">
                                <NavDropdown eventKey={3} title="Categories" id="basic-nav-dropdown">
                                    <MenuItem eventKey={3.1} href="/play/genre/economia/0/50/">Play Economia</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/futebol/0/50/">Play Futebol</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/mundo/0/50/">Play Mundo</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/olimpiadas/0/50/">Play Olimpiadas</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/politica/0/50/">Play Politica</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/tecnologia/0/50/">Play Tecnologia</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/brasil/0/50/">Play Brasil</MenuItem>
                                </NavDropdown>
                                <NavDropdown eventKey={3} title="Brazil" id="basic-nav-dropdown">
                                    <MenuItem eventKey={7.1} href="/play/operator/g1/0/50/">Play G1</MenuItem>
                                    <MenuItem eventKey={7.1} href="/play/operator/uol/0/50/">Play UOL</MenuItem>
                                    <MenuItem eventKey={7.1} href="/play/operator/ultimosegundo/0/50/">Play IG</MenuItem>
                                    <MenuItem eventKey={7.1}
                                              href="/play/operator/folhapolitica">Play FolhaPolitica</MenuItem>
                                    <MenuItem eventKey={7.1} href="/play/operator/cartacapital">Play CartaCapital</MenuItem>
                                </NavDropdown>
                                <MenuItem eventKey={3.1} href="/play/languages/portuguese/0/50/">Play Portuguese All</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={7} title="Croatian" id="basic-nav-dropdown">
                                <NavDropdown eventKey={3} title="Categories" id="basic-nav-dropdown">
                                    <MenuItem eventKey={3.1} href="/play/genre/hr_auto/0/50/">Play Auto</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/hr_black/0/50/">Play Black</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/hr_sport/0/50/">Play Sport</MenuItem>
                                    <MenuItem eventKey={3.1} href="/play/genre/hr_hot/0/50/">Play Hot</MenuItem>
                                </NavDropdown>
                                <NavDropdown eventKey={3} title="Croatia" id="basic-nav-dropdown">
                                    <MenuItem eventKey={7.1} href="/play/operator/indexhr/0/50/">Play Index.HR</MenuItem>
                                </NavDropdown>
                                <MenuItem eventKey={3.1} href="/play/languages/croatian/0/50/">Play Croatian All</MenuItem>
                            </NavDropdown>
                            <NavDropdown eventKey={7} title="Russian" id="basic-nav-dropdown">
                                <NavDropdown eventKey={3} title="Categories" id="basic-nav-dropdown">
                                    <MenuItem eventKey={3.1} href="/play/genre/news/0/50/">Play News</MenuItem>
                                </NavDropdown>
                                <NavDropdown eventKey={3} title="Russia" id="basic-nav-dropdown">
                                    <MenuItem eventKey={7.1}
                                              href="/play/operator/novayagazeta_ru/0/50/">Play Novayagazeta</MenuItem>
                                </NavDropdown>
                                <MenuItem eventKey={3.1} href="/play/languages/russian/0/50/">Play Russian All</MenuItem>
                            </NavDropdown>
                        </NavDropdown>

                    </Nav>
                    <Nav pullRight>
                        <NavItem eventKey={9} href="/"><span
                            className="mobile-show">Exit Play Mode</span></NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
});
