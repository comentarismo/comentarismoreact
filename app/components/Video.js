'use strict';

var React = require('react');
var createReactClass = require('create-react-class');

import {Card, CardHeader, CardMedia, CardTitle} from 'material-ui/Card';
import {Row} from 'react-styled-flexboxgrid';

import Icon from "components/Icon"

var jdenticon = require("jdenticon");

const style = {
    height: '600px',
    textAlign: 'left',
    boxShadow: 'rgba(0, 0, 0, 0.0980392) 0px 1px 4px',
    borderRadius: '2px',
    margin: '20px 20px 20px 0'
};

module.exports = createReactClass({
    displayName: 'Video',

    getTitle: function () {
        return (
            <span className='video-header'>{this.props.video.title}</span>
        );
    },

    getDescription: function () {
        return (<span style={{fontSize: '12px !important'}}
                id="comments_per_day">Comments per day {this.props.video.commentavgperday ? this.props.video.commentavgperday.toFixed(2) : "0" }</span>
        )

    },

    getSource: function () {
        return (
            <span id="channel_title">{ this.props.video.metadata ? this.props.video.metadata.channeltitle + " ": " "} </span>
        )
    },

    getTotalComments: function () {
        var totalComments = this.props.video.totalcomments;
        return totalComments ? <span>Total Comments: {totalComments} </span> : null;
    },

    getVideoLink: function () {
        return '/report/' + encodeURIComponent(this.props.video.url)+'?refresh=true';
    },



    render: function () {
        
        return (
            <Row style={{ marginLeft: '5rem'}}>
            <a href={this.getVideoLink()} >
                <Card style={style}>
                    <CardHeader title={this.getSource()}
                        />
                    <CardMedia
                        overlay={<CardTitle
                            style={{height: '45px', padding: '0 10px'}} title={<span
                            style={{
                                fontSize: '14px !important',
                                lineHeight: '1.5'
                            }}>{this.getTitle()}</span>}/>}>
                         
                        <div id={"img-" + this.props.video.id} >
                            <img src={this.props.video.metadata.thumbnail}/>
                        </div>
                        <div id={"fb-" + this.props.video.metadata.id} style={{"display": "none"}}>
                            <Icon nick={this.props.video.metadata.id} size={125}/>
                        </div>
                    </CardMedia>
                    
                     <CardTitle
                         title={<span
                            style={{padding: '3px', background: '#656972', color: '#fff', fontSize: '12px !important', textTransform: 'uppercase'}}>{this.getTotalComments()}</span>}
                         subtitle={this.getDescription()}
                     />
                     
                </Card>
            </a>
            </Row>
        );
    }
});
