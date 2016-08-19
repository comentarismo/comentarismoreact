import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadProductDetail } from 'actions/products'

import ReactDOM from 'react-dom';
var ImageComponent = require('components/Image');
var MainNavbar = require('components/MainNavbar');

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

class Product extends Component {
    static fetchData({ store, params }) {
        let { id } = params
        return store.dispatch(loadProductDetail({id}))
    }

    componentDidMount() {
        var src;
        // use meta:og image if available
        if (this.props.article && this.props.article.image) {
            src = this.props.article.image;
        }
        var id = this.props.article.id;

        var host = "http://img.comentarismo.com/r";
        console.log("IMGRESIZER ", this.props.article.image);

        //do img resize
        var request = $.ajax({
            url: host + '/img/',
            type: 'post',
            data: {
                url: this.props.article.image,
                width: width,
                height: height,
                quality: quality
            },
            mimeType: "text/plain; charset=x-user-defined"
        });
        request.done(function (binaryData) {
            if (binaryData && binaryData !== "") {
                console.log("imgresizer DONE OK");
                var base64Data = base64Encode(binaryData);
                var src = "data:image/jpeg;base64," + base64Data;
                $(".profile-bg-products").attr("src", src);
            } else {
                console.log("IMGRESIZER failed, will use default identicon for it");
                $("#fb-" + id).show();
                $("#img-" + id).hide();
            }
        });
        request.error(function (err) {
            console.log("IMGRESIZER failed, will use default identicon for it");
            $("#fb-" + id).show();
            $("#img-" + id).hide();
        });
    }

    getImageElement() {
        var src = "/static/img/ajax-loader.gif";
        var srcfallback = "/static/img/comentarismo-bg-450-150.png";
        return src ?
            <ImageComponent forceUpdate={true} src={src} srcfallback={srcfallback}
                            classes={'img-thumbnail profile-bg-products'}/> : null;
    }

    getMoreImages() {
        if (typeof window !== 'undefined' && this.props.article.images_url){
            return <Slider images={this.props.article.images_url} isInfinite={false} delay={5000}/>;
        }else {
            return this.getImageElement()
        }
    }

    render() {
        let { article } = this.props;

        console.log(this.props)

        if (!article || !article.operator) {
            return (
                <div>
                    <MainNavbar/>
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

        return (
            <div>
                <Helmet
                    htmlAttributes={{"lang": "en"}} // amp takes no value
                    title={`Latest news - Source - ${article.operator ? article.operator.toUpperCase(): ""} - Genre: ${article.genre ? article.genre.toUpperCase(): ""}`}
                    titleTemplate="Comentarismo.com - %s"
                    meta={[
                    {"name": "description", "content": `Find the most active commentators of the ${this.props.params.value} in several categories like world news, sports, business, technology, analysis and reviews from the world's leading liberal comments website.`},
                    {"property": "og:type", "content": "article"},

                    {"property": "og:audio", "content": `${article.permalink_url ? article.permalink_url : ''}`},

                    {"property": "og:image", "content": `${article.image ? article.image : "http://comentarismo.com/static/img/comentarismo-extra-mini-logo.png" }`}
                ]}
                    onChangeClientState={(newState) => console.log(newState)}
                />
                <MainNavbar/>
                <div className="container-fluid single-post-wrapper col-sm-offset-0 col-lg-12 col-xs-12">
                    <a id="comentarismo-page" data-id={ article.titleurlize }/>
                    <a id="comentarismo-operator" data-id={ article.operator }/>
                    <div className="tm-embed-container" id="scriptContainer">
                    </div>
                    <XScript index="titleurlize"/>
                    <div className="row single-post-row">
                        <div className="article-body">
                            <div className="container">
                                <div className="row">
                                    <div className="profile-div col-sm-9 col-xs-12 ">

                                        <div className="profile-divStats">
                                            <ul className="profile-commentsfollowfollowers">

                                                <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block">Title</span>
                                                    <span className="profile-StatValue">{ article.title }</span>
                                                </li>
                                            </ul>
                                        </div>


                                        {this.getMoreImages()}


                                        <div id={"fb-"+article.id} style={{"display": "none"}} className="fb-image">
                                            <div className="col-xs-12 col-md-2">
                                                <Icon nick={article.titleurlize} size={205}/>
                                            </div>
                                            <div className="col-xs-12 col-md-2">
                                                <Icon nick={article.titleurlize} size={205}/>
                                            </div>
                                            <div className="col-xs-12 col-md-2">
                                                <Icon nick={article.titleurlize} size={205}/>
                                            </div>
                                            <div className="col-xs-12 col-md-2">
                                                <Icon nick={article.titleurlize} size={205}/>
                                            </div>
                                            <div className="col-xs-12 col-md-2">
                                                <Icon nick={article.titleurlize} size={205}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12" style={{height: '25px'}}></div>
                                    <div>
                                        <div className="profile-button">

                                        </div>
                                        <div className="profile-nick">
                                            <div className="profile-nickName">

                                            </div>
                                        </div>

                                        <XSoundcloud permalink_url={article.permalink_url}/>
                                        <div className="profile-divStats">
                                            <ul className="profile-commentsfollowfollowers">
                                                <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block">Rating: {this.props.article.rating}</span>
                                                    <span
                                                        className={"stars-container stars-"+Math.round(this.props.article.rating ? this.props.article.rating : 0)}>★★★★★</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="profile-divStats">
                                            <ul className="profile-commentsfollowfollowers">
                                                <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block">Resume</span>
                                                    <span className="profile-StatValue">{ getContentBody() }</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="profile-divStats">
                                            <ul className="profile-commentsfollowfollowers">
                                                <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block">Last Update</span>
                                                        <span className="profile-StatValue"><Date
                                                            date={this.props.article.date}/></span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="profile-divStats">
                                            <ul className="profile-commentsfollowfollowers">
                                                <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block">Brand</span>
                                                    <span
                                                        className="profile-StatValue">{this.props.article.brand}</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="profile-divStats">
                                            <ul className="profile-commentsfollowfollowers">
                                                <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block">Categories</span>
                                                    <span
                                                        className="profile-StatValue">{this.props.article.categories}</span>
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
                                                <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block">Followers</span>
                                                    <span className="profile-StatValue"/>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="col-xs-12" style={{height: '25px'}}></div>

                                </div>

                                <div id="comentarismo-container" className="comentarismo-comment"
                                     className="col-md-12">
                                    {
                                        article.comments.map((q)=> {
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
                        </div>
                    </div>
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

export { Product }
export default connect(mapStateToProps, {loadProductDetail})(Product)
