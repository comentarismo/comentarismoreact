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
        top: '64px',
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

            <ListItem key="search" containerElement={<Link to={`/search`}/>}
                      primaryText="Search"
                      leftIcon={<SearchIcon/>}/>
    
            <a href={`https://comentarismo.on.spiceworks.com/portal`}
               target="_blank">
                <ListItem primaryText="Support" leftIcon={<DashboardIcon/>}/>
            </a>


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
            }}>CryptoCurrency News (EN)
            </div>
            
             <a href={`/news/operator/newsbitcoin`}>
                <ListItem primaryText="Bitcoin.com"
                          leftIcon={<img src="/static/img/sources/newsbitcoin.png"/>}/>
            </a>
             <a href={`/news/operator/coindesk`}>
                <ListItem primaryText="CoinDesk"
                          leftIcon={<img src="/static/img/sources/coindesk.png"/>}/>
            </a>
            <a href={`/news/operator/bitconnect`}>
                <ListItem primaryText="BitConnect"
                          leftIcon={<img src="/static/img/sources/bitconnect.png"/>}/>
            </a>
            <a href={`/news/operator/cointelegraph`}>
                <ListItem primaryText="CoinTelegraph"
                          leftIcon={<img src="/static/img/sources/cointelegraph.png"/>}/>
            </a>
            
             <a href={`/product/operator/cryptocompare`}>
                <ListItem primaryText="CryptoCompare"
                          leftIcon={<img src="/static/img/sources/cryptocompare.png"/>}/>
            </a>
            
            <a href={`/news/operator/deepdotweb`}>
                <ListItem primaryText="DeepDotWeb"
                          leftIcon={<img src="/static/img/sources/deepdotweb.png"/>}/>
            </a>
            
            <a href={`/news/operator/techcrunch`}>
                <ListItem primaryText="TechCrunch"
                          leftIcon={<img src="/static/img/sources/techcrunch.png"/>}/>
            </a>
            <a href={`/news/operator/economictimes`}>
                <ListItem primaryText="TheEconomicTimes"
                          leftIcon={<img src="/static/img/sources/economictimes.png"/>}/>
            </a>
            <a href={`/news/operator/bit-media`}>
                <ListItem primaryText="Bit-Media"
                          leftIcon={<img src="/static/img/sources/bit-media.png"/>}/>
            </a>
            <a href={`/news/operator/thenextweb`}>
                <ListItem primaryText="TheNextWeb"
                          leftIcon={<img src="/static/img/sources/thenextweb.png"/>}/>
            </a>
             <a href={`/news/operator/livebitcoinnews`}>
                <ListItem primaryText="LiveBitcoinNews"
                          leftIcon={<img src="/static/img/sources/livebitcoinnews.png"/>}/>
            </a>
            <a href={`/news/operator/themerkle`}>
                <ListItem primaryText="TheMerkle"
                          leftIcon={<img src="/static/img/sources/themerkle.png"/>}/>
            </a>
            <a href={`/news/operator/ethnews`}>
                <ListItem primaryText="ethnews"
                          leftIcon={<img src="/static/img/sources/ethnews.png"/>}/>
            </a>
            <a href={`/news/operator/cryptocoinsnews`}>
                <ListItem primaryText="CryptoCoinsNews"
                          leftIcon={<img src="/static/img/sources/cryptocoinsnews.png"/>}/>
            </a>
            <a href={`/news/operator/usatoday`}>
                <ListItem primaryText="USAToday"
                          leftIcon={<img src="/static/img/sources/usatoday.png"/>}/>
            </a>

            <div style={{
                boxSizing: 'border-box',
                color: 'rgb(145, 147, 152)',
                fontSize: '14px',
                lineHeight: '48px',
                paddingLeft: '16px',
                width: '100%'
            }}>CryptoCurrency News (JP)
            </div>

            <a href={`/news/operator/yahoonews_jp`}>
                <ListItem primaryText="Yahoonews Japan"
                          leftIcon={<img src="/static/img/sources/yahoonews_jp.png"/>}/>
            </a>

            <div style={{
                boxSizing: 'border-box',
                color: 'rgb(145, 147, 152)',
                fontSize: '14px',
                lineHeight: '48px',
                paddingLeft: '16px',
                width: '100%'
            }}>CryptoCurrency News (CN)
            </div>
            
             <a href={`/news/operator/bitcoin86`}>
                <ListItem primaryText="Bitcoin86"
                          leftIcon={<img src="/static/img/sources/bitcoin86.png"/>}/>
            </a>
            
             <a href={`/news/operator/chinanews`}>
                <ListItem primaryText="ChinaNews"
                          leftIcon={<img src="/static/img/sources/chinanews.png"/>}/>
            </a>
            
              <a href={`/news/operator/youthcn`}>
                <ListItem primaryText="Youth.cn"
                          leftIcon={<img src="/static/img/sources/youthcn.png"/>}/>
            </a>
            
             <div style={{
                boxSizing: 'border-box',
                color: 'rgb(145, 147, 152)',
                fontSize: '14px',
                lineHeight: '48px',
                paddingLeft: '16px',
                width: '100%'
            }}>CryptoCurrency News (RU)
            </div>
            
             <a href={`/news/operator/forklog`}>
                <ListItem primaryText="ForkLog"
                          leftIcon={<img src="/static/img/sources/forklog.png"/>}/>
            </a>
            

            <div style={{
                boxSizing: 'border-box',
                color: 'rgb(145, 147, 152)',
                fontSize: '14px',
                lineHeight: '48px',
                paddingLeft: '16px',
                width: '100%'
            }}>Videos
            </div>

            <a href={`/topvideos/type/YouTubeVideo`}>
                <ListItem primaryText="Youtube"
                          leftIcon={<img src="/static/img/sources/youtube.png"/>}/>
            </a>
    
            <div style={{
                boxSizing: 'border-box',
                color: 'rgb(145, 147, 152)',
                fontSize: '14px',
                lineHeight: '48px',
                paddingLeft: '16px',
                width: '100%'
            }}>Products (EN)
            </div>

            <a href={`/product/operator/amazon`}>
                <ListItem primaryText="Amazon"
                          leftIcon={<img src="/static/img/sources/amazon.png"/>}/>
            </a>
    
            <a href={`/product/operator/victoriassecret`}>
                <ListItem primaryText="Victoria's Secret"
                          leftIcon={<img
                              src="/static/img/sources/victoriassecret.png"/>}/>
            </a>
            
            <div style={{
                boxSizing: 'border-box',
                color: 'rgb(145, 147, 152)',
                fontSize: '14px',
                lineHeight: '48px',
                paddingLeft: '16px',
                width: '100%'
            }}>Products (NL)
            </div>
             <a href={`/product/operator/mediamarkt`}>
                <ListItem primaryText="MediaMarkt"
                          leftIcon={<img
                              src="/static/img/sources/mediamarkt.png"/>}/>
            </a>
    
            <div style={{
                boxSizing: 'border-box',
                color: 'rgb(145, 147, 152)',
                fontSize: '14px',
                lineHeight: '48px',
                paddingLeft: '16px',
                width: '100%'
            }}>News (EN)
            </div>
    
            <a href={`/news/operator/dailymail`}>
                <ListItem primaryText="DailyMail"
                          leftIcon={<img src="/static/img/sources/dailymail.png"/>}/>
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
            
             <a href={`/news/operator/indiatimes`}>
                <ListItem primaryText="India Times"
                          leftIcon={<img src="/static/img/sources/indiatimes.png"/>}/>
            </a>
            
            <div style={{
                boxSizing: 'border-box',
                color: 'rgb(145, 147, 152)',
                fontSize: '14px',
                lineHeight: '48px',
                paddingLeft: '16px',
                width: '100%'
            }}>News (NL)
            </div>
            
             <a href={`/news/operator/metronieuws`}>
                <ListItem primaryText="MetroNieuws"
                          leftIcon={<img src="/static/img/sources/metronieuws.png"/>}/>
            </a>
            
            <div style={{
                boxSizing: 'border-box',
                color: 'rgb(145, 147, 152)',
                fontSize: '14px',
                lineHeight: '48px',
                paddingLeft: '16px',
                width: '100%'
            }}>News (FR)
            </div>

            <a href={`/news/operator/lemonde`}>
                <ListItem primaryText="Lemonde"
                          leftIcon={<img src="/static/img/sources/lemonde.png"/>}/>
            </a>

            <a href={`/news/operator/lefigaro`}>
                <ListItem primaryText="Lefigaro"
                          leftIcon={<img src="/static/img/sources/lefigaro.png"/>}/>
            </a>
            
             <div style={{
                boxSizing: 'border-box',
                color: 'rgb(145, 147, 152)',
                fontSize: '14px',
                lineHeight: '48px',
                paddingLeft: '16px',
                width: '100%'
            }}>News (ES)
            </div>

            <a href={`/news/operator/elpais`}>
                <ListItem primaryText="Elpais"
                          leftIcon={<img src="/static/img/sources/elpais.png"/>}/>
            </a>

            <a href={`/news/operator/marca`}>
                <ListItem primaryText="Marca"
                          leftIcon={<img src="/static/img/sources/marca.png"/>}/>
            </a>
            
            
             <div style={{
                boxSizing: 'border-box',
                color: 'rgb(145, 147, 152)',
                fontSize: '14px',
                lineHeight: '48px',
                paddingLeft: '16px',
                width: '100%'
            }}>News (IT)
            </div>

            <a href={`/news/operator/repubblica`}>
                <ListItem primaryText="La Repubblica"
                          leftIcon={<img src="/static/img/sources/repubblica.png"/>}/>
            </a>
            
             <div style={{
                boxSizing: 'border-box',
                color: 'rgb(145, 147, 152)',
                fontSize: '14px',
                lineHeight: '48px',
                paddingLeft: '16px',
                width: '100%'
            }}>News (PT)
            </div>
            
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
            
             <div style={{
                boxSizing: 'border-box',
                color: 'rgb(145, 147, 152)',
                fontSize: '14px',
                lineHeight: '48px',
                paddingLeft: '16px',
                width: '100%'
            }}>News (HR)
            </div>
            
            <a href={`/news/operator/indexhr`}>
                <ListItem primaryText="Index.HR"
                          leftIcon={<img src="/static/img/sources/indexhr.png"/>}/>
            </a>
            
             <div style={{
                boxSizing: 'border-box',
                color: 'rgb(145, 147, 152)',
                fontSize: '14px',
                lineHeight: '48px',
                paddingLeft: '16px',
                width: '100%'
            }}>News (RU)
            </div>
            <a href={`/news/operator/novayagazeta_ru`}>
                <ListItem primaryText="Novayagazeta"
                          leftIcon={<img src="/static/img/sources/novayagazeta_ru.png"/>}/>
            </a>
    
            <a href={`/news/operator/novayagazeta_ru`}>
                <ListItem primaryText="Novayagazeta"
                          leftIcon={<img
                              src="/static/img/sources/novayagazeta_ru.png"/>}/>
            </a>

        </List>
    </Paper>
);

Menu.propTypes = {
    resources: PropTypes.array,
};

export default Menu;