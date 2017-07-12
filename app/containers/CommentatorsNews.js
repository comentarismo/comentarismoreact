import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadCommentators } from 'actions/commentators'
import { Link } from 'react-router'
import _ from 'lodash'

var InfiniteScroll = require('./InfiniteScroll')(React);
import {getAllByIndexFilterSkipLimit} from '../middleware/sa';

import Icon from "components/Icon"
import Date from "components/Date"
import Helmet from "react-helmet";

import { Tabs, Tab } from 'material-ui/Tabs';
import Autocomplete from 'components/Autocomplete'
class CommentatorsNewsContainer extends Component {
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
        
        const index = this.props.params.index;
        const value = this.props.params.value;

        return (
            <div>
                <Helmet
                    htmlAttributes={{"lang": "en"}} // amp takes no value
                    title={`Latest Comments - Category - ${this.props.params.value ? this.props.params.value.toUpperCase() : ""} `}
                    titleTemplate="Comentarismo.com - %s"
                    meta={[
                    {"name": "description", "content": `Find the most active commentators of the ${this.props.params.value} in several categories like world news, sports, business, technology, analysis and reviews from the world's leading liberal comments website.`},
                    {"property": "og:type", "content": "comments"},
                    {"property": "og:image", "content": '//comentarismo.com/static/img/comentarismo-extra-mini-logo.png'}
                ]}
                />
    
                <Tabs style={{
                    width: '100%',
                    height: '100%',
                    paddingBottom: '75px'
                }} initialSelectedIndex={1}>
                    <Tab label="News" onActive={function () {
                        document.location.href = `/news/${index}/${value}`;
                    }} style={{
                        background: '#f5f5f5',
                        color: '#333',
                        height: '84px'
                    }}>
                        <Autocomplete placeHolder={"Commentators"}
                                      hintText={"Recommend me latest news"}/>
                    </Tab>
        
                    <Tab label="Commentators" onActive={function () {
                        document.location.href = `/commentators_news/${index}/${value}`;
                    }} style={{
                        background: '#f5f5f5',
                        color: '#333',
                        height: '84px'
                    }}>
                        <Autocomplete placeHolder={"Commentators"}
                                      hintText={"Recommend me Commentators"}/>
                    </Tab>
    
                </Tabs>
                
                <div className="row single-post-row">
                    <div className="col-sm-12 col-sm-offset-0 col-xs-12 article-body">
                        <div className="col-xs-12">
                            <div className="content">
                                <div className="posts">
                                    <InfiniteScroll
                                        ref='masonryContainer'
                                        skip={0}
                                        limit={30}
                                        loader={this.getLoaderElement()}
                                        loadMore={this.handlePageChange.bind(this)}
                                        hasMore={this.state.hasMore}>
                                        {
                                            this.state.articles.map((q)=> {
                                                return (
                                                    <div className="col-lg-3 col-md-3 col-sm-5 col-xs-10">
                                                        <a href={`/commentator_news/${q.id}`} className='thumbnail article'>
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

export { CommentatorsNewsContainer }
export default connect(mapStateToProps, {loadCommentators})(CommentatorsNewsContainer)
