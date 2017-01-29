import React, { Component,ReactClass,PropTypes } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router';

var MainNavbar = require('components/MainNavbar');
import Helmet from "react-helmet";


import { loadCommentDetail } from 'actions/commentators'


import Like from 'components/Like';
import DisLike from 'components/DisLike';
import {CommentSlide} from 'components/CommentSlide';
var analytics = require('ga-browser')();


var Slide = React.createClass({
    render: function () {
        let { comment } = this.props;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-8">
                        <a href="/" target="_blank">
                            <img src="/static/img/comentarismo-extra-mini-logo.png"/>
                            <span className="btn-default">
                            Comentarismo </span>
                        </a>
                    </div>


                    <div className="col-sm-4 btn-default">
                        <a href="/r/2F"> Skip Ad </a>
                    </div>
                </div>


                <div className="col-xs-12" style={{height: "45px"}}></div>

                <CommentSlide key={comment.id} comment={comment}/>

                <div className="row">

                    <Like id={comment.id}/>
                    <DisLike id={comment.id}/>
                </div>

                <div className="col-xs-12" style={{height: "45px"}}></div>

                <div className="row">
                    <div className="col-md-10 col-md-offset-1">
                        <div className="facts-box testimonial-cta">
                            <div className="row">
                                <div className="col-sm-12">
                                    <img src="/static/img/comentarismo-extra-mini-logo.png" alt="img"
                                         className="img-circle img-thumbnail"/>
                                    <p>"By Reading Comments You Help people to be heard; Sharing ideas we'll make a
                                        better world." <span className="btn-default"> <a
                                            className="text-colored">@Comentarismo</a></span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

var Slideshow = React.createClass({

    getInitialState: function () {
        let { comment } = this.props
        return {
            currentSlide: comment,
            counter: 0,
            playing: false
        }
    },
    render: function () {

        var slide = <Slide key={this.props.comment.id} comment={this.props.comment}/>;

        return (
            <div className="slideshow">
                <div className="slides">
                    {slide}
                </div>
            </div>
        );
    }
});


class Comment extends Component {
    static fetchData({ store, params }) {
        let { id } = params;
        console.log(id);
        return store.dispatch(loadCommentDetail({id}))
    }

    componentDidMount() {
        analytics('create', 'UA-51773618-1', 'auto');
        setInterval(function () {
            ga('send', 'event', 'ping', window.location.href, {}, 0)
        }, 20000);
    }

    render() {
        let { comment } = this.props;

        return (
            <div>
                <Helmet
                    htmlAttributes={{"lang": "en"}} // amp takes no value
                    title="Latest news, world news, sports, business, comment, analysis and reviews from the world's leading liberal comments website."
                    titleTemplate="Comentarismo.com - %s"
                    meta={[
                    {"name": "description", "content": "Welcome to Comentarismo"},
                    {"property": "og:type", "content": "article"}
                ]}
                    onChangeClientState={(newState) => console.log(newState)}
                />

                <Slideshow comment={comment}/>

                <div className="clearfix"></div>
                <footer className="footer bg-dark">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 text-center">
                                <p className="copyright">© 2016 Comentarismo.com</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {comment: state.commentDetail}
}

Comment.propTypes = {
    comment: PropTypes.object.isRequired
}

export { Comment }
export default connect(mapStateToProps, {loadCommentDetail})(Comment)
