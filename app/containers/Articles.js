import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {loadGenres} from 'actions/genres'
import {Link} from 'react-router'
import _ from 'lodash'
import RaisedButton from 'material-ui/RaisedButton';
import MobileTearSheet from 'components/MobileTearSheet';

import {getAllByRangeIndexOrderByFilterSkipLimit} from '../middleware/sa'

var Article = require('components/Article');

var InfiniteScroll = require('./InfiniteScroll')(React);
import Helmet from "react-helmet";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

const style = {
    margin: 12,
};

class ArticleContainer extends Component {
    static fetchData({store, params}) {
        let {index, value} = params;
        return store.dispatch(loadGenres({table: "news", index: "operator_genre", value: value}))
    }

    constructor(props) {
        super();
        this.state = {
            skip: 0,
            limit: 5,
            articles: [],
            genres: [],
            hasMore: true
        };
    }

    handlePageChange(skip, limit) {
        var index = this.props.params.index;
        var value = this.props.params.value;
        //console.log(index,value);
        getAllByRangeIndexOrderByFilterSkipLimit("news", index, value, skip, limit, "date", "desc", 10, function (err, res) {
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
                    title={`Latest news - Category - ${this.props.params.value ? this.props.params.value.toUpperCase() : ""} `}
                    titleTemplate="Comentarismo.com - %s"
                    meta={[
                        {
                            "name": "description",
                            "content": `Find the most active commentators of the ${this.props.params.value} in several categories like world news, sports, business, technology, analysis and reviews from the world's leading liberal comments website.`
                        },
                        {"property": "og:type", "content": "article"},
                        {
                            "property": "og:image",
                            "content": 'http://comentarismo.com/static/img/comentarismo-extra-mini-logo.png'
                        }
                    ]}
                />
                <Card>
                    { this.props.genres && this.props.genres.length > 0 &&
                    <MobileTearSheet >
                        {this.props.genres.map(function (a) {
                            return <RaisedButton key={a[1]} href={"/news/genre/" + a[1]} label={a[1]} style={style}/>
                        })}
                    </MobileTearSheet>
                    }

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
                                    <Article
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
        value_: state.value_,
        genres: state.genres,
    }
}

export {ArticleContainer}
export default connect(mapStateToProps, {loadGenres})(ArticleContainer)
