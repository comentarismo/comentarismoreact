import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {loadProducts} from 'actions/products'
import _ from 'lodash'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import {getAllByRangeIndexOrderByFilterSkipLimit} from '../middleware/sa'

var Product = require('components/Product');

var InfiniteScroll = require('./InfiniteScroll')(React);
import Helmet from "react-helmet";
import { Tabs, Tab } from 'material-ui/Tabs';
import Autocomplete from 'components/Autocomplete'

class ProductContainer extends Component {
    static fetchData({store, params}) {
        let {index, value} = params;
        return store.dispatch(loadProducts({index, value}))
    }

    constructor(props) {
        super();
        this.state = {
            skip: 0,
            limit: 5,
            articles: props.articles,
            hasMore: true
        };
    }

    handlePageChange(skip, limit) {
        var index = this.props.params.index;
        var value = this.props.params.value;
        //console.log(index,value);
        getAllByRangeIndexOrderByFilterSkipLimit("product", index, value, skip, limit, "date", "desc", 10,function (err, res) {
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
        if (!this.state.articles) {
            this.state.articles = [];
        }
        return (
            <div>
                <Helmet
                    htmlAttributes={{"lang": "en"}} // amp takes no value
                    title={`Latest Products - Category - ${this.props.params.value ? this.props.params.value.toUpperCase() : ""} `}
                    titleTemplate="Comentarismo.com - %s"
                    meta={[
                        {
                            "name": "description",
                            "content": `Find the most active commentators of the ${this.props.params.value} in several categories like world most wanted products, amazon, best seller, technology, analysis and reviews from the world's leading liberal comments website.`
                        },
                        {"property": "og:type", "content": "article"},
                        {
                            "property": "og:image",
                            "content": '//comentarismo.com/static/img/comentarismo-extra-mini-logo.png'
                        }
                    ]}
                />
    
                <Card>
                <Tabs style={{
                    width: '100%',
                    height: '100%',
                    paddingBottom: '75px'
                }}>
                    <Tab label="Products" onActive={function () {
                        document.location.href = "/product/genre/bestseller";
                    }} style={{
                        background: '#f5f5f5',
                        color: '#333',
                        height: '84px'
                    }}>
                        <Autocomplete placeHolder={"Products"}
                                      hintText={"Recommend me latest products"}/>
                    </Tab>
                    
                    <Tab label="Commentators" onActive={function () {
                        document.location.href = "/commentators_product/operator/amazon";
                    }} style={{
                        background: '#f5f5f5',
                        color: '#333',
                        height: '84px'
                    }}>
                        <Autocomplete placeHolder={"Commentators"}
                                      hintText={"Recommend me Commentators"}/>
                    </Tab>
                  
                </Tabs>
 
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
                </Card>
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

export {ProductContainer}
export default connect(mapStateToProps, {loadProducts})(ProductContainer)
