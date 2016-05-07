import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadCommentators } from 'actions/commentators'
import { Link } from 'react-router'
import _ from 'lodash'
var MainNavbar = require('components/MainNavbar');

var InfiniteScroll = require('./InfiniteScroll')(React);
import {getAllByIndexFilterSkipLimit} from '../middleware/sa';

import Icon from "components/Icon"
import Date from "components/Date"
import Helmet from "react-helmet";

class CommentatorContainer extends Component {
    //static fetchData({ store, params }) {
    //    let { index,value } = params
    //    return store.dispatch(loadCommentators({index, value}))
    //}

    //componentDidMount() {
    //    let { index,value } = this.props.params
    //    this.props.loadCommentators({index, value})
    //}

    constructor(props) {
        super();
        this.state = {
            skip: 0,
            limit: 5,
            articles: [],
            hasMore: true
        };
    }

    handlePageChange(skip, limit) {
        var index = this.props.params.index;
        var value = this.props.params.value;
        //console.log(index,value);
        getAllByIndexFilterSkipLimit("commentator", index, value, skip, limit, "totalComments", function (err, res) {
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

    render() {

        if (!this.state.articles){
            this.state.articles = [];
        }

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
                    onChangeClientState={(newState) => console.log(newState)}
                />
                <MainNavbar/>
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
                                                return (
                                                    <div className="col-lg-3 col-md-3 col-sm-5 col-xs-10">
                                                        <a href={`/commentators/${q.id}`} className='thumbnail article'>
                                                            <div className="imageNoPadding">
                                                                <Icon nick={q.nick}/>
                                                            </div>
                                                            <div className='caption'>
                                                                <h3 className='article-header'>{q.nick}</h3>
                                                                <p>Last seen: <Date date={q.maxDate}/></p>
                                                                Interest:
                                                                {q.genre && Object.keys(q.genre).map(function (char, idx) {
                                                                    return <span> {q.genre[idx]} </span>
                                                                }.bind(this))}
                                                                <p className='source'>Total
                                                                    Comments {q.totalComments}</p>
                                                            </div>
                                                        </a>
                                                    </div>
                                                )
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

function mapStateToProps(state) {
    return {commentators: state.commentators}
}

export { CommentatorContainer }
export default connect(mapStateToProps, {loadCommentators})(CommentatorContainer)
