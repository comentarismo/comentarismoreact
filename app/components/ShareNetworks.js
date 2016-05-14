import React from 'react';
import config from 'config'
var host = config.API_URL;
var BASE_URL = config.BASE_URL;

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
        var image = `${BASE_URL}/static/img/comentarismo-extra-mini-logo.png`;

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
        let { comment } = this.props;
        return (<div className="row">
            <div className="col-xs-2">

                <a href={`${host}/c/${comment.id}`} target="_blank"><span className="fa fa-link"></span></a>
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

export {ShareNetworks}