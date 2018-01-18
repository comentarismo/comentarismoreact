'use strict';

var React = require('react');
var createReactClass = require('create-react-class');

var jdenticon = require("jdenticon");
var md5 = require('md5');
var $ = require('jquery');
var base64Encode = require("../util/imgresizer").base64Encode;

module.exports = createReactClass({
    displayName: 'Image',

    onError: function () {
        console.log('image error - removing');
        this.getDOMNode().src = this.props.srcfallback;
        this.forceUpdate();
    },

    componentDidMount: function () {
        if (this.props.forceUpdate) {
            // reload src to force onerror to be called if image link was not valid
            this.getDOMNode().src = this.props.src;
            this.forceUpdate();
        }
    },

    render: function () {
        return (
            // <img onError={this.onError} className={this.props.classes} src={this.props.src}/>
            <div>
                <div id={"fb-" + this.props.id} style={{"display": "none"}}>
                    <img onError={this.onError} id={"fb-img-" + this.props.id}/>
                </div>
                <div id={"img-" + this.props.id}>
                    <img onError={this.onError} id={this.props.id}/>
                    {this.getImageElementResize()}
                </div>
            </div>
        );
    },

    getImageElementResize: function () {
        let {src, srcfallback, id, width, height, quality} = this.props;

        if (typeof window !== 'undefined') {

            var host = "https://img.comentarismo.com/r";
            console.log("IMGRESIZER ", src)
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
                    console.log("imgresizer DONE OK");
                    var base64Data = base64Encode(binaryData);
                    src = "data:image/jpeg;base64," + base64Data;
                    $("#" + id).attr("src", "data:image/jpeg;base64," + base64Data);
                } else {
                    console.log("Could not load IMGRESIZER :(")
                    $("#fb-img-" + id).attr("src", srcfallback);
                    $("#fb-" + id).show();
                    $("#img-" + id).hide();
                }
            });

            request.fail(function (e) {
                console.log("Error: Could not load IMGRESIZER -> ", e)
                $("#fb-img-" + id).attr("src", srcfallback);
                $("#fb-" + id).show();
                $("#img-" + id).hide();
            });
        }

    }
});
