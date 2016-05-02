'use strict';

var React = require('react');

var ImageComponent = require('./Image');

var base64Encode = require("../util/imgresizer").base64Encode;

var width = "388";
var height = "395";
var quality = "50";
var $ = require('jquery');


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
                $("#"+id).attr("src","/static/img/comentarismo-extra-mini-logo.png");
            }
        });

        request.fail(function (e) {
            //console.log(e);
            $("#"+id).attr("src","/static/img/comentarismo-extra-mini-logo.png");
        });

    },

    getTitle: function () {
        return (
            <h3 className='article-header'>{this.props.article.title}</h3>
        );
    },

    getDescription: function () {
        var description = this.props.article.description;
        return description ? <p className='article-description'>{description}</p> : null;
    },

    getSource: function () {
        var source = this.props.article.operator;
        return source ? <p className='source'>{source}</p> : null;
    },

    getArticleLink: function () {
        return '/news/' + this.props.article.titleurlize;
    },

    render: function () {
        return (
            <div className="col-lg-4 col-md-3 col-sm-5 col-xs-10">
                <a href={this.getArticleLink()} className='thumbnail article'>
                    <div className="image">
                        <img id={this.props.article.id} />
                        {this.getImageElement()}
                    </div>
                    <div className='caption'>
                        {this.getTitle()}
                        {this.getDescription()}
                        {this.getSource()}
                    </div>

                </a>
            </div>
        );
    }
});
