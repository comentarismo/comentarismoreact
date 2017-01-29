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

            <ListItem key="home" containerElement={<Link to={`/`}/>} primaryText="Home"
                      leftIcon={<DashboardIcon/>}/>


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
                lineHeight: 500,
                lineHeight: '48px',
                paddingLeft: '16px',
                width: '100%'
            }}>Sources
            </div>


            <ListItem containerElement={<Link to={`/topvideos/type/YouTubeVideo`}/>} primaryText="Youtube"
                      leftIcon={<img src="/static/img/sources/youtube.png"/>}/>


            <ListItem containerElement={<Link to={`/product/genre/bestseller`}/>}
                      primaryText="Amazon"
                      leftIcon={<img src="/static/img/sources/amazon.png"/>}/>

            <ListItem containerElement={<Link to={`/news/operator/bbcuk`}/>} primaryText="BBC"
                      leftIcon={<img src="/static/img/sources/bbcuk.png"/>}/>

            <ListItem containerElement={<Link to={`/news/operator/telegraph`}/>} primaryText="Telegraph"
                      leftIcon={<img src="/static/img/sources/telegraph.png"/>}/>

            <ListItem containerElement={<Link to={`/news/operator/theguardian`}/>} primaryText="Theguardian"
                      leftIcon={<img src="/static/img/sources/theguardian.png"/>}/>

            <ListItem containerElement={<Link to={`/news/operator/independentuk`}/>}
                      primaryText="Independent UK"
                      leftIcon={<img src="/static/img/sources/independentuk.png"/>}/>

            <ListItem
                containerElement={<Link to={`/news/operator/washingtonpost`}/>} primaryText="Washingtonpost"
                leftIcon={<img src="/static/img/sources/washingtonpost.png"/>}/>

            <ListItem containerElement={<Link to={`/news/operator/cnn`}/>} primaryText="CNN"
                      leftIcon={<img src="/static/img/sources/cnn.png"/>}/>

            <ListItem containerElement={<Link to={`/news/operator/nytimes`}/>} primaryText="NY Times"
                      leftIcon={<img src="/static/img/sources/nytimes.png"/>}/>

            <ListItem containerElement={<Link to={`/news/operator/rt`}/>} primaryText="RT"
                      leftIcon={<img src="/static/img/sources/rt.png"/>}/>

            <ListItem containerElement={<Link to={`/news/operator/lemonde`}/>} primaryText="Lemonde"
                      leftIcon={<img src="/static/img/sources/lemonde.png"/>}/>

            <ListItem containerElement={<Link to={`/news/operator/lefigaro`}/>} primaryText="Lefigaro"
                      leftIcon={<img src="/static/img/sources/lefigaro.png"/>}/>

            <ListItem containerElement={<Link to={`/news/operator/elpais`}/>} primaryText="Elpais"
                      leftIcon={<img src="/static/img/sources/elpais.png"/>}/>
            <ListItem containerElement={<Link to={`/news/operator/marca`}/>} primaryText="Marca"
                      leftIcon={<img src="/static/img/sources/marca.png"/>}/>

            <ListItem containerElement={<Link to={`/news/operator/repubblica`}/>} primaryText="La Repubblica"
                      leftIcon={<img src="/static/img/sources/repubblica.png"/>}/>
            <ListItem containerElement={<Link to={`/news/operator/g1`}/>} primaryText="G1"
                      leftIcon={<img src="/static/img/sources/g1.png"/>}/>
            <ListItem containerElement={<Link to={`/news/operator/uol`}/>} primaryText="UOL"
                      leftIcon={<img src="/static/img/sources/uol.png"/>}/>
            <ListItem containerElement={<Link to={`/news/operator/ultimosegundo`}/>} primaryText="IG"
                      leftIcon={<img src="/static/img/sources/ultimosegundo.png"/>}/>
            <ListItem
                containerElement={<Link to={`/news/operator/folhapolitica`}/>} primaryText="FolhaPolitica"
                leftIcon={<img src="/static/img/sources/folhapolitica.png"/>}/>
            <ListItem containerElement={<Link to={`/news/operator/cartacapital`}/>} primaryText="CartaCapital"
                      leftIcon={<img src="/static/img/sources/cartacapital.png"/>}/>
            <ListItem containerElement={<Link to={`/news/operator/jornalggn`}/>} primaryText="JornalGGN"
                      leftIcon={<img src="/static/img/sources/jornalggn.png"/>}/>
            <ListItem containerElement={<Link to={`/news/operator/indexhr`}/>} primaryText="Index.HR"
                      leftIcon={<img src="/static/img/sources/indexhr.png"/>}/>

            <ListItem
                containerElement={<Link to={`/news/operator/novayagazeta_ru`}/>} primaryText="Novayagazeta"
                leftIcon={<img src="/static/img/sources/novayagazeta_ru.png"/>}/>

            <ListItem containerElement={<Link to={`https://comentarismo.on.spiceworks.com/portal`} target="_blank"/>}
                      primaryText="Support" leftIcon={<DashboardIcon/>}/>


        </List>
    </Paper>
);

Menu.propTypes = {
    resources: PropTypes.array,
};

export default Menu;
