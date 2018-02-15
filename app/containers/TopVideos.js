import React, {Component} from 'util/safe-react';
import {connect} from 'react-redux'
import Helmet from "react-helmet";
import PropTypes from 'prop-types';

import _ from 'lodash'

import {Tabs, Tab} from 'material-ui/Tabs';
import Autocomplete from 'components/Autocomplete'
import CircularProgress from 'material-ui/CircularProgress';


var Video = require('components/Video');
import {Grid,Row} from 'react-styled-flexboxgrid';

import {getAllByRangeIndexOrderByFilterSkipLimit} from '../middleware/sa'
var InfiniteScroll = require('./InfiniteScroll')(React);
import {YoutubeReportRun} from "containers/YoutubeReportRun";
import {loadArticles} from 'actions/articles'


class ArticleContainer extends Component {
    // static fetchData({store, params}) {
    //     let {index, value} = params;
    //     return store.dispatch(loadArticles({index, value}))
    // }
    
    constructor (props) {
        super()
        this.state = {
            skip: 0,
            limit: 5,
            articles: props.articles,
            hasMore: true,
        }
    }
    
    handlePageChange (skip, limit) {
        var index = this.props.params.index
        var value = this.props.params.value
        //console.log(index,value);
        getAllByRangeIndexOrderByFilterSkipLimit('sentiment_report', index,
            value, skip, limit, 'date', 'desc', 10, function (err, res) {
                // Do something
                if (err || !res || res.body.length === 0) {
                    //this.props.params.hasMore = false;
                    this.setState({hasMore: false})
                } else {
                    var articles = res.body
                    var hasMore = articles.length === limit
                    var newArticles = _.union(this.state.articles, articles)
                    
                    this.setState({
                        skip: skip,
                        limit: limit,
                        articles: newArticles,
                        hasMore: hasMore,
                    })
                    //console.log(`skip ${skip} limit ${limit}`);
                }
            }.bind(this))
    }
    
    getLoaderElement () {
        return (
            <div>
                <CircularProgress size={80} thickness={5} />
            </div>
        )
    }
    
    render () {
        if (!this.state.articles) {
            this.state.articles = []
        }
        return (
            <div>
                <Helmet
                    htmlAttributes={{'lang': 'en'}} // amp takes no value
                    title={`Latest news - Category - ${this.props.params.value
                        ? this.props.params.value.toUpperCase()
                        : ''} `}
                    titleTemplate="Comentarismo.com - %s"
                    meta={[
                        {
                            'name': 'description',
                            'content': `Find the most active commentators of the ${this.props.params.value} in several categories like world news, sports, business, technology, analysis and reviews from the world's leading liberal comments website.`,
                        },
                        {'property': 'og:type', 'content': 'article'},
                        {
                            'property': 'og:image',
                            'content': '//comentarismo.com/static/img/comentarismo-extra-mini-logo.png',
                        },
                    ]}
                />
                
                <Tabs style={{
                    width: '100%',
                    height: '100%',
                    paddingBottom: '75px',
                }} initialSelectedIndex={0}>
                    <Tab label="Videos" onActive={function () {
                        document.location.href = '/topvideos/type/YouTubeVideo'
                    }} style={{
                        background: '#f5f5f5',
                        color: '#333',
                        height: '84px',
                    }}>
                        <Autocomplete placeHolder={'Videos'}
                                      hintText={'Recommend me latest videos'}/>
                    </Tab>
                    
                    <Tab label="Commentators" onActive={function () {
                        document.location.href = '/commentators_video/operator/youtube'
                    }} style={{
                        background: '#f5f5f5',
                        color: '#333',
                        height: '84px',
                    }}>
                        <Autocomplete placeHolder={'Commentators'}
                                      hintText={'Recommend me Commentators'}/>
                    </Tab>
                
                </Tabs>
                
                <Grid fluid={true}>
                    <YoutubeReportRun/>
                    <InfiniteScroll
                        ref='masonryContainer'
                        skip={0}
                        limit={50}
                        loader={this.getLoaderElement()}
                        loadMore={this.handlePageChange.bind(this)}
                        hasMore={this.state.hasMore}>
                        <Row style={{ marginLeft: '5rem'}}>
                        {
                            this.state.articles.map(function (article) {
                                return (
                                    <Video
                                        key={article.id}
                                        video={article}
                                    />
                                )
                            })
                        }
                        </Row>
                    </InfiniteScroll>
                </Grid>
            </div>
        )
    }
}

function mapStateToProps (state) {
    return {
        articles: state.articles,
        page: 50,
        hasMore: true,
        perPage: 50,
        index_: state.index_,
        value_: state.value_,
    }
}

ArticleContainer.propTypes = {
    articles: PropTypes.any.isRequired,
}

export { ArticleContainer }
export default connect(mapStateToProps, {loadArticles})(ArticleContainer)
