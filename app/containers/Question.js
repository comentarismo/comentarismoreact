import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadQuestionDetail } from 'actions/questions'

class Question extends Component {
    static fetchData({ store, params }) {
        let { id } = params
        return store.dispatch(loadQuestionDetail({id}))
    }

    componentDidMount() {
        let { id } = this.props.params
        this.props.loadQuestionDetail({id})
    }

    render() {
        let { question } = this.props
        return (
            <div className="container-fluid single-post-wrapper">
                <div className="col-xs-12" style={{height: '50px;'}}></div>
                <div className="row single-post-row">
                    <div className="col-sm-10 col-sm-offset-1 col-xs-12 article-body ">
                        <div className="col-sm-3 hidden-xs">
                        </div>
                        <div className="col-md-10">
                            <div className="container">
                                <div className="row" className="col-md-12">
                                    <div className="profile-div">
                                        <a className='profile-bg profile-block'/>
                                        <div>
                                            <div className="profile-button">
                                                <button className="btn btn-primary"><i
                                                    className="glyphicon glyphicon-pencil"/>
                                                </button>
                                            </div>
                                            <a title="" id="profile-avatar" href="#" className="profile-goup">
                                                <img src="/static/images/comentarismo-extra-mini-logo.png"/>
                                            </a>
                                            <div className="profile-nick">
                                                <div className="profile-nickName">
                                                    { question.nick }
                                                </div>
                                                <span>@{ question.slug }</span>
                                            </div>
                                            <div className="profile-divStats">
                                                <ul className="profile-commentsfollowfollowers">
                                                    <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block">First Seen</span>
                                                        <span className="profile-StatValue">{ question.minDate }</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="profile-divStats">
                                                <ul className="profile-commentsfollowfollowers">
                                                    <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block">Last Seen</span>
                                                        <span className="profile-StatValue">{ question.maxDate }</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="profile-divStats">
                                                <ul className="profile-commentsfollowfollowers">
                                                    <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block">Countries</span>
                                                        <span
                                                            className="profile-StatValue">{ question.countries }</span>
                                                    </li>
                                                    <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block">Languages</span>
                                                        <span
                                                            className="profile-StatValue">{ question.languages }</span>
                                                    </li>
                                                    <li className="profile-commentsfollowfollowersLi">
                                                        <span
                                                            className="profile-StatLabel profile-block">Followers</span>
                                                        <span className="profile-StatValue"/>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-xs-12" style={{height: '25px;'}}></div>


                                    </div>

                                </div>
                                <div id="comentarismo-container" className="col-md-12">
                                    <div className="profile-divStats">
                                        <ul className="profile-commentsfollowfollowers">
                                            <li className="profile-commentsfollowfollowersLi">

                                                <span className="profile-StatLabel profile-block">Comments</span>
                                                <span className="profile-StatValue">{ question.totalComments }</span>

                                            </li>
                                            <li className="profile-commentsfollowfollowersLi">
                                                <span className="profile-StatLabel profile-block">Following</span>
                                                <span className="profile-StatValue"/>
                                            </li>
                                            <li className="profile-commentsfollowfollowersLi">
                                                <span className="profile-StatLabel profile-block">Followers</span>
                                                <span className="profile-StatValue"/>
                                            </li>
                                        </ul>
                                    </div>
                                </div>


                                {
                                    question.comments.map((q)=> {
                                        return (
                                            <div className="comentarismo-comment" key={q.id} className="col-md-12">
                                                <div className="col-sm-1 hidden-xs">
                                                    <a className="avatar-{{.nick}} img-responsive user-photo"/>
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
                                                        <img src="/static/images/thumbs-up.png" style={{width: '10px',height: '10px'}}/>
                                                    </a>
                                                    <span className="spacer">|</span>
                                                    <a class="downvote" id="dislike" data-id="-dislike">
                                                        <img src="/static/images/thumbs-down.png" style={{width: '10px',height: '10px'}}/>
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
        )
    }
}

function mapStateToProps(state) {
    return {question: state.questionDetail}
}

Question.propTypes = {
    question: PropTypes.object.isRequired
}

export { Question }
export default connect(mapStateToProps, {loadQuestionDetail})(Question)
