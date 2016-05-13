import React, { Component,ReactClass,PropTypes } from 'react';
import Like from 'components/Like';
import DisLike from 'components/DisLike';


var Slide = React.createClass({
    render: function () {
        let { comment } = this.props;

        return (
            <div>
                <div className="row">
                    <div className="col-md-10 col-md-offset-1">
                        <div className="facts-box testimonial-cta">
                            <div className="row">
                                <div className="col-sm-12">
                                    <img src="/static/img/comentarismo-extra-mini-logo.png" alt="img"
                                         className="img-circle img-thumbnail"/>
                                    <div className="text-blue">
                                        <Comment comment={comment.title}/>
                                    </div>
                                    <Comment comment={"<b>"+comment.comment+"</b>"}/>
                                    <span className="btn-default">
                                        <a className="text-colored"><h1><Comment comment={"@"+comment.nick}/></h1></a>
                                    </span>
                                    <ShareNetworks comment={comment}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

var ShareNetworks = React.createClass({
    onclickTweet: function (event, url) {
        // Make a good use of short URL
        var shortUrl = window.location.href;
        var width = 575,
            height = 420,
            left = ($(window).width() - width) / 2,
            top = ($(window).height() - height) / 2,
            opts = 'status=1' +
                ',width=' + width +
                ',height=' + height +
                ',top=' + top +
                ',left=' + left,
            queryString = 'text=' + encodeURIComponent('Checkout this new game: ') +
                '&via=comentarismo' +
                '&via=comentarismo' +
                '&url=' + encodeURIComponent(shortUrl);

        window.open('https://twitter.com/share?' + queryString, 'twitter', opts);
        return false;

    },

    onclickFacebook: function (ev, url) {
        //http://jsfiddle.net/stichoza/EYxTJ/', 'Fb Share', 'Facebook share popup', 'http://goo.gl/dS52U', 520, 350
        var title = "test";
        var descr = "test";
        var image = "http://localhost:3002/static/img/comentarismo-extra-mini-logo.png";

        var width = 575,
            height = 420,
            left = ($(window).width() - width) / 2,
            top = ($(window).height() - height) / 2;

        window.open('http://www.facebook.com/sharer.php?s=100&p[title]=' + title + '&p[summary]=' + descr + '&p[url]=' + url + '&p[images][0]=' + image, 'sharer', 'top=' + top + ',left=' + left + ',toolbar=0,status=0,width=' + width + ',height=' + height);
        return false;
    },
    render: function () {
        var target = "";
        if (typeof window !== 'undefined') {
            target = window.location.href;
        }
        return (<div className="row">
            <div className="col-xs-2">

                <a href={target} target="_blank"><span className="fa fa-link"></span></a>
            </div>
            <div className="col-xs-10">
                <div className="social_area">
                    <ul className="social_nav">
                        <li className="twitter" onClick={() => this.onclickTweet(this,'test.com')}><a target="#"></a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>);
        //<li className="facebook" onClick={() => this.onclickFacebook(this,'test.com')}><a href="#"></a></li>
        //<li className="flickr"><a href="#"></a></li>
        //<li className="pinterest"><a href="#"></a></li>
        //<li className="googleplus"><a href="#"></a></li>
        //<li className="vimeo"><a href="#"></a></li>
        //<li className="youtube"><a href="#"></a></li>
        //<li className="mail"><a href="#"></a></li>
    }
});

var Comment = React.createClass({
    render: function () {
        return (
            <div ref="it" dangerouslySetInnerHTML={{__html:this.props.comment}}></div>
        )
    }
});

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
        this.interval = setInterval(this.rotate, 5000);
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

            var url = `/gapi/commentaries/${index}/${value}/${skip}/${limit}/`;
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
                $("a#inifiniteLoaderPlay").hide("slow");
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

        var slide = <Slide key={this.state.currentSlide.id} comment={this.state.currentSlide}/>;

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
