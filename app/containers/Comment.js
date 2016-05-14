import React, { Component,ReactClass,PropTypes } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router';

var MainNavbar = require('components/MainNavbar');
import Helmet from "react-helmet";


import { loadCommentDetail } from 'actions/commentators'


import Like from 'components/Like';
import DisLike from 'components/DisLike';
import {CommentSlide} from 'components/CommentSlide';


var Slide = React.createClass({
    render: function() {
        let { comment } = this.props;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-8">
                        <img src="/static/img/comentarismo-extra-mini-logo.png"/>
                        Comentarismo
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
                                    <p>"By Reading Comments You Help people to be heard; Sharing ideas we'll make a better world." <span className="btn-default"> <a
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

var Empty = React.createClass({
    render: function() {
        return (
            <div>There are no comments yet.</div>
        )
    }
})

var PageItem = React.createClass({
    render: function() {
        var status = this.props.index == this.props.counter ? 'active' : 'inactive'

        return (
            <li className={status + " pagination-item"} onClick={this.props.onClick}>{this.props.index}</li>
        )
    }
});

var PlayButton = React.createClass({
    render: function() {
        return (
            <span className="entypo-play" data-text="play" onClick={this.props.onClick}/>
        )
    }
});

var PauseButton = React.createClass({
    render: function() {
        return (
            <span className="entypo-pause" data-text="play" onClick={this.props.onClick}/>
        )
    }
});

var PreviousButton = React.createClass({
    render: function() {
        return (
            <span className="entypo-left-open-mini" data-text="left-open-mini" onClick={this.props.onClick}/>
        )
    }
});

var NextButton = React.createClass({
    render: function() {
        return (
            <span className="entypo-right-open-mini" data-text="right-open-mini" onClick={this.props.onClick}/>
        )
    }
});

var Slideshow = React.createClass({

    getInitialState: function() {
        return {
            data: this.props.comment,
            currentSlide: null,
            counter: 0,
            playing: false
        }
    },
    goToPage: function(index) {
        var data = this.state.data;
        this.setState({counter: index, currentSlide: data[index]});
        this.pauseRotation();
    },
    getData: function() {
        let { comment } = this.props
        console.log(comment)
        this.setState({
            data: comment,
            currentSlide: comment,
            counter: 0,
            playing: false
        })
        //var request = $.getJSON('./data.json');
        //request.then(function(data) {


        //that.setState({data: data, currentSlide: data[0]});
        //});
    },
    componentDidMount: function() {
        this.getData();
        this.startRotation();

    },
    componentWillUnmount: function() {
        clearInterval(this.interval);
    },
    startRotation: function() {
        this.interval = setInterval(this.rotate, 3000);
        this.setState({ playing: true });
    },
    pauseRotation: function() {
        clearInterval(this.interval)
        this.setState({ playing: false });
    },
    rotate: function() {
        var data = this.state.data;
        var counter = this.state.counter;
        var slidesCount = this.state.data.length;

        if (counter < slidesCount - 1) {
            ++counter;
        } else {
            counter = 0;
        }

        this.setState({counter: counter, currentSlide: data[counter]});
    },
    goToPrevious: function() {
        var data = this.state.data;
        var slidesCount = this.state.data.length;
        var counter = this.state.counter;

        if (counter > 0) {
            --counter;
        } else {
            counter = slidesCount - 1;
        }
        this.setState({counter: counter, currentSlide: data[counter]});
        this.pauseRotation();
    },
    goToNext: function() {
        this.rotate();
        this.pauseRotation();
    },

    render: function() {
        var that = this;
        var pageItems = this.state.data.map(function (slide, i) {
            var boundClick = that.goToPage.bind(that, i)
            return (<PageItem key={slide.id} index={i} counter={that.state.counter} onClick={boundClick}/>)
        });

        var playButton = <PlayButton onClick={this.startRotation}/>
        var pauseButton = <PauseButton onClick={this.pauseRotation}/>
        var previousButton = <PreviousButton onClick={this.goToPrevious}/>
        var nextButton = <NextButton onClick={this.goToNext}/>

        if(!this.state.currentSlide){
            this.state.currentSlide = this.props.comment
        }

        var slide = <Slide key={this.state.currentSlide.id} comment={this.state.currentSlide}/>

        return (
            <div className="slideshow">
                <div className="slides">
                    {slide}
                </div>
                <ol className="pagination">
                    {pageItems}
                </ol>
                <div className="button">
                    {this.state.playing ? pauseButton : playButton}
                </div>
                <div className="previous">
                    {previousButton}
                </div>

                <div className="next">
                    {nextButton}
                </div>
            </div>
        );
    }

})



class Comment extends Component {
    static fetchData({ store, params }) {
        let { id } = params;
        console.log(id);
        return store.dispatch(loadCommentDetail({id}))
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

                <Slideshow comment={[comment]}/>

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
