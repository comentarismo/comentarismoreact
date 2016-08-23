import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadArticleDetail } from 'actions/articles'
import ReactDOM from 'react-dom';
var MainNavbar = require('components/MainNavbar');

import Icon from "components/Icon"
import Date from "components/Date"
import Helmet from "react-helmet";
import Slider from 'containers/ImageSlider';
import {PlayImages} from './PlayImages';

import { Tabs,Tab } from 'react-bootstrap';


import {GoogleSearchScript} from 'components/GoogleSearchScript';

import {XScript} from 'components/XScript';
import {XSoundcloud} from 'components/XSoundcloud'
class Article extends Component {
    static fetchData({ store, params }) {
        let { id } = params
        return store.dispatch(loadArticleDetail({id}))
    }

    render() {
        let { article } = this.props;

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

        var searchlist = this.props.article.search;

        if(!searchlist){
            searchlist = [];
            searchlist.push({title: article.title,gimage:article.image});
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
                                    <div className="row">

                                        <div className="profile-divStats">
                                            <ul className="profile-commentsfollowfollowers">
                                                <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block">Title</span>
                                                    <span className="profile-StatValue">{ article.title }</span>
                                                </li>

                                            </ul>
                                        </div>

                                    </div>

                                    <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
                                        <Tab eventKey={1} title="Images">
                                            <PlayImages images={searchlist} playing={true}
                                                        playingtimeout={10000}/>
                                        </Tab>
                                        <Tab eventKey={2} title="Videos" disabled>
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


                                        <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
                                            <Tab eventKey={1} title="Resume">
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


                                        <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
                                            <Tab eventKey={1} title="Publish Date">
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
    return {article: state.articleDetail}
}

Article.propTypes = {
    article: PropTypes.object.isRequired
};

export { Article }
export default connect(mapStateToProps, {loadArticleDetail})(Article)
