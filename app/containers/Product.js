import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {loadProductDetail} from 'actions/products'

import ReactDOM from 'react-dom';
var ImageComponent = require('components/Image');

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import {Grid, Row, Col} from 'react-styled-flexboxgrid';
import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';

var ImageComponent = require('components/Image');
var ImageResized = require("components/ImageResized");


import Icon from "components/Icon"
import Date from "components/Date"
import Helmet from "react-helmet";

var width = "388";
var height = "395";
var quality = "50";
var $ = require('jquery');
var base64Encode = require("../util/imgresizer").base64Encode;

import {GoogleSearchScript} from 'components/GoogleSearchScript';

import {XScript} from 'components/XScriptProduct';
import {XSoundcloud} from 'components/XSoundcloud';

import Slider from 'containers/ImageSlider';

var shareButton = <button className="btn btn-primary"><i className="glyphicon glyphicon-link"/></button>

import {PlayImages} from './PlayImages';

import {Tabs, Tab} from 'react-bootstrap';

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

class Product extends Component {
    static fetchData({store, params}) {
        let {id} = params
        return store.dispatch(loadProductDetail({id}))
    }

    render() {
        let {article} = this.props;

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
            return <div>
                <div>
                    <span className="profile-StatLabel profile-block">Rating: {article.rating}</span>
                    <span
                        className={"stars-container stars-" + Math.round(article.rating ? article.rating : 0)}>★★★★★</span>
                </div>
                <div id='content' className=''
                     dangerouslySetInnerHTML={{__html: article.resume}}></div>
            </div>

        }

        var searchlist = this.props.article.search;

        if (!searchlist) {
            searchlist = [];
            searchlist.push({title: article.title, gimage: article.image});
        }

        var totalComments = article.totalComments ? `${article.totalComments} Comments` : "No Comments";

        return (
            <div>
                <a id="comentarismo-page" data-id={ article.titleurlize }/>
                <a id="comentarismo-operator" data-id={ article.operator }/>
                <XScript index="operator_titleurlize"/>

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
                <Grid fluid={true} style={{margin: '2rem'}}>
                    <FlatButton style={{color: '#656972 !important', opacity: '1', textTransform: 'uppercase', paddingLeft: '10px !important',
                                        fontSize: '14px',
                                        fontWeight: 'bold' }} disabled={true}
                                label={this.props.article.categories}/>
                    <Row className="col-xs-offset-1"
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
                                       title={article.title}
                                       subtitle={<span dangerouslySetInnerHTML={{__html: totalComments}}/>}
                            />
                            <CardText style={{paddingTop: '0px', paddingBottom: '0px'}}>{ getContentBody() }</CardText>
                            <CardActions>
                                <div style={{
                                        marginLeft: '10px',
                                        paddingBottom: '10px',
                                        color: '#656972',
                                        textTransform: 'uppercase',
                                        fontSize: '14px',
                                        }}> Trending words
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

                <div id="comentarismo-container"
                     className="comentarismo-comment col-md-12">
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


function mapStateToProps(state) {
    return {article: state.productDetail}
}

Product.propTypes = {
    article: PropTypes.object.isRequired
};

export {Product}
export default connect(mapStateToProps, {loadProductDetail})(Product)
