import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'
import { loadCommentatorDetail } from 'actions/commentators'
import {XScript} from 'components/XScriptProduct'
import Icon from "components/Icon"

import Date from "components/Date"
import Helmet from "react-helmet";
var moment = require("moment");

const table = "commentator_product";
const  $ = require("jquery");

class Commentator extends Component {
    static fetchData({ store, params }) {
        let { id } = params;
        return store.dispatch(loadCommentatorDetail({id,table}))
    }

    componentDidMount() {
        // let { id } = this.props.params;
        // this.props.loadCommentatorDetail({id,table})
    }

    render() {
        let { commentator } = this.props;
        if (!commentator.comments){
            commentator.comments = [];
        }
        let { id } = this.props.params;

        var commentContainer = <XScript index="operator_nick"/>;

        var commentsavgperday = 0.0;

        try {
            var targetDate = moment();
            if(commentator.minDate){
                targetDate = moment(commentator.minDate);
            }
            var today = moment();

            var diffInDays = today.diff(targetDate, 'days'); // x days

            console.log("commentsavgperday, diffInDays, ",diffInDays)

            if(diffInDays > 0) {
                commentsavgperday = parseFloat(commentator.totalComments) / (parseFloat(diffInDays) / parseFloat(24))
            }
        }catch(e){
            console.log("Error when getting commentsavgperday :| ",e, id);
        }

        if (typeof window !== 'undefined') {
            $(".progress-bar").attr('aria-valuenow', 100)
                .css({'width': 100 + '%'})
                .text('Comments Analyzed: ' + 100 + '%');
        }

        return (
            <div>
                <Helmet
                    htmlAttributes={{"lang": "en"}} // amp takes no value
                    title={`Latest Comments - Commentator Profile -> @${commentator.slug && typeof commentator.slug.toUpperCase === "function" ? commentator.slug.toUpperCase() : commentator.nick} `}
                    titleTemplate="Comentarismo.com - %s"
                    meta={[
                    {"name": "description", "content": `Find all comments for @${commentator.slug && typeof commentator.slug.toUpperCase === "function" ? commentator.slug.toUpperCase() : commentator.nick} - the world's leading liberal comments website.`},
                    {"property": "og:type", "content": "comments"},
                    {"property": "og:image", "content": '/static/img/comentarismo-extra-mini-logo.png'}
                ]}
                />
                <div className="container-fluid single-post-wrapper">
                    <a id="comentarismo-page" data-id={ commentator && commentator.nick ? commentator.nick : id }/>
                    <a id="comentarismo-operator" data-id={ commentator && commentator.operator ? commentator.operator : "" }/>
                    <div className="tm-embed-container" id="scriptContainer">
                    </div>

                    {commentContainer}

                    <div style={{height: '50px'}}></div>
                    <div className="row single-post-row">
                        <div className="article-body">
                            <div className="container">
                                <div className="row">
                                    <div className="profile-div">
                                        <div id="report">
                                            <div id="header" className="stroke"
                                                 style={{"backgroundImage": "url('" + "https://unsplash.it/1400/350?random" + "')"}}>
                                                <h1 id="video_title">{commentator.nick}</h1>
                                                <h4>
                                                <span
                                                    id="channel_title">{commentator.operator ? commentator.operator : ""}</span> on <span id="network_title">Comment & Sentiment Analysis Project</span>
                                                </h4>

                                                <hr/>

                                                <div className="row bignums">
                                                    <div className="col-xs-4 col-xs-offset-4">
                                                <span
                                                    id="total_comments">{commentator.totalComments ? commentator.totalComments : ""}</span>
                                                        <span className="desc">Total Comments</span>
                                                    </div>
                                                    <div className="col-xs-4">
                                                <span
                                                    id="comments_per_day">{commentsavgperday && commentsavgperday !== "0" ? commentsavgperday.toFixed(2) : "0" }</span>
                                                        <span className="desc">By Day</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="progress">
                                                    <div className="progress-bar progress-bar-success" role="progressbar"
                                                         aria-valuenow="0"
                                                         aria-valuemin="0"
                                                         aria-valuemax="100" style={{width: "0%"}}>
                                                        Comments Analyzed: 0%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                    <div className="profile-nick">
                                        <div className="profile-nickName">
                                            { commentator.nick }
                                        </div>
                                        <span>@{ commentator.slug }</span>
                                    </div>
                                    <div className="profile-divStats">
                                        <ul className="profile-commentsfollowfollowers">
                                            <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block">First Seen</span>
                                                        <span
                                                            className="profile-StatValue"><Date
                                                            date={commentator.minDate}/></span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="profile-divStats">
                                        <ul className="profile-commentsfollowfollowers">
                                            <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block">Last Seen</span>
                                                        <span
                                                            className="profile-StatValue"><Date
                                                            date={commentator.maxDate}/></span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="profile-divStats">
                                        <ul className="profile-commentsfollowfollowers">
                                            <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block">Countries</span>
                                                        <span
                                                            className="profile-StatValue">{ commentator.countries }</span>
                                            </li>
                                            <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block">Languages</span>
                                                        <span
                                                            className="profile-StatValue">{ commentator.languages }</span>
                                            </li>
                                            <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block">Followers</span>
                                                <span className="profile-StatValue"/>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-xs-12" style={{height: '25px'}}></div>
                                </div>

                                <div id="comentarismo-container" className="comentarismo-comment">
                                    {
                                        commentator.comments.map((q)=> {
                                            var date = q.date && q.date.epoch_time ? <Date date={q.date}/> : q.date;

                                            return (
                                                <div key={q.id + Math.random()}
                                                     className="col-md-12">
                                                    <div className="col-sm-1 hidden-xs">
                                                        <Icon nick={q.nick} size={50}/>
                                                    </div>
                                                    <div className="text-wrapper">
                                                        <b>{ date }</b>
                                                        <div role="meta" className="comentarismo-comment-header">
                                                        <span className="author">
                                                            <b>{ q.title }</b>
                                                        </span>
                                                            <a href="#" className="permalink"> Read more</a>
                                                        </div>
                                                        <div className="text">
                                                            <p>Commentator: { q.nick }</p>
                                                        </div>

                                                        <div className="text">
                                                            <p>{ q.comment }</p>
                                                        </div>
                                                    </div>
                                                    <div className="comentarismo-comment-footer">
                                                        <a className="upvote" id="like" data-id="-like">
                                                            <img src="/static/img/thumbs-up.png"
                                                                 style={{width: '10px',height: '10px'}}/>
                                                        </a>
                                                        <span className="spacer">|</span>
                                                        <a className="downvote" id="dislike" data-id="-dislike">
                                                            <img src="/static/img/thumbs-down.png"
                                                                 style={{width: '10px',height: '10px'}}/>
                                                        </a>
                                                        <a className="button destroy" id="delete" data-id="-delete"/>
                                                        <span className="spacer">|</span>
                                                        <a data-id="-reply" className="reply"> Reply</a>
                                                    </div>
                                                    <div className="comentarismo-follow-up" id="-reply-thread"></div>
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
    return {commentator: state.commentatorDetail}
}

Commentator.propTypes = {
    commentator: PropTypes.object.isRequired
}

export { Commentator }
export default connect(mapStateToProps, {loadCommentatorDetail})(Commentator)
