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
        return <div ref="it"
                    dangerouslySetInnerHTML={{__html:
                    '<script type="text/javascript" src="/static/comentarismo-client-min.js"></script>' +
                    '<script>$(function () {' +
                      'var operator = $("#comentarismo-operator").attr("data-id"); ' +
                      'var page = $("#comentarismo-page").attr("data-id"); '+
                        'var comentarismo = new Comentarismo({' +
                            'host: "api.comentarismo.com",' +
                            'cached: "elk.comentarismo.com",'+
                            'forum: "comentarismo",' +
                            'key: "GtD6uKQYLccK59umRSrwque0JH6s6l5xi3epPy-SGhJ0P6PC55jZg7-vI41tPfRx6wdko8t1",' +
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
