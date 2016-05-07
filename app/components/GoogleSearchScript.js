import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';

var $ = require("jquery");
var pos = require('pos');

export class GoogleSearchScript extends React.Component {
    static initScripts(el, url) {
        var script = document.createElement('script')
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', url);
        el.appendChild(script);
    }


    componentDidMount() {
        var search = this.props.search;
        var id = null;
        if(search && search.id){
            id = search.id
        } if(search && search.value){
            id = search.value;
        } else {
            id = search.splat;
        }

        $(function () {

            setTimeout(function () {
                //console.log("Will load Google auto search");

                try {
                    //split on dashes
                    var searchTerm = id.split("-").join(" ");
                    searchTerm = searchTerm.split("/").join(" ");

                    var list = ["NNP", "NNPS", "NNS", "VB", "VBD", "VBG", "VBN", "VBP", "VBZ", "NN"];

                    var words = new pos.Lexer().lex(searchTerm);
                    var taggedWords = new pos.Tagger().tag(words);
                    console.log(taggedWords)
                    var ls = [];
                    for (var i in taggedWords) {
                        var taggedWord = taggedWords[i];
                        var word = taggedWord[0];
                        var tag = taggedWord[1];
                        var doit = _.contains(list, tag);
                        if (doit && word.length >= 2) {
                            //console.log(word + " /" + tag);
                            var found = false;
                            for (var j in ls) {
                                var z = ls[j];
                                if (z && z.toLowerCase().indexOf(word.toLowerCase()) !== -1) {
                                    found = true;
                                    break;
                                }
                            }
                            if (!found && ls.length < 10) {
                                ls.push(word);
                            }
                        }
                    }
                    var tags = ls.join(" ");
                    console.log('TAGS FOUND ' + tags);

                    $('input[class$="gsc-input"]').val(tags);
                    $(".gsc-search-button").click();
                }catch(e){
                    console.log(e);
                    console.log(e.stack);
                }
            }, 2000);

        });
    }

    render() {
        return <div ref="it"
                    dangerouslySetInnerHTML={{__html:
                    "<script>" +
                        "(function () {" +
                            "var cx = 'partner-pub-9263571964737365:9584159532'; " +
                            "var gcse = document.createElement('script'); " +
                            "gcse.type = 'text/javascript'; " +
                            "gcse.async = true; " +
                            "gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:')+'//www.google.com/cse/cse.js?cx='+cx; " +
                            "var s = document.getElementsByTagName('script')[0]; " +
                            "s.parentNode.insertBefore(gcse, s); " +
                        "})();" +
                        "</script>" +
                        "<div class='row button-section' style='padding-top: 50px;'>" +
                            "<gcse:search></gcse:search>" +
                        "</div>"}}></div>
    }
}