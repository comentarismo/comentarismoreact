import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {loadArticleDetail} from 'actions/articles'
import ReactDOM from 'react-dom';

import Icon from "components/Icon"
import Date from "components/Date"
import Helmet from "react-helmet";
import Slider from 'containers/ImageSlider';
import {PlayImages} from './PlayImages';

import {Tabs, Tab} from 'material-ui/Tabs';
var emojione = require("emojione");
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';


import {GoogleSearchScript} from 'components/GoogleSearchScript';

import {XScript} from 'components/XScript';
import {XSoundcloud} from 'components/XSoundcloud'

var moment = require("moment");


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

var $ = require('jquery');

class Article extends Component {
    static fetchData({store, params}) {
        let {id} = params;
        return store.dispatch(loadArticleDetail({id}));
    }

    render() {
        let {article} = this.props;


        var commentsavgperday = 0.0;

        try {
            if (this.props.article && this.props.article.date && this.props.article.totalComments) {
                var dt = moment(this.props.article.date);
                var today = moment();

                var diffInDays = today.diff(dt, 'days'); // x days
                if (diffInDays > 0) {
                    commentsavgperday = parseFloat(this.props.article.totalComments) / (parseFloat(diffInDays) / parseFloat(24))
                }
            }
        } catch (e) {
            console.log("Error when getting commentsavgperday :| ", e);
        }

        if (!article || !article.operator) {
            return (
                <div>
                    <div className="col-xs-6">
                        <h3>The page you are looking for might have been removed, had its name changed, or is
                            temporarily unavailable.</h3>
                        <div className="image">
                            <img className="img img-responsive" src="/static/img/404notfound.jpeg"/>
                        </div>
                        <div className="text-404">

                            <p>Please Use the Google Search box below and optimize your search </p>
                        </div>
                    </div>
                    <GoogleSearchScript search={this.props.params}/>
                </div>)
        }
        if (!article.comments) {
            article.comments = [];
        }

        function getContentBody() {
            if (!article.resume) return;
            return <div id='content' className=''
                        dangerouslySetInnerHTML={{__html: article.resume}}></div>
        }

        var searchlist = this.props.article.search;

        if (!searchlist) {
            searchlist = [];
            searchlist.push({title: article.title, gimage: article.image});
        }


        var sentimentReport = <div/>

        if (typeof window !== 'undefined' && article.sentiment) {
            $(function () {
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


                //$("#header").css({
                //    "background-image": "url('" + article.image + "')"
                //});
                $(".progress-bar").attr('aria-valuenow', 100)
                    .css({'width': 100 + '%'})
                    .text('Comments Analyzed: ' + 100 + '%');

                var Chart = require("chart.js");

                var elabels = [
                    emojis[terrible], emojis[sucks], emojis[bad], emojis[notgood], emojis[eh], emojis[neutral],
                    emojis[ok], emojis[good], emojis[likeit], emojis[lovedit], emojis[awesome], emojis[unknown]
                ];

                var labels = [terrible, sucks, bad, notgood, eh, neutral, ok, good, likeit, lovedit, awesome, unknown];
                var dp = {};

                // console.log("article.sentiment, ", article.sentiment)
                for (var x in article.sentiment) {
                    var n = article.sentiment[x]["name"];
                    if (n == "") {
                        n = unknown;
                    }
                    var p = article.sentiment[x]["percent"];
                    // console.log(p);
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
                    options: {showLines: false, responsive: true, maintainAspectRatio: false}
                });

            });

            sentimentReport = <Card>
                <h5>Free Sentiment Analysis powered by Comentarismo API</h5>
                <canvas id="myChart" width="100%" height="200"></canvas>
            </Card>
        }

        return (
            <div>
                <Helmet
                    htmlAttributes={{"lang": "en"}} // amp takes no value
                    title={`Latest news - Source - ${article.operator ? article.operator.toUpperCase() : ""} - Genre: ${article.genre ? article.genre.toUpperCase() : ""}`}
                    titleTemplate="Comentarismo.com - %s"
                    meta={[
                        {
                            "name": "description",
                            "content": `Find the most active commentators of the ${this.props.params.value} in several categories like world news, sports, business, technology, analysis and reviews from the world's leading liberal comments website.`
                        },
                        {"property": "og:type", "content": "article"},

                        {"property": "og:audio", "content": `${article.permalink_url ? article.permalink_url : ''}`},
                        {"property": "og:title", "content": `${article.title ? article.title : ''}`},

                        {
                            "property": "og:image",
                            "content": `${article.image ? article.image : "http://comentarismo.com/static/img/comentarismo-extra-mini-logo.png" }`
                        }
                    ]}
                />
                <a id="comentarismo-page" data-id={ article.titleurlize }/>
                <a id="comentarismo-operator" data-id={ article.operator }/>
                <div className="tm-embed-container" id="scriptContainer">
                </div>
                <XScript index="operator_titleurlize"/>

                <div id="header" className="stroke"
                     style={{"backgroundImage": "url('" + article.image + "')"}}>
                    <h1 id="video_title">{article.title}</h1>
                    <h4>
                                                <span
                                                    id="channel_title">{article.operator ? article.operator + " " : " "}</span>
                        on <span id="network_title"> Comment & Sentiment Analysis Project</span>
                    </h4>

                    <hr/>

                    <div className="row bignums">
                        <div className="col-xs-4 col-xs-offset-4">
                                                <span
                                                    id="total_comments">{article.totalComments ? article.totalComments : ""}</span>
                            <span className="desc">Total Comments</span>
                        </div>
                        <div className="col-xs-4">
                                                <span
                                                    id="comments_per_day">{commentsavgperday ? commentsavgperday.toFixed(2) : "0" }</span>
                            <span className="desc">By Day</span>
                        </div>
                    </div>
                </div>


                <div className="row">
                    <div className="progress">
                        <div className="progress-bar progress-bar-success" role="progressbar"
                             aria-valuenow="0"
                             aria-valuemin="0"
                             aria-valuemax="100" style={{width: "0%"}}>
                            Comments Analyzed: 0%
                        </div>
                    </div>
                </div>

                {sentimentReport}

                <Tabs  id="noanim-tab-example">
                    <Tab  label="Images">
                        <PlayImages images={searchlist} playing={true}
                                    playingtimeout={5000}/>
                    </Tab>
                    <Tab label="Videos" disabled>
                        More Videos soon ...
                    </Tab>
                </Tabs>

                <div className="col-xs-12" style={{height: '25px'}}></div>
                <div>
                    <div className="profile-button">

                    </div>
                    <div className="profile-nick">
                        <div className="profile-nickName">

                        </div>
                    </div>

                    <XSoundcloud permalink_url={article.permalink_url}/>


                    <Tabs id="noanim-tab-example">
                        <Tab  label="Resume">
                            <div className="profile-divStats">
                                <ul className="profile-commentsfollowfollowers">
                                    <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block"></span>
                                        <span
                                            className="profile-StatValue">{ getContentBody() }</span>
                                    </li>
                                </ul>
                            </div>
                        </Tab>
                    </Tabs>


                    <Tabs id="noanim-tab-example">
                        <Tab label="Publish Date">
                            <div className="profile-divStats">
                                <ul className="profile-commentsfollowfollowers">
                                    <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block"></span>
                                        <span className="profile-StatValue"><Date
                                            date={this.props.article.date}/></span>
                                    </li>
                                </ul>
                            </div>
                        </Tab>
                    </Tabs>

                    <div className="profile-divStats">
                        <ul className="profile-commentsfollowfollowers">
                            <li className="profile-commentsfollowfollowersLi">
                                                <span
                                                    className="profile-StatLabel profile-block">Tags</span>
                                <span
                                    className="profile-StatValue">{this.props.article.tags.join(", ")}</span>
                            </li>
                        </ul>
                    </div>


                    <div className="profile-divStats">
                        <ul className="profile-commentsfollowfollowers">
                            <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block">Country</span>
                                <span
                                    className="profile-StatValue">{ article.countries ? article.countries.toUpperCase() : article.countries }</span>
                            </li>
                            <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block">Language</span>
                                <span
                                    className="profile-StatValue">{ article.languages ? article.languages.toUpperCase() : article.languages }</span>
                            </li>
                            <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block">Genre</span>
                                <span
                                    className="profile-StatValue">{ article.genre ? article.genre.toUpperCase() : article.genre }</span>
                            </li>

                        </ul>
                    </div>


                </div>
                <div className="col-xs-12" style={{height: '25px'}}></div>

                <div id="comentarismo-container" className="comentarismo-comment col-md-12">
                    {
                        article.comments.map((q) => {
                            return (
                                <div key={q.id}>
                                    <div className="col-sm-1 hidden-xs">
                                        <a className="avatar- img-responsive user-photo"/>
                                        <Icon nick={q.nick} size={50}/>
                                    </div>
                                    <div className="text-wrapper">
                                        <b>{q.date }</b>
                                        <div role="meta" className="comentarismo-comment-header">
                                                        <span className="author">
                                                            <b>{ q.nick }</b>
                                                        </span>
                                        </div>
                                        <div className="text">
                                            <p>{ q.comment }</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )


    }
}

function dv(data, defaultData) {
    return (data ? data : defaultData);
}

function mapStateToProps(state) {
    return {article: state.articleDetail}
}

Article.propTypes = {
    article: PropTypes.object.isRequired
};

export {Article}
export default connect(mapStateToProps, {loadArticleDetail})(Article)
