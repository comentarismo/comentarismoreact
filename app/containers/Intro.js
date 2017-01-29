import React, {Component, ReactClass, PropTypes} from 'react';

import {connect} from 'react-redux';

import Helmet from "react-helmet";

import {PlayComment} from './PlayComment';
import {loadIntroDetail} from 'actions/intro'

import WorldRank from 'components/WorldRank';
import {YoutubeReportRun} from "containers/YoutubeReportRun";

import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Subheader from 'material-ui/Subheader';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Paper from 'material-ui/Paper';


const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },

};

var Article = require('components/Article');


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

    render() {//languages/english/0/5/
        let {comment} = this.props;
        comment && Object.keys(comment).map(article => {
            return (
                console.log(comment[article])
            );
        });

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
                    onChangeClientState={(newState) => console.log(newState)}
                />
                {/*React.Children.map(inputs, input => (*/}

                <div className="">
                    <div className="">
                        <div className="">
                            <div className="">
                                <div className="">
                                    {
                                        comment && Object.keys(comment).map(article => {
                                            return (
                                                comment[article].group && comment[article].reduction &&
                                                <Paper style={{ textAlign: 'center'}}>

                                                    {comment[article].reduction.map((news) => (


                                                        news.languages == targetLang ? (

                                                            <a href={this.getArticleLink(news)}
                                                               className=''>

                                                                <Card style={{
                                                                    width: '60%',
                                                                    display: 'inline-flex',
                                                                    padding: 30,
                                                                }}>

                                                                    <CardHeader title={comment[article].group[1]}
                                                                                subtitle={
                                                                                    <span>by <b>{news.author}</b>

                                                                                </span>}

                                                                                avatar={<img
                                                                                    style={{
                                                                                        height: '24px',
                                                                                        width: '24px'
                                                                                    }}
                                                                                    src={`/static/img/sources/${comment[article].group[1]}.png`}/>}/>

                                                                    <CardMedia overlay={<CardTitle title={news.title}
                                                                    />}>
                                                                        <img src={news.image}/>
                                                                    </CardMedia>
                                                                    <CardTitle
                                                                        title={`Total Comments: ${news.totalComments}`}
                                                                        subtitle={news.summary}/>

                                                                </Card>
                                                            </a>
                                                        ) : ''

                                                    ))}
                                                </Paper>





                                            );
                                        })
                                    }
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
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
