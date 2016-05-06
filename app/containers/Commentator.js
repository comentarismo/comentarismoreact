import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'
import { loadCommentatorDetail } from 'actions/commentators'
import {XScript} from 'components/XScript'
var MainNavbar = require('components/MainNavbar');

import Date from "components/Date"
import Helmet from "react-helmet";

class Commentator extends Component {
    static fetchData({ store, params }) {
        let { id } = params
        return store.dispatch(loadCommentatorDetail({id}))
    }

    getInitialState() {
        return {
            data: {
                comments: []
            }
        };
    }

    componentDidMount() {
        let { id } = this.props.params
        this.props.loadCommentatorDetail({id})
    }

    render() {
        let { commentator } = this.props;

        if (!commentator.comments){
            commentator.comments = [];
        }
        return (
            <div>
                <Helmet
                    htmlAttributes={{"lang": "en"}} // amp takes no value
                    title={`Latest Comments - Commentator Profile -> @${commentator.slug ? commentator.slug.toUpperCase() : commentator.nick} `}
                    titleTemplate="Comentarismo.com - %s"
                    meta={[
                    {"name": "description", "content": `Find all comments for @${commentator.slug ? commentator.slug.toUpperCase() : commentator.nick} - the world's leading liberal comments website.`},
                    {"property": "og:type", "content": "comments"},
                    {"property": "og:image", "content": '/static/img/comentarismo-extra-mini-logo.png'}
                ]}
                    onChangeClientState={(newState) => console.log(newState)}
                />
                <MainNavbar/>
                <div className="container-fluid single-post-wrapper">
                    <a id="comentarismo-page" data-id={ commentator.nick }/>
                    <a id="comentarismo-operator" data-id={ commentator.operator }/>
                    <div className="tm-embed-container" id="scriptContainer">
                    </div>
                    <XScript/>
                    <div style={{height: '50px'}}></div>
                    <div className="row single-post-row">
                        <div className="col-sm-10 col-sm-offset-1 col-xs-12 article-body ">
                            <div className="container">
                                <div className="row">
                                    <div className="profile-div">
                                        <a className='profile-bg profile-block'/>
                                        <div>
                                            <div className="profile-button">
                                                <button className="btn btn-primary"><i
                                                    className="glyphicon glyphicon-pencil"/>
                                                </button>
                                            </div>
                                            <a title="" id="profile-avatar" href="#" className="profile-goup">
                                                <img src="/static/img/comentarismo-extra-mini-logo.png"/>
                                            </a>
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
                                            return (
                                                <div key={q.id}
                                                     className="col-md-12">
                                                    <div className="col-sm-1 hidden-xs">
                                                        <a className="avatar-{q.nick} img-responsive user-photo"/>
                                                    </div>
                                                    <div className="text-wrapper">
                                                        <b>{q.date }</b>
                                                        <div role="meta" className="comentarismo-comment-header">
                                                        <span className="author">
                                                            <b>{ q.title }</b>
                                                        </span>
                                                            <a href="#" className="permalink"> Read more</a>
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
                                                        <a className="button destroy" id="delete" data-id="-delete"
                                                           className="button destroy"/>
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
