'use strict';

var React = require('react');

var ImageComponent = require('./Image');

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

        return src ? <ImageComponent src={src} classes={'img img-responsive full-width'} /> : null;
    },

    getTitle: function ()  {
        return (
            <h3 className='article-header'>{this.props.article.title}</h3>
        );
    },

    getDescription: function () {
        var description = this.props.article.description;
        return description ? <p className='article-description'>{description}</p> : null;
    },

    getSource: function () {
        var source =  this.props.article.operator;
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
