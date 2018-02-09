import React, {Component} from 'react';
var createReactClass = require('create-react-class');

import {ImageSlide} from 'components/ImageSlide';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import $ from 'jquery'

var Empty = createReactClass({
    render: function () {
        return (
            <div>Bad Server, no donuts for you.</div>
        )
    }
});

var PlayButton = createReactClass({
    render: function () {
        return (
            <FlatButton  onClick={this.props.onClick}>
                <span className="fa fa-play" data-text="play"/>
            </FlatButton>
        )
    }
});

var PauseButton = createReactClass({
    render: function () {
        return (
            <FlatButton onClick={this.props.onClick}>
                <span className="fa fa-pause" data-text="play"/>
            </FlatButton>
        )
    }
});

var PreviousButton = createReactClass({
    render: function () {
        return (
            <FlatButton onClick={this.props.onClick}>
                <span className="fa fa-step-backward" data-text="left-open-mini"/>
            </FlatButton>
        )
    }
});

var NextButton = createReactClass({
    render: function () {
        return (
            <FlatButton onClick={this.props.onClick}>
                <span className="fa fa-step-forward" data-text="right-open-mini"/>
            </FlatButton>
        )
    }
});


var PlayImages = createReactClass({

    getInitialState: function () {
        let {images} = this.props;
        if (!images) {
            return {
                images: {},
                currentSlide: {},
                counter: 0,
                playing: this.props.playing || false,
                loading: false,
                currentSlideId: "",
                currentSlideLike: false,
                currentSlideDisLike: false
            }
        }
        return {
            images: images,
            currentSlide: images[0],
            counter: 0,
            playing: this.props.playing || false,
            loading: false,
            currentSlideId: images[0] ? images[0].title : "",
            currentSlideLike: false,
            currentSlideDisLike: false
        }
    },
    componentDidMount: function () {
        $('a#inifiniteLoaderPlay').hide()
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
        var data = this.state.images;
        var slidesCount = this.state.images.length;
        var counter = this.state.counter;
        var loading = this.state.loading;

        if (counter < slidesCount - 1) {
            ++counter;
        } else if (!loading) {
            this.setState({loading: true});
            console.log(counter);

            $(".slideshow").hide();
            $('a#inifiniteLoaderPlay').show('fast');

            counter = 0;
            this.setState({
                loading: false,
                counter: counter,
                images: data,
                currentSlide: data[0],
                currentSlideId: data[0].id,
                currentSlideLike: false,
                currentSlideDisLike: false
            });
            $("a#inifiniteLoaderPlay").hide();
            $(".slideshow").show();

        } else {
            console.log("skip already loading event");
            return;
        }

        this.setState({counter: counter, currentSlide: data[counter], currentSlideId: data[counter].id});
    },

    goToPrevious: function () {
        console.log("previous");
        var data = this.state.images;
        var slidesCount = this.state.images.length;
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

    render: function () {

        var playButton = <PlayButton onClick={this.startRotation}/>;
        var pauseButton = <PauseButton onClick={this.pauseRotation}/>;
        var previousButton = <PreviousButton onClick={this.goToPrevious}/>;
        var nextButton = <NextButton onClick={this.goToNext}/>;

        if (!this.state.currentSlide) {
            this.state.currentSlide = this.state.comment["0"];
        }

        var slide = <ImageSlide key={this.state.currentSlide ? this.state.currentSlide.id : 0}
                                image={this.state.currentSlide}/>;

        return (

            <Card>
                <CardActions>
                    {previousButton} {this.state.playing ? pauseButton : playButton} {nextButton}
                </CardActions>


                <a id="inifiniteLoaderPlay"><img src="/static/img/ajax-loader.gif"/></a>
                <div className="row">
                    <div className="">
                        <div className="">

                            {slide}
                        </div>
                    </div>
                </div>
            </Card>

        );
    }

});

export {PlayImages}
