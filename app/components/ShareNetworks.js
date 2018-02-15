import React from 'util/safe-react';

var createReactClass = require('create-react-class')

import config from 'config'

var BASE_URL = config.BASE_URL
var analytics = require('ga-browser')()
import {
    ButtonGroup,
    ButtonToolbar,
    Button,
} from 'react-bootstrap'

var ShareNetworks = createReactClass({
    
    componentDidMount: function () {
        analytics('create', 'UA-51773618-1', 'auto')
        setInterval(function () {
            ga('send', 'event', 'ping', window.location.href, {}, 0)
        }, 20000)
    },
    
    onclickTweet: function (event, url) {
        ga('send', 'event', 'share-twitter', window.location.href, {}, 0)
        // Make a good use of short URL
        var shortUrl = window.location.href
        var width = 575,
            height = 420,
            left = ($(window).width() - width) / 2,
            top = ($(window).height() - height) / 2,
            opts = 'status=1' +
                ',width=' + width +
                ',height=' + height +
                ',top=' + top +
                ',left=' + left,
            queryString = 'text=' +
                encodeURIComponent('Checkout this comment: ') +
                '&via=comentarismo' +
                '&via=comentarismo' +
                '&url=' + encodeURIComponent(shortUrl)
        
        window.open('https://twitter.com/share?' + queryString, 'twitter',
            opts)
        return false
        
    },
    
    onclickFacebook: function (ev, url) {
        ga('send', 'event', 'share-fb', url, {}, 0)
        //http://jsfiddle.net/stichoza/EYxTJ/', 'Fb Share', 'Facebook share popup', 'http://goo.gl/dS52U', 520, 350
        var title = 'test'
        var descr = 'test'
        var image = `${BASE_URL}/static/img/comentarismo-extra-mini-logo.png`
        
        var width = 575,
            height = 420,
            left = ($(window).width() - width) / 2,
            top = ($(window).height() - height) / 2
        
        window.open('//www.facebook.com/sharer.php?s=100&p[title]=' + title +
            '&p[summary]=' + descr + '&p[url]=' + url + '&p[images][0]=' +
            image, 'sharer', 'top=' + top + ',left=' + left +
            ',toolbar=0,status=0,width=' + width + ',height=' + height)
        return false
    },
    render: function () {
        let {comment} = this.props
        return (<ButtonToolbar>
                <ButtonGroup>
                    <Button>
                        <a href={`/c/${comment.id}`} target="_blank"><span
                            className="fa fa-link"/></a>
                    </Button>
                    <Button>
                        <a target="#" className="fa fa-twitter-square"
                           onClick={() => this.onclickTweet(this,
                               window.location.href)}/>
                    </Button>
                    <Button>
                        <a target="#" className="fa fa-facebook-square"
                           onClick={() => this.onclickFacebook(this,
                               'test.com')}/>
                    </Button>
                </ButtonGroup>
            </ButtonToolbar>)
        
        //<li className="flickr"><a href="#"></a></li>
        //<li className="pinterest"><a href="#"></a></li>
        //<li className="googleplus"><a href="#"></a></li>
        //<li className="vimeo"><a href="#"></a></li>
        //<li className="youtube"><a href="#"></a></li>
        //<li className="mail"><a href="#"></a></li>
    },
})

export { ShareNetworks }