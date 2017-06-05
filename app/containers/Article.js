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
import Avatar from 'material-ui/Avatar';

import {GoogleSearchScript} from 'components/GoogleSearchScript';

import {XScript} from 'components/XScript';
import {XSoundcloud} from 'components/XSoundcloud'
import {Grid, Row, Col} from 'react-styled-flexboxgrid';
import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';

var ImageComponent = require('components/Image');
var ImageResized = require("components/ImageResized");


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

    getImageElement() {
        let {article} = this.props;
        var src;
        // use meta:og image if available
        if (article && article.image) {
            src = article.image;
        }
        // use default image if meta:og is missing
        var srcfallback = "/static/img/comentarismo-bg-450-150.png";

        return src ?
            <ImageComponent forceUpdate={true} src={src} srcfallback={srcfallback} classes={'profile-bg-news'}/> : null;
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
                    <div>
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
                    options: {showLines: false, responsive: true, maintainAspectRatio: true}
                });

            });

            sentimentReport = <Card>
                <h5>Free Sentiment Analysis powered by Comentarismo API</h5>
                <canvas id="myChart" width="200px" height="100px"></canvas>
            </Card>
        }

        var totalComments = article.totalComments ? `${article.totalComments} Comments` : "No Comments";
        // var totalComments = article.totalComments ? article.totalComments + "Comments" : "No Comments";

        const stylesTag = {
            chip: {
                margin: 4,
                display: 'inline-flex',
            },
            wrapper: {
                display: 'flex',
                flexWrap: 'wrap',
            },
        };
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
                            "content": `${article.image ? article.image : "//comentarismo.com/static/img/comentarismo-extra-mini-logo.png" }`
                        }
                    ]}
                />
                <a id="comentarismo-page" data-id={ article.titleurlize }/>
                <a id="comentarismo-operator" data-id={ article.operator }/>
                <div className="tm-embed-container" id="scriptContainer">
                </div>
                
                <Grid fluid={true} className="center-sm col-xs-12" style={{padding: '4rem', paddingBottom: '6rem'}}>
                    <FlatButton style={{color: '#656972 !important', opacity: '1', textTransform: 'uppercase',
                                        fontSize: '14px',
                                        fontWeight: 'bold',}} disabled={true}
                                label={ article.genre ? article.genre.toUpperCase() : article.genre }/>
                    <Row
                         style={{
                             background: '#fff',
                             height: 'auto',
                             fontFamily: 'Open Sans, sans-serif',
                             color: '#656972'
                         }}>
                        <Row className="col-lg-6" style={{}}>
                            <CardHeader style={{paddingTop: '0px !important', paddingBottom: '0px'}}
                                title={<span style={{
                                    fontSize: '14px',
                                    textTransform: 'uppercase'
                                }}>{ article.operator ? article.operator + " " : " " }</span>}
                                avatar={<img style={{height: '24px', width: '24px', marginTop: '8px'}}
                                             src={`/static/img/sources/${article.operator}.png`}/>}
                                subtitle={<Date style={{fontSize: '14px'}} date={this.props.article.date}/>}
                            />

                            <CardTitle style={{paddingTop: '0px !important', paddingBottom: '0px'}}
                                title={article.title} titleStyle={{}}
                                subtitle={<a target="_blank"
                                             href={`/html/news.html?table=commentaries&skip=0&limit=50&operator=${this.props.article.operator}&key=operator_titleurlize&value=${this.props.article.titleurlize}`}><span
                                    dangerouslySetInnerHTML={{__html: totalComments}}/></a>}
                            />
                            

                            <CardText style={{paddingTop: '0px', paddingBottom: '0px'}}>{ getContentBody() }</CardText>
                            <CardActions>
                                <div style={{
                                        marginLeft: '10px',
                                        paddingBottom: '10px',
                                        color: '#656972',
                                        textTransform: 'uppercase',
                                        fontSize: '14px',
                    }}>Trending words
                                </div>
                                {
                                    this.props.article.tags && this.props.article.tags.map((tag, i) => {
                                        return i < 4 && (
                                                <Chip style={stylesTag.chip}>
                                                    <Avatar size={32}>{tag.slice(0, 1).toUpperCase()}</Avatar>
                                                    {tag}
                                                </Chip>
                                            )
                                    })
                                }
                            </CardActions>
                        </Row>
                        <Row className="col-lg-6" style={{}}>

                            <ImageResized src={this.props.article.image}
                                          srcfallback={"https://unsplash.it/1400/350?random"} id={this.props.article.id}
                                          width="520" height="395" quality="50"/>
                        </Row>
                    </Row>
                </Grid>

               

                <div>
                    <XSoundcloud permalink_url={article.permalink_url}/>
                </div>
    
    
                <Tabs style={{width:'100%'}}>
        
                    <Tab label="Comments" style={{background: '#f5f5f5', color: '#333'}}>
                        <XScript index="operator_titleurlize"/>
                    </Tab>
                    <Tab label="Report" style={{background: '#f5f5f5', color: '#333'}}>
                        {sentimentReport}
                    </Tab>
                   
                </Tabs>
                
                
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
