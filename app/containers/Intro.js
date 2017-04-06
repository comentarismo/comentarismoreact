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

class Intro extends Component {
    static fetchData({store, params}) {
        var index = params.index || "languages";
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
            
            var userLang = navigator.language || navigator.userLanguage || navigator.browserLanguage;
            console.log('detected user language --> ' + userLang);
            var targetLang = "";
            if (userLang.indexOf("pt") !== -1) {
                targetLang = "portuguese";
            } else if (userLang.indexOf("es") !== -1) {
                targetLang = "spanish";
            } else if (userLang.indexOf("it") !== -1) {
                targetLang = "italian";
            } else if (userLang.indexOf("fr") !== -1) {
                targetLang = "french";
            } else if (userLang.indexOf("russian") !== -1) {
                targetLang = "russian";
            } else if (userLang.indexOf("croatian") !== -1) {
                targetLang = "croatian";
            } else {
                console.log("default lang will be used");
                return;
            }
            
            var index = "languages";
            var value = targetLang;
            var skip = "0";
            var limit = "50";
            console.log("will re-load comments on the user lang. ");
            this.props.loadIntroDetail({index, value, skip, limit});
        }
    }
    
    getArticleLink(news) {
        return '/news/' + news.titleurlize;
    }
    
    getCommentatorLink(commentator){
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
            
            var host = "//img.comentarismo.com/r";
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
                targetLang = "portuguese";
            } else if (userLang.indexOf("es") !== -1) {
                targetLang = "spanish";
            } else if (userLang.indexOf("it") !== -1) {
                targetLang = "italian";
            } else if (userLang.indexOf("fr") !== -1) {
                targetLang = "french";
            } else if (userLang.indexOf("russian") !== -1) {
                targetLang = "russian";
            } else if (userLang.indexOf("croatian") !== -1) {
                targetLang = "croatian";
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
                <Tabs style={{height: '135px', paddingBottom: '75px'}}>
                    <Tab label="News" style={{background: '#f5f5f5', color: '#333', height: '84px'}}>
                        <Autocomplete placeHolder={"News"} hintText={"Recommend me latest news"}/>
                    </Tab>
                    
                    <Tab label="Products" style={{background: '#f5f5f5', color: '#333', height: '84px'}}>
                        <Autocomplete placeHolder={"Products"} hintText={"Recommend me products"}/>
                    </Tab>
                    <Tab label="YouTube" style={{background: '#f5f5f5', color: '#333', height: '84px'}}>
                        <Autocomplete placeHolder={"YouTube"} hintText={"Recommend me YouTube Videos"}/>
                    </Tab>
                </Tabs>
                <span
                    style={{
                        paddingLeft: '95px',
                        paddingTop: '30px',
                        textTransform: 'uppercase',
                        fontSize: '14px',
                        fontWeight: 'bold',
                    }}>
                    Trending  News</span>
                
                <Grid fluid={true}>
                    <Row center="md">
                        {
                            comment && Object.keys(comment).map(article => {
                                var count = 0;
                                return (
                                    comment[article].group && comment[article].reduction &&
                                    <div>
                                        {comment[article].reduction.map((news) => {
                                            
                                            let content = "";
                                            if (news.languages == targetLang && count < 1) {
                                                count = count + 1;
                                                content = <a href={this.getArticleLink(news)}>
                                                    <Card key={news.id} style={style}>
                                                        <CardHeader title={comment[article].group[1]}
                                                                    subtitle={<span style={{fontSize: '12 !important'}}>by <b>{news.author}</b> {moment(news.date).format('MMMM Do YYYY, h:mm')}</span>}
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
                                                                {this.getImageElement(news.image, news.id)}
                                                            </div>
                                                        </CardMedia>
                                                        <CardTitle
                                                            title={<span
                                                                style={{fontSize: '14px !important'}}>{`Total Comments: ${news.totalComments}`}</span>}
                                                            subtitle={<span
                                                                style={{fontSize: '12px !important'}}>{this.getTitle(news.summary)}</span>}/>
                                                    </Card>
                                                </a>
                                                
                                                return <Col key={news.id} xs={12} md={6}>{content}</Col>
                                            }
                                            return ""
                                        })}
                                    </div>
                                );
                            })
                        }
                    </Row>
                </Grid>
                
                <span
                    style={{
                        paddingLeft: '95px',
                        paddingTop: '30px',
                        textTransform: 'uppercase',
                        fontSize: '14px',
                        fontWeight: 'bold',
                    }}>
                    Trending  comments</span>
                <Grid fluid={true}>
                    <Row center="lg">
                        {
                            comment && Object.keys(comment).map(article => {
                                var count = 0;
                                return (
                                    comment[article].group && comment[article].reduction &&
                                    <div>
                                        {comment[article].reduction.map((news) => {
                                            
                                            let content = "";
                                            if (news.languages == targetLang && count < 1) {
                                                count = count + 1;
                                                content =  <ExpandableComment comment={news.comment}/>;
                                                
                                                return <Col xs md lg key={`${news.id}`}>{content}</Col>
                                            }
                                            return ""
                                        })}
                                    </div>
                                );
                            })
                        }
                    </Row>
                
                </Grid>
                
                
                <span
                    style={{
                        paddingLeft: '95px',
                        paddingTop: '30px',
                        textTransform: 'uppercase',
                        fontSize: '14px',
                        fontWeight: 'bold',
                    }}>
                    Trending  commentators</span>
                <Grid fluid={true}>
                    <Row center="md">
                        {
                            commentators && Object.keys(commentators).map(article => {
                                var count = 0;
                                return (
                                    commentators[article].group && commentators[article].reduction &&
                                    <div>
                                        {commentators[article].reduction.map((news) => {
                                            
                                            let content = "";
                                            if (news.languages == targetLang && count < 1) {
                                                count = count + 1;
                                                content = <a href={this.getCommentatorLink(news)}>
                                                    <Card key={news.id} style={style}>
                                                        <CardHeader title={commentators[article].group[1]}
                                                                    subtitle={<span style={{fontSize: '12 !important'}}>by <b>{news.nick}</b> {moment(news.maxDate).format('MMMM Do YYYY, h:mm')}</span>}
                                                                    avatar={<img style={{height: '24px', width: '24px'}}
                                                                                 src={`/static/img/sources/${commentators[article].group[1]}.png`}/>}/>
                                                        
                                                        <CardTitle
                                                            title={<span
                                                                style={{fontSize: '14px !important'}}>{`Total Comments: ${news.totalComments}`}</span>}
                                                            subtitle={<span
                                                                style={{fontSize: '12px !important'}}>{this.getTitle(news.slug)}</span>}/>
                                                    </Card>
                                                </a>
                                                
                                                return <Col key={news.id} xs={12} md={6}>{content}</Col>
                                            }
                                            return ""
                                        })}
                                    </div>
                                );
                            })
                        }
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
