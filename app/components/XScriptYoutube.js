import React from 'react'
import ReactDOM from 'react-dom';
import { IFrame } from 'components/IFrame';
import $ from 'jquery';

class XScript extends React.Component {
    static initScripts(el, url) {
        var script = document.createElement('script')
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', url);
        el.appendChild(script);
    }
    
    componentDidMount () {
        const intervalId = window.setInterval(() => {
            if (ReactDOM.findDOMNode(this.refs['it']) &&
                typeof ReactDOM.findDOMNode(this.refs['it']).appendChild ===
                "function") {
                try {
                    // Trigger script
                    XScript.initScripts(ReactDOM.findDOMNode(this.refs['it']),
                        "/static/comentarismo-client-min.js");
                    // Clear the intervalId
                    window.clearInterval(intervalId);
                } catch (e) {
                    console.log(e);
                    console.log("XScript.initScripts failed, will retry");
                } finally {
                    // Clear the intervalId
                    window.clearInterval(intervalId);
                }
            }
        }, 100);
    }

    render() {
    
        let operator = this.props.operator;
        let page = this.props.page;
        let key = this.props.key;
        let image = this.props.image;
        let title = this.props.title;
    
        function replaceAllShittyChars(unsafe) {
            return unsafe
                .replace(/'/g, "")
                .replace(/"/g, "")
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, " ")
                .replace(/&gt;/g, " ")
                .replace(/&quot;/g, " ")
                .replace(/&#x00A9;/g, " ")
                .replace(/&#x00EB;/g, " ")
                .replace(/&#x00E8;/g, " ")
                .replace(/&#x00E9;/g, " ")
                .replace(/&#x201C;/g, " ")
                .replace(/&#x2019;/g, " ")
                .replace(/&#x2015;/g, " ")
                .replace(/&#x201D;/g, " ")
                .replace(/&#8220;/g, " ")
                .replace(/&#8230;/g, " ")
                .replace(/&#8220;/g, " ")
                .replace(/&#8221;/g, " ")
                .replace(/&#8217;/g, " ")
                .replace(/&#8216;/g, " ")
                .replace(/&lsquo;/g, ' ')
                .replace(/&rsquo;/g, ' ')
                .replace(/&ndash;/g, ' ')
                .replace(/&egrave;/g, ' ')
                .replace(/&Atilde;/g, '')
                .replace(/&cent;/g, '')
                .replace(/&euro;/g, '')
                .replace(/&Acirc;/g, '')
                .replace(/&oelig;/g, '')
                .replace(/&trade;/g, '')
                .replace(/&[^;]+?;/g, ' ')
                .replace(/(<([^>]+)>)/ig, " ")
        };
    
        let replybtn = "<img src='/static/img/comentarismo_reply.jpg' style='width:10px; height:10px;'/>";
    
        if (typeof window !== 'undefined') {
            operator = this.props.operator || $("#comentarismo-operator").attr("data-id");
            page = this.props.page || $("#comentarismo-page").attr("data-id");
            key = this.props.key || $("#comentarismo-key").attr("data-id") || "HL3Q87OdXRXiun8LSyAy5vmCDJJCfyVrX97aIk_Ll2JcC0IG2yUpRoBOB7O6qRkDUAd6yQbD4gY=";
            image = this.props.image || ($('meta[property="og:image"]') ? $('meta[property="og:image"]').attr('content') : "");
            title =  this.props.title || ($('meta[property="og:title"]') ? $('meta[property="og:title"]').attr('content') : "");
            if(title){
                title = replaceAllShittyChars(title);
            }
        }
        
        
    
        var head = '<script type="text/javascript" src="/static/comentarismo-client-min.js"></script>' +
            '<script>$(function () {' +
            'var comentarismo = new Comentarismo({' +
            ' icons: {'+
            'commenticon: "<i class=\'material-icons dp48\'>comment</\i>",'+
            'thumbsup: "/static/img/thumbs-up.jpg",'+
            'thumbsdown: "/static/img/thumbs-down.jpg",'+
            'replybtn: "'+ replybtn +'"'+
            ' },'+
            'image: \''+image+'\',' +
            'title: \''+title+'\',' +
            'host: "api.comentarismo.com",' +
            'wshost: "wss://api.comentarismo.com",' +
            'cached: "api.comentarismo.com/elk",'+
            'table:"commentaries_sentiment_report",' +
            'forum: "test",' +
            'reco: "myid",' +
            'css: "//api.comentarismo.com/static/css/custom.css",'+
            'key: \''+key+'\',' +
            'page: \''+encodeURIComponent(page)+'\',' +
            'operator: \''+operator+'\',' +
            "index:'"+this.props.index+"',"+
            '}); comentarismo.connect();' +
            '});' +
            '</script>';
    
        var body = `<html><head>${head}</head><body><div class="container comentarismo-container" id="comentarismo-container"></div></body></html>`;
    
        return <IFrame initialContent={body} style={{border:0,position:'inherit', width:'100%', height:'100vh', left:'0px;'}}>
        </IFrame>
        
    }
}

export { XScript }
