'use strict';

var React = require('react');

var base64Encode = require("../util/imgresizer").base64Encode;

var width = "388";
var height = "395";
var quality = "50";

var $ = require('jquery');
import Date from "components/Date"
import Icon from "components/Icon"

var jdenticon = require("jdenticon");
var md5 = require('md5');


module.exports = React.createClass({
    displayName: 'Video',

    getTitle: function () {
        return (
            <h3 className='video-header'>{this.props.video.title}</h3>
        );
    },

    getDescription: function () {
        //var description = this.props.video.description;
        //return description ? <p className='video-description'>{description}</p> : null;
        return (<div>
            <span id="comments_per_day">By Day {this.props.video.commentavgperday ? this.props.video.commentavgperday.toFixed(2) : "0" }</span>
        </div>)

    },

    getSource: function () {
        return (<h4>
            <span id="channel_title">{this.props.video.metadata ? this.props.video.metadata.channeltitle : ""} </span>
             on <span
            id="network_title">{this.props.video.type}</span>
        </h4>)
    },

    getTotalComments: function () {
        var totalComments = this.props.video.totalcomments;
        return totalComments ? <p className='source'>Total Comments: {totalComments} </p> : null;
    },

    getVideoLink: function () {
        return '/sentiment/' + encodeURIComponent(this.props.video.url);
    },

    render: function () {
        return (
            <div className="col-lg-6 col-md-6 col-sm-10 col-xs-12">
                <a href={this.getVideoLink()} className='thumbnail video'>
                    <div id={"fb-"+this.props.video.id} style={{"display": "none"}}>
                        <Icon nick={this.props.video.id} size={125}/>
                    </div>
                    <div id={"img-"+this.props.video.id} className="image-video">
                        <img src={this.props.video.metadata.thumbnail}/>
                    </div>

                    <div className='caption'>
                        {this.getTitle()}
                        {this.getSource()}
                        {this.getDescription()}
                        {this.getTotalComments()}
                    </div>
                </a>
            </div>
        );
    }
});
