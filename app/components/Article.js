'use strict';

var React = require('react');

var base64Encode = require("../util/imgresizer").base64Encode;
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

var width = "240";
var height = "245";
var quality = "50";

var $ = require('jquery');
import Date from "components/Date"
import Icon from "components/Icon"

var jdenticon = require("jdenticon");
var md5 = require('md5');


module.exports = React.createClass({
    displayName: 'Article',

    getImageElement: function () {
        var src;

        // use meta:og image if available
        if (this.props.article.content && this.props.article.content.image) {
            src = this.props.article.content.image;
        }

        // use default image if meta:og is missing
        if (!src && this.props.article.image) {
            src = this.props.article.image;
        }

        var id = this.props.article.id;

        var host = "http://img.comentarismo.com/r";
        console.log("IMGRESIZER ",src)
        //do img resize
        var request = $.ajax({
            url: host + '/img/',
            type: 'post',
            data: {
                url: src,
                width: width,
                height: height,
                quality: quality
            },
            mimeType: "text/plain; charset=x-user-defined"
        });
        request.done(function (binaryData) {
            if (binaryData && binaryData !== "") {
                //console.log("imgresizer DONE OK");
                var base64Data = base64Encode(binaryData);
                src = "data:image/jpeg;base64," + base64Data;
                $("#"+id).attr("src", "data:image/jpeg;base64," + base64Data);
            } else {
                $("#fb-"+id).show();
                $("#img-"+id).hide();

            //
            }
        });

        request.fail(function (e) {
            //    console.log(e);
            $("#fb-"+id).show();
            $("#img-"+id).hide();
        });

    },

    getTitle: function () {
        return (
            <h3 className='article-header'>{this.props.article.title && this.props.article.title.length > 45 ? this.props.article.title.substring(0,45)+"..."  :  this.props.article.title }</h3>
        );
    },

    getDescription: function () {
        var description = this.props.article.description;
        return description ? <p className='article-description'>{description}</p> : null;
    },

    getSource: function () {
        var source = this.props.article.operator;
        return source ? <p className='source'><b><Date date={this.props.article.date}/> </b> {source} </p> : null;
    },

    getTotalComments: function () {
        var totalComments = this.props.article.totalComments;
        return totalComments ? <p className='source'>Comments {totalComments} </p> :  <p className='source'>Comments 0 </p> ;
    },

    getArticleLink: function () {
        return '/news/' + this.props.article.titleurlize;
    },

    render: function () {
        const style = {
            height: 250,
            width: 250,
            margin: 20,
            textAlign: 'center',
            display: 'inline-block',
        };
        return (
            <Card style={style}>
                <a href={this.getArticleLink()} className='thumbnail article'>
                    <div id={"fb-"+this.props.article.id} style={{"display": "none"}}>
                        <Icon nick={this.props.article.titleurlize} size={125}/>
                    </div>
                    <div id={"img-"+this.props.article.id} className="">
                        <img id={this.props.article.id} />
                        {this.getImageElement()}
                    </div>

                    <div className='caption'>
                        {this.getTitle()}
                        {this.getSource()}
                        {this.getDescription()}
                        {this.getTotalComments()}
                    </div>
                </a>
            </Card>
        );
    }
});
