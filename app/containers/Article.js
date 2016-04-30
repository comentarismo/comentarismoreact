import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadArticleDetail } from 'actions/articles'
import ReactDOM from 'react-dom';
var ImageComponent = require('components/Image');

class XScript extends React.Component {
    static initScripts(el, url) {
        var script = document.createElement('script')
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', url);
        el.appendChild(script);
    }

    componentDidMount() {
        XScript.initScripts(ReactDOM.findDOMNode(this.refs['it']), "/vendor/comentarismo-client.js");
    }

    render() {
        return <div ref="it"
                    dangerouslySetInnerHTML={{__html:
                    '<script type="text/javascript" src="/vendor/comentarismo-client.js"></script>' +
                    '<script>$(function () {' +
                      'var operator = $("#comentarismo-operator").attr("data-id"); ' +
                      'var page = $("#comentarismo-page").attr("data-id"); '+
                        'var comentarismo = new Comentarismo({' +
                            'host: "api.comentarismo.com",' +
                            //cached: "elk.comentarismo.com",
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

class Article extends Component {
    static fetchData({ store, params }) {
        let { id } = params
        return store.dispatch(loadArticleDetail({id}))
    }

    //componentDidMount() {
    //    let { id } = this.props.params
    //    this.props.loadArticleDetail({id})
    //}

    getImageElement() {
        var src;
        // use meta:og image if available
        if (this.props.article && this.props.article.image) {
            src = this.props.article.image;
        }
        // use default image if meta:og is missing
        if (!src && this.props.article.image) {
            src = "/static/img/comentarismo-extra-mini-logo.png";
        }
        return src ? <ImageComponent forceUpdate={true} src={src} classes={'profile-bg-news'}/> : null;
    }


    render() {
        let { article } = this.props;

        function getContentBody() {
            if (!article.resume) return;
            return <div id='content' className=''
                        dangerouslySetInnerHTML={{__html: article.resume}}></div>
        }

        return (
            <div className="container-fluid single-post-wrapper">
                <a id="comentarismo-page" data-id={ article.titleurlize }/>
                <a id="comentarismo-operator" data-id={ article.operator }/>
                <div className="tm-embed-container" id="scriptContainer">
                </div>
                <XScript/>
                <div style={{height: '50px'}}></div>
                <div className="row single-post-row">
                    <div className="col-sm-10 col-sm-offset-1 col-xs-12 article-body ">
                        <div className="container">
                            <div className="row">
                                <div className="profile-div">
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
                                                    <span className="profile-StatValue">{ article.date }</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="profile-divStats">
                                            <ul className="profile-commentsfollowfollowers">
                                                <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block">Countries</span>
                                                        <span
                                                            className="profile-StatValue">{ article.countries }</span>
                                                </li>
                                                <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block">Languages</span>
                                                        <span
                                                            className="profile-StatValue">{ article.languages }</span>
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

                            {
                                article.comments.map((q)=> {
                                    return (
                                        <div id="comentarismo-container" className="comentarismo-comment" key={q.id}
                                             className="col-md-12">
                                            <div className="col-sm-1 hidden-xs">
                                                <a className="avatar- img-responsive user-photo"/>
                                            </div>
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
