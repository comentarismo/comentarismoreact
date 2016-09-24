import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';

class XScript extends React.Component {
    static initScripts(el, url) {
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', url);
        el.appendChild(script);
    }

    componentDidMount() {
        XScript.initScripts(ReactDOM.findDOMNode(this.refs['it']), "/static/comentarismo-client-min.js");
    }

    render() {
        var replybtn = "<img src='/static/img/comentarismo_reply.jpg' style='width:10px; height:10px;'/>";

        return <div ref="it"
                    dangerouslySetInnerHTML={{__html:
                    '<script type="text/javascript" src="/static/comentarismo-client-min.js"></script>' +
                    '<script>$(function () {' +
                      'var operator = $("#comentarismo-operator").attr("data-id"); ' +
                      'var page = $("#comentarismo-page").attr("data-id"); '+
                        'var comentarismo = new Comentarismo({' +
                            ' icons: {'+
                                'commenticon: "/static/img/comentarismo_add_comment.jpg",'+
                                'thumbsup: "/static/img/thumbs-up.jpg",'+
                                'thumbsdown: "/static/img/thumbs-down.jpg",'+
                                'replybtn: "'+ replybtn +'"'+
                            ' },'+
                            'host: "api.comentarismo.com",' +
                            'cached: "api.comentarismo.com/elk",'+
                            'forum: "comentarismo",' +
                            'key: "HL3Q87OdXRXiun8LSyAy5vmCDJJCfyVrX97aIk_Ll2JcC0IG2yUpRoBOB7O6qRkDUAd6yQbD4gY=",' +
                            'page: encodeURIComponent(page),' +
                            'operator: operator,' +
                            "index:'"+this.props.index+"',"+
                        '});' +
                      '});' +
                    '</script>'}}
        ></div>
    }
}

export { XScript }
