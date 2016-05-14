import React, { Component,ReactClass,PropTypes } from 'react';
import Like from 'components/Like';
import DisLike from 'components/DisLike';
import {CommentSlide} from 'components/CommentSlide';

var Empty = React.createClass({
    render: function () {
        return (
            <div>Bad Server, no donuts for you.</div>
        )
    }
});

var PlayButton = React.createClass({
    render: function () {
        return (
            <div className="col-xs-1 btn btn-custom" onClick={this.props.onClick}>
                <span className="fa fa-play" data-text="play"/>
            </div>
        )
    }
});

var PauseButton = React.createClass({
    render: function () {
        return (
            <div className="col-xs-1 btn btn-custom" onClick={this.props.onClick}>
                <span className="fa fa-pause" data-text="play"/>
            </div>
        )
    }
});

var PreviousButton = React.createClass({
    render: function () {
        return (
            <div className="col-xs-1 btn btn-custom" onClick={this.props.onClick}>
                <span className="fa fa-step-backward" data-text="left-open-mini"/>
            </div>
        )
    }
});

var NextButton = React.createClass({
    render: function () {
        return (
            <div className="col-xs-1 next btn btn-custom" onClick={this.props.onClick}>
                <span className="fa fa-step-forward" data-text="right-open-mini"/>
            </div>
        )
    }
});


var PlayComment = React.createClass({

    getInitialState: function () {
        let { comment,skip } = this.props;
        return {
            comment: comment,
            currentSlide: comment[0],
            counter: 0,
            playing: this.props.playing || false,
            loading: false,
            skip: skip,
            currentSlideId: comment[0].id,
            currentSlideLike: false,
            currentSlideDisLike: false
        }
    },

    goToPage: function (index) {
        this.setState({counter: index, currentSlide: data[index]});
        this.pauseRotation();
    },
    componentWillUnmount: function () {
        clearInterval(this.interval);
    },
    startRotation: function () {
        console.log("play");
        this.interval = setInterval(this.rotate, (this.props.playingtimeout || 10000));
        this.setState({playing: true});
    },
    pauseRotation: function () {
        console.log("pause");
        clearInterval(this.interval);
        this.setState({playing: false});
    },
    rotate: function () {
        var data = this.state.comment;
        var slidesCount = this.state.comment.length;
        var counter = this.state.counter;
        var loading = this.state.loading;

        if (counter < slidesCount - 1) {
            ++counter;
        } else if (!loading) {
            this.setState({loading: true});
            console.log(counter);
            var index = this.props.index;
            var value = this.props.value;
            var skip = parseInt(this.state.skip) + counter + 1;
            var limit = parseInt(this.props.limit);

            var url = `/commentsapi/commentaries/${index}/${value}/${skip}/${limit}/`;
            console.log(url);

            $(".slideshow").hide();
            $('a#inifiniteLoaderPlay').show('fast');

            var that = this;
            var request = $.getJSON(url);
            request.then(function (data) {
                if (!data) {
                    //redirect user
                    url = `/play/${index}/${value}/${skip}/${limit}/`;
                    window.location.href = url;
                    return;
                }
                counter = 0;
                that.setState({
                    loading: false,
                    counter: counter,
                    skip: skip,
                    comment: data,
                    currentSlide: data[0],
                    currentSlideId: data[0].id,
                    currentSlideLike: false,
                    currentSlideDisLike: false
                });
                $("a#inifiniteLoaderPlay").hide();
                $(".slideshow").show();
                return;
            });
        } else {
            console.log("skip already loading event");
            return;
        }

        this.setState({counter: counter, currentSlide: data[counter], currentSlideId: data[counter].id});
    },
    goToPrevious: function () {
        console.log("previous");
        var data = this.state.comment;
        var slidesCount = this.state.comment.length;
        var counter = this.state.counter;

        if (counter > 0) {
            --counter;
        } else {
            counter = slidesCount - 1;
        }
        this.setState({counter: counter, currentSlide: data[counter]});
        this.pauseRotation();
    },
    goToNext: function () {
        console.log("next");
        this.rotate();
        this.pauseRotation();
    },
    changeFlag(props) {
        this.setState({
            selectedFlag: props.flag
        }, () => {
            //if(props.locale === 'ar')
            //    $('html').addClass('arabic');
            //else
            //    $('html').removeClass('arabic');
        });
    },


    render: function () {

        var playButton = <PlayButton onClick={this.startRotation}/>;
        var pauseButton = <PauseButton onClick={this.pauseRotation}/>;
        var previousButton = <PreviousButton onClick={this.goToPrevious}/>;
        var nextButton = <NextButton onClick={this.goToNext}/>;

        if (!this.state.currentSlide) {
            this.state.currentSlide = this.state.comment["0"];
        }

        var slide = <CommentSlide key={this.state.currentSlide.id} comment={this.state.currentSlide}/>;

        return (
            <div className="container">



                <div className="row">

                    <div className="col-sm-4 btn-default">
                    </div>
                    {previousButton} {this.state.playing ? pauseButton : playButton} {nextButton}
                </div>


                <div className="col-xs-12" style={{height: "45px"}}></div>


                <a id="inifiniteLoaderPlay"><img src="/static/img/ajax-loader.gif"/></a>
                <div className="slideshow">

                    <div className="slides">
                        {slide}
                    </div>
                    <div className="row">

                        <Like id={this.state.currentSlideId} liked={this.state.currentSlideLike}/>
                        <DisLike id={this.state.currentSlideId} liked={this.state.currentSlideDisLike}/>
                    </div>
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
        );
    }

});

export { PlayComment }
