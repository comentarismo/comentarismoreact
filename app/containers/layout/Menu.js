import React, {PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import {Link} from 'react-router';
import DashboardIcon from 'material-ui/svg-icons/social/poll';
// import SettingsIcon from 'material-ui/svg-icons/social/domain';
import SearchIcon from 'material-ui/svg-icons/action/search';


const Menu = ({resources}) => (
    <Paper style={{
        flex: '0 0 15em', order: -1,
        position: 'fixed',
        zIndex: '1000',
        left: '0px',
        top: '50px',
        transform: 'translate(0px,0px)',
        overflow: 'auto',
        width: '256px',
        height: '100%',

    }}>
        <List>

            <a href={`/`}>
                <ListItem key="home" primaryText="Home"
                          leftIcon={<DashboardIcon/>}/>
            </a>

            <ListItem key="search" containerElement={<Link target="_blank" to={`/search`}/>}
                      primaryText="Search"
                      leftIcon={<SearchIcon/>}/>


            {/*<ListItem key="settings" containerElement={<Link to={`/settings`} />} primaryText="Settings" leftIcon={<SettingsIcon/>} />*/}
            <Paper style={{
                flex: '0 0 15em',
                order: -1,
                boxShadow: 'none !important',
                borderTop: '1px solid #919398 !important'
            }}>
                <List style={{padding: 0}}>
                </List>
            </Paper>

            <div style={{
                boxSizing: 'border-box',
                color: 'rgb(145, 147, 152)',
                fontSize: '14px',
                lineHeight: '48px',
                paddingLeft: '16px',
                width: '100%'
            }}>Sources
            </div>


            <a href={`/topvideos/type/YouTubeVideo`}>
                <ListItem primaryText="Youtube"
                          leftIcon={<img src="/static/img/sources/youtube.png"/>}/>
            </a>


            <a href={`/product/genre/bestseller`}>
                <ListItem primaryText="Amazon"
                          leftIcon={<img src="/static/img/sources/amazon.png"/>}/>
            </a>

            <a href={`/news/operator/bbcuk`}>
                <ListItem primaryText="BBC"
                          leftIcon={<img src="/static/img/sources/bbcuk.png"/>}/>
            </a>

            <a href={`/news/operator/telegraph`}>
                <ListItem primaryText="Telegraph"
                          leftIcon={<img src="/static/img/sources/telegraph.png"/>}/>
            </a>

            <a href={`/news/operator/theguardian`}>
                <ListItem primaryText="Theguardian"
                          leftIcon={<img src="/static/img/sources/theguardian.png"/>}/>
            </a>
            <a href={`/news/operator/independentuk`}>
                <ListItem primaryText="Independent UK"
                          leftIcon={<img src="/static/img/sources/independentuk.png"/>}/>
            </a>

            <a href={`/news/operator/washingtonpost`}>
                <ListItem primaryText="Washingtonpost"
                          leftIcon={<img src="/static/img/sources/washingtonpost.png"/>}/>
            </a>

            <a href={`/news/operator/cnn`}>
                <ListItem primaryText="CNN"
                          leftIcon={<img src="/static/img/sources/cnn.png"/>}/>
            </a>

            <a href={`/news/operator/nytimes`}>
                <ListItem primaryText="NY Times"
                          leftIcon={<img src="/static/img/sources/nytimes.png"/>}/>
            </a>

            <a href={`/news/operator/rt`}>
                <ListItem primaryText="RT"
                          leftIcon={<img src="/static/img/sources/rt.png"/>}/>
            </a>

            <a href={`/news/operator/lemonde`}>
                <ListItem primaryText="Lemonde"
                          leftIcon={<img src="/static/img/sources/lemonde.png"/>}/>
            </a>

            <a href={`/news/operator/lefigaro`}>
                <ListItem primaryText="Lefigaro"
                          leftIcon={<img src="/static/img/sources/lefigaro.png"/>}/>
            </a>

            <a href={`/news/operator/elpais`}>
                <ListItem primaryText="Elpais"
                          leftIcon={<img src="/static/img/sources/elpais.png"/>}/>
            </a>

            <a href={`/news/operator/marca`}>
                <ListItem primaryText="Marca"
                          leftIcon={<img src="/static/img/sources/marca.png"/>}/>
            </a>

            <a href={`/news/operator/repubblica`}>
                <ListItem primaryText="La Repubblica"
                          leftIcon={<img src="/static/img/sources/repubblica.png"/>}/>
            </a>
            <a href={`/news/operator/g1`}>
                <ListItem primaryText="G1"
                          leftIcon={<img src="/static/img/sources/g1.png"/>}/>
            </a>
            <a href={`/news/operator/uol`}>
                <ListItem primaryText="UOL"
                          leftIcon={<img src="/static/img/sources/uol.png"/>}/>
            </a>
            <a href={`/news/operator/ultimosegundo`}>
                <ListItem primaryText="IG"
                          leftIcon={<img src="/static/img/sources/ultimosegundo.png"/>}/>
            </a>

            <a href={`/news/operator/folhapolitica`}>
                <ListItem primaryText="FolhaPolitica"
                          leftIcon={<img src="/static/img/sources/folhapolitica.png"/>}/>
            </a>
            <a href={`/news/operator/cartacapital`}>
                <ListItem primaryText="CartaCapital"
                          leftIcon={<img src="/static/img/sources/cartacapital.png"/>}/>
            </a>
            <a href={`/news/operator/jornalggn`}>
                <ListItem primaryText="JornalGGN"
                          leftIcon={<img src="/static/img/sources/jornalggn.png"/>}/>
            </a>
            <a href={`/news/operator/indexhr`}>
                <ListItem primaryText="Index.HR"
                          leftIcon={<img src="/static/img/sources/indexhr.png"/>}/>
            </a>
            <a href={`/news/operator/novayagazeta_ru`}>
                <ListItem primaryText="Novayagazeta"
                          leftIcon={<img src="/static/img/sources/novayagazeta_ru.png"/>}/>
            </a>
            <ListItem containerElement={<Link to={`https://comentarismo.on.spiceworks.com/portal`} target="_blank"/>}
                      primaryText="Support" leftIcon={<DashboardIcon/>}/>


        </List>
    </Paper>
);

Menu.propTypes = {
    resources: PropTypes.array,
};

export default Menu;
