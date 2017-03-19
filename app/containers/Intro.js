import React, {Component, ReactClass, PropTypes} from 'react';

import {connect} from 'react-redux';

import Helmet from "react-helmet";

import {loadIntroDetail} from 'actions/intro'

import {YoutubeReportRun} from "containers/YoutubeReportRun";

import {Card, CardHeader, CardMedia, CardTitle} from 'material-ui/Card';

import moment from 'moment';

var Article = require('components/Article');
var $ = require('jquery');


var quality = "50";

var base64Encode = require("../util/imgresizer").base64Encode;

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

    getTitle(title) {
        const t = title && title.length > 45 ? title.substring(0, 45) + "..." : title
        return (
            <span dangerouslySetInnerHTML={{__html:  t }}/>
        );
    }

    getImageElement(src, id) {
        if (typeof window !== 'undefined') {

            var host = "//img.comentarismo.com/r";
            console.log("IMGRESIZER ",src)
            //do img resize
            var request = $.ajax({
                url: host + '/img/',
                type: 'post',
                data: {
                    url: src,
                    quality: quality
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
        let {comment} = this.props;
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
            width: 330,
            margin: 30,
            textAlign: 'left',
            display: 'inline-block',
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
                <span style={{paddingLeft: '30px', textTransform: 'uppercase', fontSize: '16px', textDecoration: 'underline'}}>
                    Latest news from around the web</span>
                {
                    comment && Object.keys(comment).map(article => {
                        return (
                            comment[article].group && comment[article].reduction &&
                            <div>
                                {comment[article].reduction.map((news, i) => (
                                    news.languages == targetLang && i < 3 ? (
                                        <a href={this.getArticleLink(news)}>
                                            <Card key={news.id} style={style}>
                                                <CardHeader title={comment[article].group[1]}
                                                            subtitle={<span style={{ fontSize: '12 !important' }} >by <b>{news.author}</b> {moment(news.date).format('MMMM Do YYYY, h:mm')}</span>}
                                                            avatar={<img  style={{height: '24px', width: '24' }}  src={`/static/img/sources/${comment[article].group[1]}.png`}/>}/>
                                                <CardMedia
                                                    overlay={<CardTitle style={{ height: '45px', padding: '0 10px' }} title={<span style={{ fontSize: '14px !important', lineHeight: '1.5'}}>{news.title}</span>}/>}>
                                                    <div style={{width: '100%', height: '100%', left: '0px', top: '0px', zIndex: -1  }} id={"img-"+news.id}>
                                                        <img style={{width: '100%', height: '100%'}} id={news.id}/>
                                                        {this.getImageElement(news.image, news.id)}
                                                    </div>
                                                </CardMedia>
                                                <CardTitle
                                                    title={<span style={{ fontSize: '14px !important'}}>{`Total Comments: ${news.totalComments}`}</span>}
                                                    subtitle={<span style={{ fontSize: '12px !important' }}>{this.getTitle(news.summary)}</span>}/>
                                            </Card>
                                        </a>
                                    ) : ''
                                ))}
                            </div>
                        );
                    })
                }
            </div>

        );
    }
}


function mapStateToProps(state) {
    return {comment: state.introDetail}
}

Intro.propTypes = {
    comment: PropTypes.any.isRequired,
};


export {Intro}
export default connect(mapStateToProps, {loadIntroDetail})(Intro)
