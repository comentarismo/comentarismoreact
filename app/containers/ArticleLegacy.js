import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadArticleLegacy } from 'actions/articles'
import ReactDOM from 'react-dom';
var ImageComponent = require('components/Image');
var MainNavbar = require('components/MainNavbar');

import Icon from "components/Icon"
import Date from "components/Date"
import Helmet from "react-helmet";

class XScript extends React.Component {
    static initScripts(el, url) {
        var script = document.createElement('script')
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', url);
        el.appendChild(script);
    }

    componentDidMount() {
        XScript.initScripts(ReactDOM.findDOMNode(this.refs['it']), "/static/comentarismo-client-min.js");
    }

    render() {
        return <div ref="it"
                    dangerouslySetInnerHTML={{__html:
                    '<script type="text/javascript" src="/static/comentarismo-client-min.js"></script>' +
                    '<script>$(function () {' +
                      'var operator = $("#comentarismo-operator").attr("data-id"); ' +
                      'var page = $("#comentarismo-page").attr("data-id"); '+
                        'var comentarismo = new Comentarismo({' +
                            'host: "api.comentarismo.com",' +
                            'cached: "elk.comentarismo.com",'+
                            'forum: "comentarismo-social",' +
                            'key: "-U7sw_7qY7vw-qCXi3M8KJPYSzMEOxEbZCnLUDBO7EGum8uKg2f5rreFIv8aSWS16jmNngoIRZHs",' +
                            'page: encodeURIComponent(page),' +
                            'operator: operator,' +
                            'index: "titleurlize"' +
                        '});' +
                      '});' +
                    '</script>'}}
        ></div>
    }
}

class ArticleLegacy extends Component {
    static fetchData({ store, params }) {
        let { index,value } = params
        return store.dispatch(loadArticleLegacy({index,value}))
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

        return src ? <ImageComponent forceUpdate={true} src={src} srcfallback={srcfallback} classes={'profile-bg-news'}/> : null;
    }

    render() {
        let { article } = this.props;

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
                    //{"property": "og:image", "content": 'http://comentarismo.com/static/img/comentarismo-extra-mini-logo.png'}
                    {"property": "og:image", "content": `${article.image}`}
                ]}
                    onChangeClientState={(newState) => console.log(newState)}
                />
                <MainNavbar/>
                <div className="container-fluid single-post-wrapper col-sm-offset-0 col-lg-12 col-xs-12">
                    <a id="comentarismo-page" data-id={ article.titleurlize }/>
                    <a id="comentarismo-operator" data-id={ article.operator }/>
                    <div className="tm-embed-container" id="scriptContainer">
                    </div>
                    <XScript/>
                    <div style={{height: '50px'}}></div>
                    <div className="row single-post-row">
                        <div className="article-body">
                            <div className="container">
                                <div className="row">
                                    <div className="profile-div">
                                        <img id={article.id} />
                                        {this.getImageElement()}
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
                                                        <span className="profile-StatValue"><Date date={article.date}/></span>
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
                                                    </div>†
                                                    <div className="text-wrapper">
                                                        <b>{q.date }</b>
                                                        <div role="meta" className="comentarismo-comment-header">
                                                        <span className="author">
                                                            <b>{ q.title }</b>
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
