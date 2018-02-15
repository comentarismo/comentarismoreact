import React, { Component } from 'util/safe-react';

var createReactClass = require('create-react-class')
import { ButtonGroup,ButtonToolbar, Button, Alert, Panel, Label } from 'react-bootstrap'


import { CommentSlide } from 'components/CommentSlide'
import $ from 'jquery'

var Empty = createReactClass({
    render: function () {
        return (
            <div>
                <Alert bsStyle="warning">
                    Bad Server, no donuts for you.
                </Alert>
            </div>
        
        )
    },
})

var PlayButton = createReactClass({
    render: function () {
        return (
            <Button onClick={this.props.onClick}><span className="fa fa-play"
                                                       data-text="play"/></Button>
        )
    },
})

var PauseButton = createReactClass({
    render: function () {
        return (
            <Button onClick={this.props.onClick}><span className="fa fa-pause"
                                                       data-text="play"/></Button>
        )
    },
})

var PreviousButton = createReactClass({
    render: function () {
        return (
            <Button onClick={this.props.onClick}><span
                className="fa fa-step-backward"
                data-text="left-open-mini"/></Button>
        )
    },
})

var NextButton = createReactClass({
    render: function () {
        return (
            <Button onClick={this.props.onClick}><span
                className="fa fa-step-forward"
                data-text="right-open-mini"/></Button>
        )
    },
})

var PlayComment = createReactClass({
    
    getInitialState: function () {
        let {comment, skip} = this.props
        if (!comment) {
            return {
                comment: {},
                currentSlide: {},
                counter: 0,
                playing: this.props.playing || false,
                loading: false,
                skip: skip,
                currentSlideId: '',
                currentSlideLike: false,
                currentSlideDisLike: false,
            }
        }
        return {
            comment: comment,
            currentSlide: comment[0],
            counter: 0,
            playing: this.props.playing || false,
            loading: false,
            skip: skip,
            currentSlideId: comment[0] ? comment[0].id : '',
            currentSlideLike: false,
            currentSlideDisLike: false,
        }
    }
    ,
    
    goToPage: function (index) {
        this.setState({counter: index, currentSlide: data[index]})
        this.pauseRotation()
    }
    ,
    componentWillUnmount: function () {
        clearInterval(this.interval)
    }
    ,
    componentDidMount: function () {
        $('a#inifiniteLoaderPlay').hide()
    }
    ,
    startRotation: function () {
        console.log('play')
        this.interval = setInterval(this.rotate,
            (this.props.playingtimeout || 10000))
        this.setState({playing: true})
    }
    ,
    pauseRotation: function () {
        console.log('pause')
        clearInterval(this.interval)
        this.setState({playing: false})
    }
    ,
    rotate: function () {
        var data = this.state.comment
        var slidesCount = this.state.comment.length
        var counter = this.state.counter
        var loading = this.state.loading
        
        if (counter < slidesCount - 1) {
            ++counter
        } else if (!loading) {
            this.setState({loading: true})
            console.log(counter)
            var index = this.props.index
            var value = this.props.value
            var skip = parseInt(this.state.skip) + counter + 1
            var limit = parseInt(this.props.limit)
            
            var url = `/commentsapi/commentaries/${index}/${value}/${skip}/${limit}/`
            console.log(url)
            
            $('.slideshow').hide()
            $('a#inifiniteLoaderPlay').show('fast')
            
            var that = this
            var request = $.getJSON(url)
            request.then(function (data) {
                if (!data) {
                    //redirect user
                    url = `/play/${index}/${value}/${skip}/${limit}/`
                    window.location.href = url
                    return
                }
                counter = 0
                that.setState({
                    loading: false,
                    counter: counter,
                    skip: skip,
                    comment: data,
                    currentSlide: data[0],
                    currentSlideId: data[0].id,
                    currentSlideLike: false,
                    currentSlideDisLike: false,
                })
                $('a#inifiniteLoaderPlay').hide()
                $('.slideshow').show()
                return
            })
        } else {
            console.log('skip already loading event')
            return
        }
        
        this.setState({
            counter: counter,
            currentSlide: data[counter],
            currentSlideId: data[counter].id,
        })
    }
    ,
    goToPrevious: function () {
        console.log('previous')
        var data = this.state.comment
        var slidesCount = this.state.comment.length
        var counter = this.state.counter
        
        if (counter > 0) {
            --counter
        } else {
            counter = slidesCount - 1
        }
        this.setState({counter: counter, currentSlide: data[counter]})
        this.pauseRotation()
    }
    ,
    goToNext: function () {
        console.log('next')
        this.rotate()
        this.pauseRotation()
    }
    ,
    changeFlag (props) {
        this.setState({
            selectedFlag: props.flag,
        }, () => {
            //if(props.locale === 'ar')
            //    $('html').addClass('arabic');
            //else
            //    $('html').removeClass('arabic');
        })
    }
    ,
    
    render: function () {
        
        var playButton = <PlayButton onClick={this.startRotation}/>
        var pauseButton = <PauseButton onClick={this.pauseRotation}/>
        var previousButton = <PreviousButton onClick={this.goToPrevious}/>
        var nextButton = <NextButton onClick={this.goToNext}/>
        
        if (!this.state.currentSlide) {
            this.state.currentSlide = this.state.comment['0']
        }
        
        var slide = <CommentSlide
            key={this.state.currentSlide ? this.state.currentSlide.id : 0}
            comment={this.state.currentSlide}/>
        
        return (
            <div className="container">
                
                <a id="inifiniteLoaderPlay"><img
                    src="/static/img/ajax-loader.gif"/></a>
                
                <Panel bsStyle="primary">
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">
                            {previousButton} {this.state.playing
                            ? pauseButton
                            : playButton} {nextButton} -
                            Press a button to read the next comment                        
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        {slide}
                    </Panel.Body>
                </Panel>
                
             
            </div>
        )
    },
    
})

export { PlayComment }
