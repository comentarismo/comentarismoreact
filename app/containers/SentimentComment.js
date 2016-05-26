import React, { Component,ReactClass,PropTypes } from 'react';

import { State, Navigation } from 'react-router';

import { connect } from 'react-redux';
import { Link } from 'react-router';

import Helmet from "react-helmet";
import Icon from "components/Icon"


import { loadSentimentCommentDetail } from 'actions/commentators'

var $ = require('jquery')
var emojione = require("emojione");
import Date from "components/Date"
var MainNavbar = require('components/MainNavbar');
import {GoogleSearchScript} from 'components/GoogleSearchScript';

import {saSentimentCommentDetail} from '../middleware/sa';

class SentimentComment extends Component {
    static fetchData({ store, params }) {
        let { url } = params;
        console.log("fetchData -> ", url);
        return store.dispatch(loadSentimentCommentDetail({url}))
    }

    constructor(props) {
        super();
        this.state = {
            comment: {},
        };
    }

    render() {
        //console.log(this.props)
        let { comment } = this.state;
        if (typeof window !== 'undefined') {
            var url = this.props.params.url;

            console.log("render -> ", url);
            console.log("render -> ", comment.id);
            console.log("render -> ", comment.metadata);
        }


        return (
            <div>
                <Helmet
                    htmlAttributes={{"lang": "en"}} // amp takes no value
                    title="Latest news, world news, sports, business, comment, analysis and reviews from the world's leading liberal comments website."
                    titleTemplate="Comentarismo.com - %s"
                    meta={[
                    {"name": "description", "content": "Welcome to Comentarismo"},
                    {"property": "og:type", "content": "article"}
                ]}
                    onChangeClientState={(newState) => console.log("Helmet state -> ",newState)}
                />


                <Sentiment comment={comment} url={this.props.params.url}/>

                <div className="clearfix"></div>
                <footer className="footer bg-dark">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 text-center">
                                <p className="copyright">© 2016 Comentarismo.com</p>
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

var Sentiment = React.createClass({
    displayName: 'Sentiment',

    getInitialState: function () {
        let { url,comment } = this.props;
        return {
            vid: url,
            comment: comment
        }
    },

    componentDidMount() {
        let { url,comment } = this.props;
        if (!comment || !comment.metadata) {
            console.log("componentDidMount -> ", url)
            //this.props.loadSentimentCommentDetail({url});

            saSentimentCommentDetail(url, function (err, res) {
                // Do something
                if (err || !res || res.body.length == 0) {
                    console.log("Got error when trying to fallback on sentiment report :| ",err)
                } else {
                    var comment = res.body;
                    console.log("fallback ok :D , updating view ",comment.metadata);
                    this.setState({comment:comment});
                    //this.forceUpdate();
                }
            }.bind(this));

        }
    },

    runReport: function () {
        if (typeof window !== 'undefined') {
            window.location.href = '/sentiment/' + encodeURIComponent(this.state.vid);
        }
    },

    handleChange: function (event) {
        var change = event.target.value;
        this.setState({vid: change});
    },

    render: function () {

        let { comment } = this.state;

        //if (!comment || !comment.metadata) {
        //    return (
        //        <div>
        //            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
        //                <div className='thumbnail article text-center'>Loading <i className='fa fa-cog fa-spin'></i>
        //                </div>
        //            </div>
        //        </div>
        //    )
        //}


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
            if(element) {
                ctx = element.getContext("2d");
            }
            // Bar Chart
            var data = {
                labels: elabels,
                datasets: [
                    {
                        label: "Percent",
                        backgroundColor: [
                            "#FF0000",
                            "#E80957",
                            "#E809BF",
                            "#BB09E8",
                            "#2709E8",
                            "#0957E8",
                            "#0980E8",
                            "#09E8BF",
                            "#09E85B",
                            "#23E809",
                            "#B8E809",
                            "#E8E409",
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
                options: {showLines: false, responsive: true, maintainAspectRatio: false}
            });


            var ctx2 = document.getElementById("scaleChart").getContext("2d");

            // Bar Chart
            var data2 = {
                labels: elabels,
                datasets: [
                    {
                        label: "Percent",
                        backgroundColor: [
                            "#FF0000",
                            "#E80957",
                            "#E809BF",
                            "#BB09E8",
                            "#2709E8",
                            "#0957E8",
                            "#0980E8",
                            "#09E8BF",
                            "#09E85B",
                            "#23E809",
                            "#B8E809",
                            "#E8E409",
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


        return (
            <div className="container">

                <div className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header navbar-brand">
                            Paste a Youtube or Facebook URL below And Get a <b>Free</b> Sentiment <b>Analysis</b> Right
                            <b>Now!</b>
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
                            <span className="navbar-brand">Comentarismo, Sentiment Analyzer</span>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse col-xs-12 col-md-12 col-lg-12">
                            <div className="navbar-form navbar-left form-horizontal">
                                <div>
                                    <input type="text" className="form-control" placeholder="Post URL" name="vid"
                                           value={this.state.vid} onChange={this.handleChange}
                                           style={{width: "350px"}}/>
                                    <a className="btn btn-default" onClick={this.runReport}>Run
                                    </a>
                                </div>
                            </div>
                            <ul className="nav navbar-nav">

                            </ul>
                        </div>
                    </div>
                </nav>

                <div id="report">
                    <div id="header" className="stroke">
                        <h1 id="video_title">{comment.title}</h1>
                        <h4>
                            <span id="channel_title">{comment.metadata ? comment.metadata.channeltitle : ""}</span> on <span
                            id="network_title">{comment.type}</span>
                        </h4>

                        <hr/>

                        <div className="row bignums">
                            <div className="col-xs-4 col-xs-offset-4">
                                <span id="total_comments">{comment.metadata ? comment.metadata.totalcomments : ""}</span>
                                <span className="desc">Total Comments</span>
                            </div>
                            <div className="col-xs-4">
                                <span id="comments_per_day">{comment.commentavgperday ? comment.commentavgperday.toFixed(2) : "0" }</span>
                                <span className="desc">By Day</span>
                            </div>
                        </div>
                    </div>

                    <div className="progress">
                        <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow="0"
                             aria-valuemin="0"
                             aria-valuemax="100" style={{width: "0%"}}>
                            Comments Analyzed: 0%
                        </div>
                    </div>


                    <div className="row">

                        <div className="col-md-5">
                            <h5>Sentiment Statistics: </h5>
                            <canvas id="myChart" width="100%" height="300"></canvas>
                        </div>
                        <div className="col-md-2">
                            <h5>Scale of values </h5>
                            <canvas id="scaleChart" width="100%" height="300"></canvas>
                        </div>
                    </div>


                    <CommentsView comment={this.state.comment.topcomments} emojis={emojis} sentimentlist={this.state.comment.sentimentlist}/>


                </div>
            </div>
        );
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
        let { comment,emojis,sentimentlist } = this.props;
        return {
            comment: comment,
            emojis: emojis,
            sentimentlist: sentimentlist
        }
    },

    componentWillReceiveProps: function(p){
        //console.log(p);
        let { comment,sentimentlist } = p;
        console.log("componentWillReceiveProps -> ")
        this.setState({comment:comment,sentimentlist:sentimentlist});
    },


    loadterrible: function () {
        let { sentimentlist } = this.state;
        this.setState({comment: sentimentlist[terrible]});
    },
    loadsucks: function () {
        let { sentimentlist } = this.state;
        this.setState({comment: sentimentlist[sucks]});
    },
    loadbad: function () {
        let { sentimentlist } = this.state;
        this.setState({comment: sentimentlist[bad]});
    },
    loadnotgood: function () {
        let { sentimentlist } = this.state;
        this.setState({comment: sentimentlist[notgood]});
    },
    loadeh: function () {
        let { sentimentlist } = this.state;
        this.setState({comment: sentimentlist[eh]});
    },
    loadneutral: function () {
        let { sentimentlist } = this.state;
        this.setState({comment: sentimentlist[neutral]});
    },
    loadok: function () {
        let { sentimentlist } = this.state;
        this.setState({comment: sentimentlist[ok]});
    },
    loadgood: function () {
        let { sentimentlist } = this.state;
        this.setState({comment: sentimentlist[good]});
    },
    loadlikeit: function () {
        let { sentimentlist } = this.state;
        this.setState({comment: sentimentlist[likeit]});
    },
    loadlovedit: function () {
        let { sentimentlist } = this.state;
        this.setState({comment: sentimentlist[lovedit]});
    },
    loadawesome: function () {
        let { sentimentlist } = this.state;
        this.setState({comment: sentimentlist[awesome]});
    },
    loadunknown: function () {
        let { sentimentlist } = this.state;
        this.setState({comment: sentimentlist[unknown]});
    },


    render: function () {
        let { comment,emojis } = this.state;

        if(!comment){
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

            <div id="comentarismo-container" className="comentarismo-comment"
                 className="col-md-10">

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
                        comment.map((q)=> {
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
                                                                    style={{width: "10px",height: "10px"}}/> { q.likes }
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

SentimentComment.propTypes = {
    comment: PropTypes.object.isRequired,
};


export { SentimentComment }
export default connect(mapStateToProps, {loadSentimentCommentDetail})(SentimentComment)
