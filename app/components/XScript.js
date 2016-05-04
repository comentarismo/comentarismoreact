import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';

export class XScript extends React.Component {
    static initScripts(el, url) {
        var script = document.createElement('script')
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', url);
        el.appendChild(script);
    }

    componentDidMount() {
        XScript.initScripts(ReactDOM.findDOMNode(this.refs['it']), "/static/comentarismo-client-min.js");
    }

    render() {
        return <div ref="it"
                    dangerouslySetInnerHTML={{__html:
                    '<script type="text/javascript" src="/static/comentarismo-client-min.js"></script>' +
                    '<script>$(function () {' +
                      'var operator = $("#comentarismo-operator").attr("data-id"); ' +
                      'var page = $("#comentarismo-page").attr("data-id"); '+
                        'var comentarismo = new Comentarismo({' +
                            'host: "api.comentarismo.com",' +
                            'cached: "elk.comentarismo.com",'+
                            'forum: "comentarismo-social",' +
                            'key: "-U7sw_7qY7vw-qCXi3M8KJPYSzMEOxEbZCnLUDBO7EGum8uKg2f5rreFIv8aSWS16jmNngoIRZHs",' +
                            'page: encodeURIComponent(page),' +
                            'operator: operator' +
                        '});' +
                      '});' +
                    '</script>'}}
        ></div>
    }
}