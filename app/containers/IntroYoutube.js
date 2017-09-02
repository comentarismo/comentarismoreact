import React, {Component, ReactClass, PropTypes} from 'react';

import {connect} from 'react-redux';

import Helmet from "react-helmet";

import {loadIntroDetail} from 'actions/intro'

import {YoutubeReportRun} from "containers/YoutubeReportRun";

import {Card, CardHeader, CardMedia, CardTitle} from 'material-ui/Card';
import {Tabs, Tab} from 'material-ui/Tabs';

import moment from 'moment';

var Article = require('components/Article');
var $ = require('jquery');

import {Grid, Row, Col} from 'react-styled-flexboxgrid';

var quality = "50";
var width = "200";
var height = "195";

var base64Encode = require("../util/imgresizer").base64Encode;
import Autocomplete from 'components/Autocomplete'
import ExpandableComment from 'containers/ExpandableComment';

const commentatorStyle = {
    height: '150px',
    width: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'left',
    boxShadow: 'rgba(0, 0, 0, 0.0980392) 0px 1px 4px',
    borderRadius: '2px',
    margin: '20px 20px 20px 0'
};

class Intro extends Component {
    static fetchData({store, params}) {
        var index = params.index || "youtube";
        var value = params.value || "english";
        var skip = params.skip || "0";
        var limit = params.limit || "50";
        
        return store.dispatch(loadIntroDetail({index, value, skip, limit}))
    }
    
    componentDidMount() {
        
        if (typeof window !== 'undefined') {
            console.log("navigator.language: " + navigator.language);
            console.log("navigator.userLanguage: " + navigator.userLanguage);
            //console.log("navigator.browserLanguage: "+navigator.browserLanguage);
            //console.log("navigator.userAgent: "+navigator.userAgent);
            
            // var path = window.location.pathname.split('/');
            // var index = path[2] || "youtube";
            //
            // var userLang = navigator.language || navigator.userLanguage || navigator.browserLanguage;
            // console.log('detected user language --> ' + userLang);
            // if(document.location.href.indexOf("/home/")===-1) {
            //
            //     if (userLang.indexOf("pt") !== -1) {
            //         document.location.href = "/home/" + index + "/portuguese";
            //     } else if (userLang.indexOf("es") !== -1) {
            //         document.location.href = "/home/" + index + "/spanish";
            //     } else if (userLang.indexOf("it") !== -1) {
            //         document.location.href = "/home/" + index + "/italian";
            //     } else if (userLang.indexOf("fr") !== -1) {
            //         document.location.href = "/home/" + index + "/french";
            //     } else if (userLang.indexOf("russian") !== -1) {
            //         document.location.href = "/home/" + index + "/russian";
            //     } else if (userLang.indexOf("croatian") !== -1) {
            //         document.location.href = "/home/" + index + "/croatian";
            //     } else {
            //         console.log("default lang will be used");
            //     }
            // }
        }
    }
    
    getArticleLink(video) {
        return  '/report/' + encodeURIComponent(video.url);
    }
    
    getCommentatorLink(commentator) {
        return `/commentators/${commentator.id}`
    }
    
    getTitle(title) {
        const t = title && title.length > 45 ? title.substring(0, 45) + "..." : title
        return (
            <span dangerouslySetInnerHTML={{__html: t}}/>
        );
    }
    
    
    getImageElement(src, id) {
        if (typeof window !== 'undefined') {
            
            var host = "https://img.comentarismo.com/r";
            // console.log("IMGRESIZER ",src)
            //do img resize
            var request = $.ajax({
                url: host + '/img/',
                type: 'post',
                data: {
                    url: src,
                    quality: quality,
                    width: width,
                    height: height
                },
                mimeType: "text/plain; charset=x-user-defined"
            });
            request.done(function (binaryData) {
                if (binaryData && binaryData !== "") {
                    //console.log("imgresizer DONE OK");
                    var base64Data = base64Encode(binaryData);
                    src = "data:image/jpeg;base64," + base64Data;
                    $("#" + id).attr("src", "data:image/jpeg;base64," + base64Data);
                } else {
                    $("#" + id).attr("src", src);
                    
                    //
                }
            });
            
            request.fail(function (e) {
                //    console.log(e);
                $("#" + id).attr("src", src);
            });
        }
        
    }
    
    render() {//languages/english/0/5/
        let comment = this.props.news;
        let commentators = this.props.commentators;
        var countCommentators = 0;
        // let commentaries = this.props.commentaries;
        
        // comment && Object.keys(comment).map(article => {
        //     return (comment[article]);
        // });
        
        var targetLang = "english";
        
        if (typeof window !== 'undefined') {
            console.log("navigator.language: " + navigator.language);
            console.log("navigator.userLanguage: " + navigator.userLanguage);
            //console.log("navigator.browserLanguage: "+navigator.browserLanguage);
            //console.log("navigator.userAgent: "+navigator.userAgent);
            
            var userLang = navigator.language || navigator.userLanguage || navigator.browserLanguage;
            console.log('detected user language --> ' + userLang);
            
            if (userLang.indexOf("pt") !== -1) {
                targetLang = "pt";
            } else if (userLang.indexOf("es") !== -1) {
                targetLang = "es";
            } else if (userLang.indexOf("it") !== -1) {
                targetLang = "it";
            } else if (userLang.indexOf("fr") !== -1) {
                targetLang = "fr";
            } else if (userLang.indexOf("russian") !== -1) {
                targetLang = "ru";
            } else if (userLang.indexOf("croatian") !== -1) {
                targetLang = "hr";
            } else {
                console.log("default lang will be used");
            }
            
        }
        const style = {
            height: 'auto',
            margin: '20px',
            width: '300px',
            textAlign: 'left',
            display: 'inline-block',
            boxShadow: 'rgba(0, 0, 0, 0.0980392) 0px 1px 4px',
            borderRadius: '2px'
        };
        // <div>Day:{comment[article].group[0] } Source:</div>
    
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
                />
                <Tabs style={{height: '135px', paddingBottom: '75px'}} initialSelectedIndex={2}>
                    <Tab label="News" onActive={function () {
                        document.location.href = "/";
                    }} style={{background: '#f5f5f5', color: '#333', height: '84px'}}>
                        <Autocomplete placeHolder={"News"} hintText={"Recommend me latest news"}/>
                    </Tab>
                
                    <Tab onActive={function () {
                        document.location.href = "/home/product/"+targetLang;
                    }} label="Products" style={{background: '#f5f5f5', color: '#333', height: '84px'}}>
                        <Autocomplete placeHolder={"Products"} hintText={"Recommend me products"}/>
                    </Tab>
                    <Tab label="YouTube" onActive={function () {
                        document.location.href = "/home/youtube/"+targetLang;
                    }} style={{background: '#f5f5f5', color: '#333', height: '84px'}}>
                        <Autocomplete placeHolder={"YouTube"} hintText={"Recommend me YouTube Videos"}/>
                    </Tab>
                </Tabs>
                <Grid fluid={true}>
                <span className="col-xs-offset-1"
                      style={{
                          color: '#656972',
                          paddingTop: '30px',
                          textTransform: 'uppercase',
                          fontSize: '14px',
                          fontWeight: 'bold',
                      }}>
                    Trending Videos</span>
                    <Row style={{ marginLeft: '7rem'}}>
                        {
                            comment && Object.keys(comment).map(article => {
                                var count = 0;
                                return (
                                    comment[article].group && comment[article].reduction &&
                                    <div className="col-xs box">
                                        {comment[article].reduction.map((news) => {
                                        
                                            let content = "";
                                                count = count + 1;
                                                content = <a href={this.getArticleLink(news)}>
                                                    <Card key={news.id} style={style} className="box">
                                                        <CardHeader title={comment[article].group[1]}
                                                                    subtitle={<span style={{fontSize: '12px !important'}}>by <b>{news.metadata.channeltitle}</b> {moment(news.date).format('MMMM Do YYYY, h:mm')}</span>}
                                                                    avatar={<img style={{height: '24px', width: '24px'}}
                                                                                 src={`/static/img/sources/${comment[article].group[1]}.png`}/>}/>
                                                        <CardMedia
                                                            overlay={<CardTitle
                                                                style={{height: '45px', padding: '0 10px'}} title={<span
                                                                style={{
                                                                    fontSize: '14px !important',
                                                                    lineHeight: '1.5'
                                                                }}>{news.title}</span>}/>}>
                                                            <div
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    left: '0px',
                                                                    top: '0px',
                                                                    zIndex: -1
                                                                }}
                                                                id={"img-" + news.id}>
                                                                <img style={{width: '100%', height: '100%'}}
                                                                     id={news.id}/>
                                                                {this.getImageElement(news.metadata.thumbnail, news.id)}
                                                            </div>
                                                        </CardMedia>
                                                        <CardTitle
                                                            title={<span
                                                                style={{padding: '3px', background: '#656972', color: '#fff', fontSize: '12px !important', textTransform: 'uppercase'}}>{`${news.metadata.totalcomments} Comments`}</span>}
                                                            subtitle={<span
                                                                style={{fontSize: '12px !important'}}>{this.getTitle(Object.keys(news.keywords).join(" "))}</span>}/>
                                                    </Card>
                                                </a>
                                            
                                                return <Col key={news.id}>{content}</Col>
                                        })}
                                    </div>
                                );
                            })
                        }
                    </Row>


                    <div className="col-xs-offset-1"
                          style={{
                              color: '#656972',
                              lineHeight: '60px !important',
                              textTransform: 'uppercase',
                              fontSize: '14px',
                              fontWeight: 'bold',
                          }}>
                    Trending  comments</div>
                
                    <Row style={{ marginLeft: '8rem', marginRight: '8rem' }}>
                        {
                            comment && Object.keys(comment).map(article => {
                                var count = 0;
                                return (
                                    comment[article].group && comment[article].reduction &&
                                    <div className="col-xs-12 box">
                                        {comment[article].reduction.map((news) => {
                                            let c = {
                                                nick: news.topcomments[0].authorname,
                                                title: news.title,
                                                likes: news.topcomments[0].likes,
                                                comment: news.topcomments[0].content
                                            }
                                            let content =  <ExpandableComment comment={c}/>;
                                            
                                                return <Col className="box" key={`${news.id}`}>{content}</Col>
                                        })}
                                    </div>
                                );
                            })
                        }
                    </Row>
                
                    <div className="col-xs-offset-1"
                          style={{
                              color: '#656972',
                              lineHeight: '66px !important',
                              textTransform: 'uppercase',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              paddingTop: '30px',
                              paddingBottom: '10px',
                          }}>
                    Active commentators</div>
                
                    <Row>
                        {
                            commentators && Object.keys(commentators).map(article => {
                                return (
                                    commentators[article].group && commentators[article].reduction &&
                                    <div className="col-xs box">
                                        {commentators[article].reduction.map((news) => {
                                        
                                            let content = "";
                                            // TODO: filter by language
                                            if (countCommentators < 10 && news.totalComments > 1) {
                                                countCommentators = countCommentators + 1;
                                                content = <a href={this.getCommentatorLink(news)}>
                                                    <Card key={news.id} style={commentatorStyle} className="box">
                                                        <CardHeader title={news.nick}
                                                                    subtitle={<span style={{fontSize: '12px !important'}}> on <b> {commentators[article].group[1]}</b> at {moment(news.maxDate).format('MMMM Do YYYY, h:mm')}</span>}
                                                                    avatar={<img style={{height: '42px', width: '42px', borderRadius: '50%'}}
                                                                                 src={`/static/img/avatar/avatar1.svg`}/>}/>
                                                    
                                                        <CardTitle style={{ padding: '0 20px'}}
                                                                   title={<span
                                                                       style={{ padding: '3px', background: '#656972', color: '#fff', fontSize: '14px !important'}}>{` ${news.totalComments} Comments`}</span>}
                                                        />
                                                    </Card>
                                                </a>
                                            
                                                return <Col key={news.id} >{content}</Col>
                                            }
                                            return ""
                                        })}
                                    </div>
                                );
                            })
                        }
                    </Row>
                
                    <Row style={{background: 'rgba(101,105,114, 0.9)', height: '330px', marginTop: '30px'}}>
                        <img
                            style={{
                                width: '30%',
                                height: '300px',
                                margin: '30px 30px 0px 0px' }}
                            src={`/static/img/avatar/comentarismo-bot.svg`}/>
                        <Tabs style={{height: '135px', paddingBottom: '75px', width: '55%'}}>
                            <Tab label="WHO AM I?" style={{background: '#656972', color: '#fff', height: '84px'}}>
                                <h3 style={{ paddingTop:'20px', fontFamily:'Open Sans, sans-serif', fontSize: '16px', color: '#fff'}} >I'm Linda!</h3>
                                <p style={{fontFamily:'Open Sans, sans-serif', fontSize: '14px', color: '#fff'}}>I provide recommendations and help you discover news, products, videos and associated comments based on what you like.</p>
                            </Tab>
                            <Tab label="WHY SIGN IN?" style={{background: '#656972', color: '#fff', height: '84px'}}>
                                <h3 style={{paddingTop:'20px', fontFamily:'Open Sans, sans-serif', fontSize: '16px', color: '#fff'}} >Get more from comments around the web</h3>
                                <p style={{fontFamily:'Open Sans, sans-serif', fontSize: '14px', color: '#fff'}}>Once signed in, you'll receive better, personalized recommendations. Navigate through comments and likes, comment or share them. Filter through comments and users's profiles.
                                    Interact with all users from one place. Find other people with shared interests and keep up with their discoveries.
                                </p>                            </Tab>
                            <Tab label="AM I IMPROVING?" style={{background: '#656972', color: '#fff', height: '84px'}}>
                                <h3 style={{paddingTop:'20px', fontFamily:'Open Sans, sans-serif', fontSize: '16px', color: '#fff'}} >I am always improving</h3>
                                <p style={{fontFamily:'Open Sans, sans-serif', fontSize: '14px', color: '#fff'}}>My knowledge is constantly growing. I'm learning from you, the people who use my service.
                                    If you want to help, sign up now!</p>
                            </Tab>
                        </Tabs>
                
                    </Row>
                    <Row  style={{ padding: '5rem'}}>
                        <ul style={{listStyle: 'none', display: 'inline-flex', margin: 'auto'}}>
                            <li><a style={{color: '#656972 !important', marginRight: '2rem', textTransform: 'uppercase', fontFamily:'Open Sans, sans-serif', fontWeight: '600'}} href="//api.comentarismo.com/about.html">About</a></li>
                            <li><a style={{color: '#656972 !important', marginRight: '2rem', textTransform: 'uppercase', fontFamily:'Open Sans, sans-serif', fontWeight: '600'}} href="">API</a></li>
                            <li><a style={{color: '#656972 !important', marginRight: '2rem', textTransform: 'uppercase', fontFamily:'Open Sans, sans-serif', fontWeight: '600'}} href="">Contact</a></li>
                            <li><a style={{color: '#656972 !important', marginRight: '2rem', textTransform: 'uppercase', fontFamily:'Open Sans, sans-serif', fontWeight: '600'}} href="">Terms of Use</a></li>
                            <li><a style={{color: '#656972 !important', marginRight: '2rem', textTransform: 'uppercase', fontFamily:'Open Sans, sans-serif', fontWeight: '600'}} href="">Privacy Policy</a></li>
                        </ul>
                    </Row>
                </Grid>
            </div>
    
        );
    }
}


function mapStateToProps(state) {
    return {
        commentators: state.introDetail.commentators,
        news: state.introDetail.news,
        commentaries: state.introDetail.commentaries,
    }
}

Intro.propTypes = {
    commentators: PropTypes.any.isRequired,
    news: PropTypes.any.isRequired,
    commentaries: PropTypes.any.isRequired,
};


export {Intro}
export default connect(mapStateToProps, {loadIntroDetail})(Intro)
