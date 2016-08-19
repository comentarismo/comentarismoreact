import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadProducts } from 'actions/products'
import { Link } from 'react-router'
import _ from 'lodash'
var MainNavbar = require('components/MainNavbar');

import {getAllByIndexFilterSkipLimit} from '../middleware/sa'

var Product = require('components/Product');

var InfiniteScroll = require('./InfiniteScroll')(React);
import Helmet from "react-helmet";

class ProductContainer extends Component {
    //static fetchData({ store, params }) {
    //    let { index,value } = params;
    //    return store.dispatch(loadArticles({index, value}))
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
        getAllByIndexFilterSkipLimit("product", index, value, skip, limit, "date", function (err, res) {
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
                    title={`Latest news - Category - ${this.props.params.value ? this.props.params.value.toUpperCase() : ""} `}
                    titleTemplate="Comentarismo.com - %s"
                    meta={[
                    {"name": "description", "content": `Find the most active commentators of the ${this.props.params.value} in several categories like world news, sports, business, technology, analysis and reviews from the world's leading liberal comments website.`},
                    {"property": "og:type", "content": "article"},
                    {"property": "og:image", "content": 'http://comentarismo.com/static/img/comentarismo-extra-mini-logo.png'}
                ]}
                    onChangeClientState={(newState) => console.log(newState)}
                />
                <MainNavbar/>
                <Link to="/">Back to Home</Link>
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
                                            this.state.articles.map(function (article) {
                                                return (
                                                    <Product
                                                        key={article.id}
                                                        article={article}
                                                    />
                                                );
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
    return {
        articles: state.articles,
        page: 50,
        hasMore: true,
        perPage: 50,
        index_: state.index_,
        value_: state.value_
    }
}

export { ProductContainer }
export default connect(mapStateToProps, {loadProducts})(ProductContainer)