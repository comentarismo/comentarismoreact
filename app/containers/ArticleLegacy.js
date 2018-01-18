import React, { Component} from 'react'
import PropTypes from 'prop-types';

import { connect } from 'react-redux'
import { loadArticleLegacy } from 'actions/articles'
import ReactDOM from 'react-dom';
var ImageComponent = require('components/Image');

import Icon from "components/Icon"
import Date from "components/Date"
import Helmet from "react-helmet";

import { Notfound } from 'containers/Notfound'
import {GoogleSearchScript} from 'components/GoogleSearchScript';

import XScript from 'components/XScript';
import {XSoundcloud} from 'components/XSoundcloud'

class ArticleLegacy extends Component {
    static fetchData({ store, params }) {
        let { index,value } = params
        return store.dispatch(loadArticleLegacy({index, value}))
    }


    getImageElement() {
        let { article } = this.props;
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
        let { article } = this.props;

        if (!article.comments) {
            return (
                <div>
                    <div>
                        <div className="col-xs-6">
                            <h3>The page you are looking for might have been removed, had its name
                                changed, or is
                                temporarily unavailable.</h3>
                            <div className="image">
                                <img className="img img-responsive"
                                     src="/static/img/404notfound.jpeg"/>
                            </div>
                            <div className="text-404">

                                <p>Please Use the Google Search box below and optimize your
                                    search </p>
                            </div>
                        </div>
                        <GoogleSearchScript search={this.props.params}/>
                    </div>
                    <div className="clearfix"></div>
                    <footer className="footer bg-dark">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12 text-center">
                                    <p className="copyright">© 2017 Comentarismo.com</p>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            )
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

                    //{"property": "og:image", "content": 'http://comentarismo.com/static/img/comentarismo-extra-mini-logo.png'}
                    {"property": "og:image", "content": `${article.image}`}
                ]}
                />
                <div className="container-fluid single-post-wrapper col-sm-offset-0 col-lg-12 col-xs-12">
                    <a id="comentarismo-page" data-id={ article.titleurlize }/>
                    <a id="comentarismo-operator" data-id={ article.operator }/>
                    <div className="tm-embed-container" id="scriptContainer">
                    </div>
                    <div style={{height: '50px'}}></div>
                    <div className="row single-post-row">
                        <div className="article-body">
                            <div className="container">
                                <div className="row">
                                    <div className="profile-div">
                                        <img id={article.id}/>
                                        {this.getImageElement()}
                                    </div>
                                    <div>
                                        <div className="profile-button">
                                            <button className="btn btn-primary"><i
                                                className="glyphicon glyphicon-pencil"/>
                                            </button>
                                        </div>
                                        <div className="profile-nick">
                                            <div className="profile-nickName">
                                                { article.title }
                                            </div>
                                        </div>

                                        <XSoundcloud permalink_url={article.permalink_url}/>

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
                                                            className="profile-StatLabel profile-block">Publish Date</span>
                                                    <span className="profile-StatValue"><Date
                                                        date={article.date}/></span>
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

                                <div id="comentarismo-container"
                                     className="comentarismo-comment col-md-12">
                                    {
                                        article.comments.map((q)=> {
                                            return (
                                                <div key={q.id}>
                                                    <div className="col-sm-1 hidden-xs">
                                                        <a className="avatar- img-responsive user-photo"/>
                                                        <Icon nick={q.nick} size={50}/>
                                                    </div>
                                                    <div className="text-wrapper">
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
    return {article: state.articleDetail}
}

ArticleLegacy.propTypes = {
    article: PropTypes.object.isRequired
};

export { ArticleLegacy }
export default connect(mapStateToProps, {loadArticleLegacy})(ArticleLegacy)
