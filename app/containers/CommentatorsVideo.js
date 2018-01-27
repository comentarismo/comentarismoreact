import React, { Component} from 'react'

import { connect } from 'react-redux'
import { loadCommentators } from 'actions/commentators'
import _ from 'lodash'

var InfiniteScroll = require('./InfiniteScroll')(React);
import {getAllByIndexFilterSkipLimit} from '../middleware/sa';

import Icon from "components/Icon"
import Helmet from "react-helmet";

import { Tabs, Tab } from 'material-ui/Tabs';
import {Card, CardHeader, CardMedia, CardTitle} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';

import moment from 'moment';
import {Grid, Row, Col} from 'react-styled-flexboxgrid';

import Autocomplete from 'components/Autocomplete'

const style = {
    height: '600px',
    width: '400px',
    textAlign: 'left',
    boxShadow: 'rgba(0, 0, 0, 0.0980392) 0px 1px 4px',
    borderRadius: '2px',
    margin: '20px 20px 20px 0'
};


class CommentatorsVideoContainer extends Component {
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
        getAllByIndexFilterSkipLimit("commentator_sentiment_report", index, value, skip, limit, "totalComments", function (err, res) {
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

    getLoaderElement () {
        return (
            <div>
                <CircularProgress size={80} thickness={5} />
            </div>
        )
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
                    {"property": "og:image", "content": '//comentarismo.com/static/img/comentarismo-extra-mini-logo.png'}
                ]}
                />
                <Tabs style={{
                    width: '100%',
                    height: '100%',
                    paddingBottom: '75px'
                }} initialSelectedIndex={1}>
                    <Tab label="Videos" onActive={function () {
                        document.location.href = "/topvideos/type/YouTubeVideo";
                    }} style={{
                        background: '#f5f5f5',
                        color: '#333',
                        height: '84px'
                    }}>
                        <Autocomplete placeHolder={"Commentators"}
                                      hintText={"Recommend me latest videos"}/>
                    </Tab>
        
                    <Tab label="Commentators" onActive={function () {
                        document.location.href = "/commentators_video/operator/youtube";
                    }} style={{
                        background: '#f5f5f5',
                        color: '#333',
                        height: '84px'
                    }}>
                        <Autocomplete placeHolder={"Commentators"}
                                      hintText={"Recommend me Commentators"}/>
                    </Tab>
    
                </Tabs>
                
                <Grid fluid={true}>
                    <InfiniteScroll
                        ref='masonryContainer'
                        skip={0}
                        limit={30}
                        loader={this.getLoaderElement()}
                        loadMore={this.handlePageChange.bind(this)}
                        hasMore={this.state.hasMore}>
                        <Row style={{ marginLeft: '5rem'}}>
                        {
                            
                            this.state.articles.map((comentator)=> {
                                return (
                                     <Row style={{ marginLeft: '5rem'}}>
                                        <a href={`/commentator_video/${comentator.id}`}>
                                             <Card key={comentator.id} style={style}>
                                                    <CardHeader
                                                                avatar={<Icon nick={comentator.nick}/>}/>
                                                    <CardMedia
                                                        overlay={<CardTitle
                                                            style={{height: '45px', padding: '0 10px'}} title={<span
                                                            style={{
                                                                fontSize: '14px !important',
                                                                lineHeight: '1.5'
                                                            }}>{comentator.nick}</span>}/>}>
                                                       
                                                    </CardMedia>
                                                    
                                                     <CardTitle
                                                         title={<div><b>Interests:</b>
                                                        {comentator.genre && Object.keys(comentator.genre).map(function (count, idx) {
                                                            return (count < 5 ? <span> {comentator.genre[idx]} </span> : '.')
                                                        }.bind(this))}</div>}
                                                         subtitle={<span style={{paddingTop: '5px', fontSize: '12px !important', textTransform: 'uppercase'}}> <b>Last seen:</b> {moment(comentator.maxDate).format('MMMM Do YYYY, h:mm')}</span>}
                                                     />
                                                 
                                                    <CardTitle
                                                        title={<span
                                                            style={{padding: '3px', background: '#656972', color: '#fff', fontSize: '12px !important', textTransform: 'uppercase'}}>Total  Comments {comentator.totalComments}</span>}/>
                                             </Card>
                                        </a>
                                     </Row>
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

function mapStateToProps(state) {
    return {commentators: state.commentators}
}

export { CommentatorsVideoContainer }
export default connect(mapStateToProps, {loadCommentators})(CommentatorsVideoContainer)
