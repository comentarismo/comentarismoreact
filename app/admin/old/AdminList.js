import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadCommentators } from 'actions/commentators'
import { Link } from 'react-router'
import _ from 'lodash'
var AdminNavbar = require('admin/AdminNavbar');

var InfiniteScroll = require('containers/InfiniteScroll')(React);
import {getAPIAllByIndexFilterSkipLimit} from 'middleware/sa';

import Icon from "components/Icon"
import Date from "components/Date"
import Helmet from "react-helmet";
import Image from "components/Image";

import {handleDeleteButton,handleSpamButton} from "./crud"
var $ = require("jquery");

import config from 'config'
var host = config.API_URL;

class CommentatorContainer extends Component {
    constructor(props) {
        super();
        this.state = {
            skip: 0,
            limit: 5,
            articles: [],
            hasMore: true,
            sidebarOpen: false, sidebarDocked: false
        };
    }

    handlePageChange(skip, limit) {
        var {table,sort,index,value} = this.props.params;
        console.log(skip, limit)
        getAPIAllByIndexFilterSkipLimit(table, index, value, skip, limit, sort, function (err, res) {
            // Do something
            if (err || !res || res.body.length == 0) {
                //this.props.params.hasMore = false;
                this.setState({hasMore: false});
            } else {
                var articles = res.body;
                var hasMore = articles.length == limit;
                var newArticles = _.union(this.state.articles, articles);

                this.setState({skip: skip, limit: limit, articles: newArticles, hasMore: hasMore});
                //console.log(`skip ${skip} limit ${limit}`);
            }
        }.bind(this));

    }

    getLoaderElement() {
        return (
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                <div className='thumbnail article text-center'>Loading <i className='fa fa-cog fa-spin'></i></div>
            </div>
        );
    }


    onSetSidebarOpen(open) {
        this.setState({sidebarOpen: open});
    }

    componentWillMount() {
        var mql = window.matchMedia(`(min-width: 800px)`);
        mql.addListener(this.mediaQueryChanged);
        this.setState({mql: mql, sidebarDocked: mql.matches});
    }

    componentWillUnmount() {
        this.state.mql.removeListener(this.mediaQueryChanged);
    }

    mediaQueryChanged() {
        this.setState({sidebarDocked: this.state.mql.matches});
    }

    render() {

        if (!this.state.articles) {
            this.state.articles = [];
        }

        var sidebarContent = <b>Sidebar content</b>;

        return (
            <div>
                <Helmet
                    htmlAttributes={{"lang": "en"}} // amp takes no value
                    title={`Latest Comments - Category - ${this.props.params.value ? this.props.params.value.toUpperCase() : ""} `}
                    titleTemplate="Comentarismo.com - %s"
                    meta={[
                        {"name": "description", "content": `Find the most active commentators of the ${this.props.params.value} in several categories like world news, sports, business, technology, analysis and reviews from the world's leading liberal comments website.`},
                        {"property": "og:type", "content": "comments"},
                        {"property": "og:image", "content": 'http://comentarismo.com/static/img/comentarismo-extra-mini-logo.png'}
                    ]}
                />
                <AdminNavbar/>

                <Sidebar sidebar={sidebarContent}
                         open={this.state.sidebarOpen}
                         docked={this.state.sidebarDocked}
                         onSetOpen={this.onSetSidebarOpen}>
                    <b>Main content</b>
                </Sidebar>

                <div className="row single-post-row">
                    <div className="col-sm-12 col-sm-offset-0 col-xs-12 article-body">
                        <div className="col-xs-12">
                            <div className="content">
                                <div className="posts">
                                    <InfiniteScroll
                                        ref='masonryContainer'
                                        skip={0}
                                        limit={50}
                                        loader={this.getLoaderElement()}
                                        loadMore={this.handlePageChange.bind(this)}
                                        hasMore={this.state.hasMore}>
                                        {
                                            this.state.articles.map((q)=> {
                                                if (this.props.params.table == "news") {
                                                    return (
                                                        <NewsList table={this.props.params.table} id={q.id}
                                                                  image={q.image} nick={q.nick}
                                                                  titleurlize={q.titleurlize} title={q.title}
                                                                  date={q.date} genre={q.genre}
                                                                  totalComments={q.totalComments}/>
                                                    )
                                                } else if (this.props.params.table == "commentaries") {
                                                    return (
                                                        <CommentsList table={this.props.params.table} id={q.id}
                                                                      nick={q.nick}
                                                                      operator={q.operator}
                                                                      titleurlize={q.titleurlize} title={q.title}
                                                                      date={q.date} genre={q.genre}
                                                                      comment={q.comment}/>
                                                    )
                                                } else if (this.props.params.table == "commentator") {
                                                    return (
                                                        <CommentatorList table={this.props.params.table} id={q.id}
                                                                         nick={q.nick}
                                                                         titleurlize={q.titleurlize} title={q.title}
                                                                         date={q.date} genre={q.genre}
                                                                         totalComments={q.totalComments}/>
                                                    )
                                                } else if (this.props.params.table == "user") {
                                                    return (
                                                        <UserList table={this.props.params.table} id={q.id}
                                                                  nickname={q.nickname}
                                                                  location={q.location}
                                                                  provider={q.provider}/>
                                                    )
                                                }
                                            })
                                        }
                                    </InfiniteScroll>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


var UserList = React.createClass({
    render: function () {
        var props = this.props;
        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 thumbnail article">
                <a href={`/admin/r/${props.table}/${props.id}`} className=''>
                    <div className="col-xs-2">
                        <div className="imageNoPadding">
                            <Icon nick={props.nickname} size={125}/>
                        </div>
                    </div>
                    <div className="col-xs-10">
                        <div className='caption'>
                            <h3 className='article-header'>{props.nickname}</h3>
                            <p> Location: {props.location}</p>
                            <p className='source'>Provider : {props.provider}</p>
                        </div>
                    </div>
                </a>
            </div>
        )
    }
});

var CommentatorList = React.createClass({
    render: function () {
        var props = this.props;
        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 thumbnail article">
                <a href={`/admin/r/${props.table}/${props.id}`} className=''>
                    <div className="col-xs-2">
                        <div className="imageNoPadding">
                            <Icon nick={props.nick} size={125}/>
                        </div>
                        <div className="col-xs-1">
                            <a href={`/admin/r/${props.table}/${props.id}`}><i className="fa fa-pencil-square-o"
                                                                               aria-hidden="true"/></a>
                        </div>
                        <div className="col-xs-1">
                            <a href="#" onClick={this.onclickSpam}><i className="fa fa-trash-o" aria-hidden="true"/></a>
                        </div>
                        <div className="col-xs-1">
                            <a href="#" onClick={this.onclickDelete}><i className="fa fa-times" aria-hidden="true"/></a>
                        </div>
                        <div id={`error-${props.id}`} className='error' style={{"display": "none"}}></div>
                    </div>
                    <div className="col-xs-10">
                        <div className='caption'>
                            <h3 className='article-header'>{props.nick}</h3>
                            <p>Last Seen: <Date date={props.maxDate}/></p>
                            Interest:
                            {props.genre && Object.keys(props.genre).map(function (char, idx) {
                                return <span key={idx}> {props.genre[idx]} </span>
                            }.bind(this))}
                            <p className='source'>Total Comments: {props.totalComments}</p>
                        </div>
                    </div>
                </a>
            </div>
        )
    }
});

var Sidebar = require('react-sidebar').default;

var CommentsList = React.createClass({

    onclickSpam: function (event) {
        var props = this.props;
        console.log("onclickSpam", props.id);
    },

    onclickDelete: function (event) {
        let {id} = this.props;
        var target = `${host}/delete/commentaries/${id}/`;
        console.log("onclickDelete", target);

        handleDeleteButton($, target, function (err) {
            if (!err) {
                $(`#${id}`).hide();
            } else {
                $(`#error-${id}`).html("delete failed " + JSON.stringify(err));

            }
        });
    },

    render: function () {
        var props = this.props;
        return (

            <div>

                <div id={props.id} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 thumbnail article">


                    <div className=''>
                        <div className="col-xs-2">
                            <div className="imageNoPadding">
                                <Icon nick={props.nick} size={125}/>
                            </div>
                            <div className="col-xs-1">
                                <a href={`/admin/r/${props.table}/${props.id}`}><i className="fa fa-pencil-square-o"
                                                                                   aria-hidden="true"/></a>
                            </div>
                            <div className="col-xs-1">
                                <a href="#" onClick={this.onclickSpam}><i className="fa fa-trash-o" aria-hidden="true"/></a>
                            </div>
                            <div className="col-xs-1">
                                <a href="#" onClick={this.onclickDelete}><i className="fa fa-times" aria-hidden="true"/></a>
                            </div>
                            <div id={`error-${props.id}`} className='error' style={{"display": "none"}}></div>
                        </div>
                        <div className="col-xs-10">
                            <div className='caption'>
                                <h3 className='article-header'>{props.title}</h3>
                                <p>Date: <Date date={props.date}/></p>
                                <p>Interest:
                                    {props.genre && Object.keys(props.genre).map(function (char, idx) {
                                        return <span key={idx}> {props.genre[idx]} </span>
                                    }.bind(this))}</p>
                                <div className='source' key={props.id}
                                     dangerouslySetInnerHTML={{__html:props.comment}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

var NewsList = React.createClass({
    render: function () {
        var props = this.props;
        return (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 thumbnail article">
                <a href={`/admin/r/${props.table}/${props.id}`} className=''>

                    <div className="col-xs-3">
                        <div className="imageNoPadding">
                            {props.image ? <Image src={props.image} classes={"img-responsive"}/> :
                                <Icon nick={props.titleurlize} size={125}/>  }
                        </div>
                    </div>
                    <div className="col-xs-9">
                        <div className='caption'>
                            <h3 className='article-header'>{props.title}</h3>
                            <p>Date: <Date date={props.date}/></p>
                            Interest:
                            {props.genre && Object.keys(props.genre).map(function (char, idx) {
                                return <span key={idx}> {props.genre[idx]} </span>
                            }.bind(this))}
                            <p className='source'>Total
                                Comments {props.totalComments}</p>
                        </div>
                    </div>
                </a>
            </div>
        )
    }
});


function mapStateToProps(state) {
    return {commentators: state.commentators}
}

export { CommentatorContainer }
export default connect(mapStateToProps, {loadCommentators})(CommentatorContainer)
