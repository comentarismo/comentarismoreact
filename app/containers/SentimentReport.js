import React, {Component, ReactClass, PropTypes} from 'react';

import {State, Navigation} from 'react-router';

import {connect} from 'react-redux';

import Helmet from "react-helmet";
import Icon from "components/Icon"

import {FormControl} from 'react-bootstrap';

import {loadSentimentCommentDetail} from 'actions/commentators'

var $ = require('jquery')
var emojione = require("emojione");
import Date from "components/Date"
import {Tabs, Tab} from 'material-ui/Tabs';
import {GoogleSearchScript} from 'components/GoogleSearchScript';

import {saSentimentCommentDetail} from '../middleware/sa';

import YouTube from 'react-youtube';

import BubbleChart from 'components/BubbleChart';

import {XScript} from 'components/XScriptYoutube'

class SentimentReport extends Component {
    static fetchData({store, params}) {
        let {url, lang, refresh} = params;
        console.log("SentimentComment, fetchData -> ", url, lang, refresh);
        return store.dispatch(loadSentimentCommentDetail({url, lang, refresh}))
    }
    
    
    constructor(props) {
        super();
        this.state = {
            comment: {},
        };
    }
    
    getUrlVars() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
    
    render() {
        //console.log(this.props)
        let {comment} = this.props;
        let {url} = this.props.params;
        if (typeof window !== 'undefined') {
            var vars = this.getUrlVars();
            var lang = vars["lang"]
            var refresh = vars["refresh"]
            console.log("render -> ", url, lang, refresh);
        }
        
        
        return (
            <div>
                <Helmet
                    htmlAttributes={{"lang": "en"}} // amp takes no value
                    title="Latest news, world news, sports, business, comment, analysis and reviews from the world's leading liberal comments website."
                    titleTemplate="Comentarismo.com - %s"
                    meta={[
                        {"name": "description", "content": "Welcome to Comentarismo"},
                        {"property": "og:type", "content": "article"},
                        {"property": "og:type", "content": "article"},
    
                        {"property": "og:title", "content": `${comment.title ? comment.title : ''}`},
                        {"property": "og:video", "content": `${comment.url ? comment.url : ''}`},
    
                        {
                            "property": "og:image",
                            "content": `${comment.metadata ? comment.metadata.thumbnail : "//comentarismo.com/static/img/comentarismo-extra-mini-logo.png" }`
                        }
                    ]}
                />
                <Sentiment comment={comment} url={url} lang={lang} refresh={refresh}/>
    
                <XScript operator={comment.operator} page={comment.id} index="operator_uuid"/>
                
                
                <div className="clearfix"></div>
                <footer className="footer bg-dark">
                    <div className="container">
                        <div className="">
                            <div className="col-sm-12 text-center">
                                <p className="copyright">© 2017 Comentarismo.com</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
}

var terrible = "Terrible!";
var sucks = "Sucks";
var bad = "Bad";
var notgood = "Not Good";
var eh = "Eh";
var neutral = "Neutral";
var ok = "OK";
var good = "Good";
var likeit = "Like It";
var lovedit = "Loved It";
var awesome = "Awesome!";
var unknown = "Unknown";
var emojis = {
    "Terrible!": terrible + emojione.shortnameToUnicode(":scream:"),
    "Sucks": sucks + emojione.shortnameToUnicode(":angry:"),
    "Bad": bad + emojione.shortnameToUnicode(":worried:"),
    "Not Good": notgood + emojione.shortnameToUnicode(":unamused:"),
    "Eh": eh + emojione.shortnameToUnicode(":confused:"),
    "Neutral": neutral + emojione.shortnameToUnicode(":expressionless:"),
    "OK": ok + emojione.shortnameToUnicode(":neutral_face:"),
    "Good": good + emojione.shortnameToUnicode(":smile:"),
    "Like It": likeit + emojione.shortnameToUnicode(":smiley:"),
    "Loved It": lovedit + emojione.shortnameToUnicode(":yum:"),
    "Awesome!": awesome + emojione.shortnameToUnicode(":grinning:"),
    "Unknown": unknown + emojione.shortnameToUnicode(":no_mouth:")
};

var Sentiment = React.createClass({
    displayName: 'Sentiment',
    
    getInitialState: function () {
        let {url, comment, lang, refresh} = this.props;
        
        return {
            vid: url,
            comment: comment,
            numBubbles: 70,
            lang: lang,
            refresh: refresh,
        }
    },
    
    componentDidMount() {
        let {url, comment, lang, refresh} = this.props;
        if (!comment || !comment.metadata) {
            console.log("componentDidMount, could not get metadata, will retry with client side request-> ", url)
            //this.props.loadSentimentCommentDetail({url});
            
            saSentimentCommentDetail(url, lang, refresh, function (err, res) {
                // Do something
                if (err || !res || res.body.length == 0) {
                    console.log("Got error when trying to fallback on sentiment report :| ", err)
                } else {
                    var comment = res.body;
                    console.log("fallback ok :D , updating view ", comment.metadata);
                    this.setState({comment: comment, lang: comment.metadata.language});
                    // this.forceUpdate();
                }
            }.bind(this));
            
        }
    },
    
    runReport: function () {
        if (typeof window !== 'undefined') {
            window.location.href = '/report/' + encodeURIComponent(this.state.vid) + "?" + (this.state.lang ? "lang=" + this.state.lang : "");
        }
    },
    
    
    updateReport: function () {
        if (typeof window !== 'undefined') {
            window.location.href = '/report/' + encodeURIComponent(this.state.vid) + "?" + (this.state.lang ? "lang=" + this.state.lang : "") + "&refresh=true";
        }
    },
    
    handleChange: function (event) {
        var change = event.target.value;
        this.setState({vid: change});
    },
    
    handleChangeLang: function (event) {
        var change = event.target.value;
        this.setState({lang: change});
    },
    
    _runReport(){
        let {comment} = this.state;
        
        if (typeof window !== 'undefined' && comment && comment.metadata) {
            $("#header").css({
                "background-image": "url('" + comment.metadata.thumbnail + "')"
            });
            $(".progress-bar").attr('aria-valuenow', comment.commentcoveragepercent)
                .css({'width': comment.commentcoveragepercent + '%'})
                .text('Comments Analyzed: ' + comment.commentcoveragepercent + '%');
            $("nav input").val(comment.url);
            
            var Chart = require("chart.js");
            
            // Sort the keyword list
            var sortable = [];
            for (var k in comment.keywords) {
                sortable.push([k, comment.keywords[k]]);
            }
            
            sortable.sort(function (a, b) {
                return b[1] - a[1]
            })
            
            var y = 0;
            for (var s in sortable) {
                y++;
                $("#keywords").append('<tr><td>' + y + '.</td><td>' + sortable[s][0] + ' (' + sortable[s][1] + ')</td></tr>');
            }
            
            var elabels = [
                emojis[terrible], emojis[sucks], emojis[bad], emojis[notgood], emojis[eh], emojis[neutral],
                emojis[ok], emojis[good], emojis[likeit], emojis[lovedit], emojis[awesome], emojis[unknown]
            ];
            
            var labels = [terrible, sucks, bad, notgood, eh, neutral, ok, good, likeit, lovedit, awesome, unknown];
            var dp = {};
            for (var x in comment.sentiment) {
                var n = comment.sentiment[x]["name"];
                if (n == "") {
                    n = unknown;
                }
                var p = comment.sentiment[x]["percent"];
                
                dp[n] = p;
            }
            var element = document.getElementById("myChart");
            var ctx = {};
            if (element) {
                ctx = element.getContext("2d");
            }
            // Bar Chart
            var data = {
                labels: elabels,
                datasets: [
                    {
                        label: "Percent",
                        backgroundColor: [
                            "#040D45",
                            "#0A0D57",
                            "#0C0F63",
                            "#111585",
                            "#12168C",
                            "#151AAD",
                            "#2D32C4",
                            "#3A3EC7",
                            "#4D51C9",
                            "#5F62C9",
                            "#7679CC",
                            "#8F91CC",
                        ],
                        borderColor: "rgba(255,99,132,1)",
                        borderWidth: 1,
                        hoverBackgroundColor: "rgba(255,99,132,0.4)",
                        hoverBorderColor: "rgba(255,99,132,1)",
                        data: [dv(dp[terrible], 0), dv(dp[sucks], 0), dv(dp[bad], 0), dv(dp[notgood], 0), dv(dp[eh], 0), dv(dp[neutral], 0), dv(dp[ok], 0), dv(dp[good], 0), dv(dp[likeit], 0), dv(dp[lovedit], 0), dv(dp[awesome], 0), dv(dp[unknown], 0)]
                    }
                ]
            };
            
            
            new Chart(ctx, {
                type: 'bar',
                data: data,
                options: {showLines: false, responsive: false, maintainAspectRatio: true}
            });
            
            
            var ctx2 = document.getElementById("scaleChart").getContext("2d");
            
            // Bar Chart
            var data2 = {
                labels: elabels,
                datasets: [
                    {
                        label: "Percent",
                        backgroundColor: [
                            "#040D45",
                            "#0A0D57",
                            "#0C0F63",
                            "#111585",
                            "#12168C",
                            "#151AAD",
                            "#2D32C4",
                            "#3A3EC7",
                            "#4D51C9",
                            "#5F62C9",
                            "#7679CC",
                            "#8F91CC",
                        ],
                        borderColor: "rgba(255,99,132,1)",
                        borderWidth: 1,
                        hoverBackgroundColor: "rgba(255,99,132,0.4)",
                        hoverBorderColor: "rgba(255,99,132,1)",
                        data: [dv(dp[terrible], 0), dv(dp[sucks], 0), dv(dp[bad], 0), dv(dp[notgood], 0), dv(dp[eh], 0), dv(dp[neutral], 0), dv(dp[ok], 0), dv(dp[good], 0), dv(dp[likeit], 0), dv(dp[lovedit], 0), dv(dp[awesome], 0), dv(dp[unknown], 0)]
                    }
                ]
            };
            
            
            new Chart(ctx2, {type: 'pie', data: data2, options: {}});
            
            
        }
    },
    
    render: function () {
        let {comment, numBubbles} = this.state;
        if (!comment || !comment.metadata) {
            return (
                <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                    <div className='thumbnail article text-center'>Youtube Sentiment Report is Loading <i
                        className='fa fa-cog fa-spin'></i></div>
                </div>
            )
        }
        
        var bubblechart = [];
        
        
        const opts = {
            height: '290',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 1
            }
        };
        if (this.state.comment.sentimentscores) {
            
            for (var u = 0; u < this.state.comment.sentimentscores.length; u++) {
                
                var t = this.state.comment.sentimentscores[u];
                if(t) {
                    Object.keys(t).forEach(function (key) {
                        var target = {
                            _id: key,
                            sentiment: t[key],
                            value: bubblechart.length + 10
                        }
                        if (bubblechart.length < numBubbles) {
                            bubblechart.push(target);
                        }
                    });
                }
            }
        }
        
        return (
            <div className="">
                
                <div className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header navbar-brand">
                            Paste a Youtube URL below And Get a <b>Free</b> Sentiment <b>Analysis</b> Right <b> Now!</b>
                        </div>
                    </div>
                </div>
                
                
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                    data-target="#navbar"
                                    aria-expanded="false" aria-controls="navbar">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <span
                                className="navbar-brand">Insert a Youtube URL, Select the language and press Run.</span>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse col-xs-12 col-md-12 col-lg-12">
                            <div className="navbar-form navbar-left form-horizontal">
                                <div>
                                    <input type="text" className="form-control" placeholder="Post URL" name="vid"
                                           value={this.state.vid} onChange={this.handleChange}
                                           style={{width: "350px"}}/>
                                    <FormControl componentClass="select" placeholder="select" value={this.state.lang}
                                                 onChange={this.handleChangeLang}>
                                        <option value="en">English</option>
                                        <option value="es">Spanish</option>
                                        <option value="pt">Portuguese</option>
                                        <option value="fr">French</option>
                                        <option value="it">Italian</option>
                                        <option value="ru">Russian</option>
                                        <option value="hr">Croatian</option>
                                    </FormControl>
                                    
                                    <a className="btn btn-primary" onClick={this.runReport}>Run
                                    </a>
                                </div>
                            </div>
                            <ul className="nav navbar-nav">
                            </ul>
                        </div>
                    </div>
                </nav>
                
                <a type="button" className="btn btn-primary" onClick={this.updateReport}>Update Report</a>
                
                
                <div id="report">
                    <div id="header" className="stroke">
                        <h1 id="video_title">{comment.title}</h1>
                        <h4>
                            <span id="channel_title">{comment.metadata ? comment.metadata.channeltitle : ""}</span> on
                            <span id="network_title">{comment.type}</span>
                        </h4>
                        
                        <hr/>
                        
                        
                        <div className="row bignums">
                            <div className="col-xs-2 col-xs-offset-2">
                                <span
                                    id="total_comments">{comment.metadata ? comment.metadata.videoviews : ""} </span>
                                <span className="desc">Total Views</span>
                            </div>
                            
                            <div className="col-xs-2 col-xs-offset-2">
                                <span
                                    id="total_comments">{comment.metadata ? comment.metadata.totalcomments : ""}</span>
                                <span className="desc">Total Comments</span>
                            </div>
                            <div className="col-xs-2">
                                <span
                                    id="comments_per_day">{comment.commentavgperday ? comment.commentavgperday.toFixed(2) : "0" }</span>
                                <span className="desc">By Day</span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="progress">
                            <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow="0"
                                 aria-valuemin="0"
                                 aria-valuemax="100" style={{width: "0%"}}>
                                Comments Analyzed: 0%
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <YouTube
                            videoId={comment.metadata ? comment.metadata.id : comment.id}
                            opts={opts}
                            onReady={this._onReady}
                        />
                    </div>
                </div>
                
                
                <Tabs style={{width: '100%', height: '100%', paddingBottom: '0'}}>
                    <Tab label="BubbleChart" style={{background: '#f5f5f5', color: '#333'}}>
                        <BubbleChart data={bubblechart}/>
                        <div className="col-md-12">
                            <div className="">{numBubbles + (numBubbles === 1 ? " Circle" : " Circles")}</div>
                            <input
                                className=""
                                type="range"
                                min="1"
                                max="250"
                                value={numBubbles}
                                onChange={this.onChange}/>
                        </div>
                    </Tab>
                    <Tab label="Sentiment Statistics" style={{background: '#f5f5f5', color: '#333'}}>
                        <canvas id="myChart" width="600" height="300"></canvas>
                    </Tab>
                    <Tab label="Scale of values" style={{background: '#f5f5f5', color: '#333'}}>
                        <canvas id="scaleChart" width="200px" height="100px"></canvas>
                    </Tab>
                
                </Tabs>
            
            </div>
        );
    },
    onChange: function (e) {
        this.setState({numBubbles: e.target.value})
    },
    _onReady: function (event) {
        // access to player in all event handlers via event.target
        //event.target.pauseVideo();
        this._runReport()
    }
});

var PlayButton = React.createClass({
    render: function () {
        return (
            <div className="col-xs-3 btn btn-custom" onClick={this.props.onClick}>
                <span className="fa fa-play" data-text="play"/> {this.props.label}
            </div>
        )
    }
});

var CommentsView = React.createClass({
    displayName: 'CommentsView',
    
    getInitialState: function () {
        let {comment, emojis, sentimentlist} = this.props;
        return {
            comment: comment,
            emojis: emojis,
            sentimentlist: sentimentlist
        }
    },
    
    componentWillReceiveProps: function (p) {
        //console.log(p);
        let {comment, sentimentlist} = p;
        console.log("componentWillReceiveProps -> ")
        this.setState({comment: comment, sentimentlist: sentimentlist});
    },
    
    
    loadterrible: function () {
        let {sentimentlist} = this.state;
        this.setState({comment: sentimentlist[terrible]});
    },
    loadsucks: function () {
        let {sentimentlist} = this.state;
        this.setState({comment: sentimentlist[sucks]});
    },
    loadbad: function () {
        let {sentimentlist} = this.state;
        this.setState({comment: sentimentlist[bad]});
    },
    loadnotgood: function () {
        let {sentimentlist} = this.state;
        this.setState({comment: sentimentlist[notgood]});
    },
    loadeh: function () {
        let {sentimentlist} = this.state;
        this.setState({comment: sentimentlist[eh]});
    },
    loadneutral: function () {
        let {sentimentlist} = this.state;
        this.setState({comment: sentimentlist[neutral]});
    },
    loadok: function () {
        let {sentimentlist} = this.state;
        this.setState({comment: sentimentlist[ok]});
    },
    loadgood: function () {
        let {sentimentlist} = this.state;
        this.setState({comment: sentimentlist[good]});
    },
    loadlikeit: function () {
        let {sentimentlist} = this.state;
        this.setState({comment: sentimentlist[likeit]});
    },
    loadlovedit: function () {
        let {sentimentlist} = this.state;
        this.setState({comment: sentimentlist[lovedit]});
    },
    loadawesome: function () {
        let {sentimentlist} = this.state;
        this.setState({comment: sentimentlist[awesome]});
    },
    loadunknown: function () {
        let {sentimentlist} = this.state;
        this.setState({comment: sentimentlist[unknown]});
    },
    
    
    render: function () {
        let {comment, emojis} = this.state;
        
        if (!comment) {
            comment = [];
        }
        
        var loadterribleButton = <PlayButton label={emojis[terrible]} onClick={this.loadterrible}/>;
        var loadsucksButton = <PlayButton label={emojis[sucks]} onClick={this.loadsucks}/>;
        var loadbadButton = <PlayButton label={emojis[bad]} onClick={this.loadbad}/>;
        var loadnotgoodButton = <PlayButton label={emojis[notgood]} onClick={this.loadnotgood}/>;
        var loadehButton = <PlayButton label={emojis[eh]} onClick={this.loadeh}/>;
        var loadneutralButton = <PlayButton label={emojis[neutral]} onClick={this.loadneutral}/>;
        var loadokButton = <PlayButton label={emojis[ok]} onClick={this.loadok}/>;
        var loadgoodButton = <PlayButton label={emojis[good]} onClick={this.loadgood}/>;
        var loadlikeitButton = <PlayButton label={emojis[likeit]} onClick={this.loadlikeit}/>;
        var loadloveditButton = <PlayButton label={emojis[lovedit]} onClick={this.loadlovedit}/>;
        var loadawesomeButton = <PlayButton label={emojis[awesome]} onClick={this.loadawesome}/>;
        var loadunknownButton = <PlayButton label={emojis[unknown]} onClick={this.loadunknown}/>;
        
        return (
            
            <div id="comentarismo-container" className="comentarismo-comment col-md-10">
                
                <div className="col-md-12">
                    {loadterribleButton}
                    {loadsucksButton}
                    {loadbadButton}
                    {loadnotgoodButton}
                    {loadehButton}
                    {loadneutralButton}
                    {loadokButton}
                    {loadgoodButton}
                    {loadlikeitButton}
                    {loadloveditButton}
                    {loadawesomeButton}
                    {loadunknownButton}
                </div>
                <div className="col-xs-12" style={{height: "45px"}}></div>
                
                
                <div className="col-md-12">
                    {
                        comment.map((q) => {
                            return (
                                <div key={q.id}>
                                    <div className="col-xs-1 hidden-xs">
                                        <a className="avatar img-responsive user-photo"/>
                                        <Icon nick={q.authorname} size={50}/>
                                    </div>
                                    <div className="text-wrapper col-xs-11">
                                        <div className="col-xs-8">
                                            <div role="meta" className="comentarismo-comment-header">
                                                        <span className="author">
                                                            <b>@{ q.authorname }</b>
                                                        </span>
                                            </div>
                                        </div>
                                        <div className="col-xs-4">
                                            Sentiment {emojis[q.sentiment]}
                                        </div>
                                        
                                        <div className="col-xs-8">
                                            <div role="meta" className="comentarismo-comment-header">
                                                        <span className="author">
                                                            <b><img src="/static/img/thumbs-up.png"
                                                                    style={{
                                                                        width: "10px",
                                                                        height: "10px"
                                                                    }}/> { q.likes }
                                                            </b>
                                                        </span>
                                            </div>
                                        </div>
                                        <div className="col-xs-4">
                                            <Date
                                                date={q.published}/>
                                        </div>
                                        
                                        <div className="text col-sm-12">
                                            <p dangerouslySetInnerHTML={{__html: q.content}}></p>
                                        </div>
                                        
                                        <div className="comentarismo-comment-footer col-sm-12">
                                        
                                        </div>
                                        <div className="comentarismo-follow-up"></div>
                                        <div className="comentarismo-postbox"></div>
                                    
                                    </div>
                                </div>
                            
                            )
                        })
                    }
                </div>
            </div>
        )
    }
});

function dv(data, defaultData) {
    return (data ? data : defaultData);
}

function mapStateToProps(state) {
    return {comment: state.commentatorDetail}
}

SentimentReport.propTypes = {
    comment: PropTypes.object.isRequired,
};


export {SentimentReport}
export default connect(mapStateToProps, {loadSentimentCommentDetail})(SentimentReport)


//<img src="/static/img/flags/png/us.png"/> <img src="/static/img/flags/png/es.png"/> <img src="/static/img/flags/png/br.png"/> <img src="/static/img/flags/png/it.png"/>