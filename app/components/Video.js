'use strict';

var React = require('react');

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Icon from "components/Icon"

var jdenticon = require("jdenticon");

module.exports = React.createClass({
    displayName: 'Video',

    getTitle: function () {
        return (
            <h3 className='video-header'>{this.props.video.title}</h3>
        );
    },

    getDescription: function () {
        return (<div>
            <span
                id="comments_per_day">By Day {this.props.video.commentavgperday ? this.props.video.commentavgperday.toFixed(2) : "0" }</span>
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
        const style = {
            height: 400,
            width: 400,
            margin: 20,
            textAlign: 'center',
            display: 'inline-block',
        };
        return (
            <Card style={style}>
                <div>
                    <a href={this.getVideoLink()} className='thumbnail video'>
                        <div id={"fb-" + this.props.video.id} style={{"display": "none"}}>
                            <Icon nick={this.props.video.id} size={125}/>
                        </div>
                        <div id={"img-" + this.props.video.id} className="image-video">
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
            </Card>
        );
    }
});
