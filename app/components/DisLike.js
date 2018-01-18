'use strict';

var React = require('react');
var createReactClass = require('create-react-class');

import config from 'config'
var host = config.API_URL;
var analytics = require('ga-browser')();

module.exports = createReactClass({
    displayName: 'DisLike',

    getInitialState: function () {
        return {disliked: false};
    },

    onError: function () {
        console.log('Like error - removing');
    },

    componentDidMount: function () {
        analytics('create', 'UA-51773618-1', 'auto');
        if (this.props.forceUpdate) {
            // reload src to force onerror to be called if image link was not valid
            //this.getDOMNode().src = this.props.src;
            this.forceUpdate();
        }
    },

    handleClick: function (event) {
        this.setState({disliked: !this.state.disliked});
        ga('send', 'event', 'dislike', window.location.href, {}, 0);
        //http on comentarismo api and properly like this comment :D
        var request = $.ajax({
            url: host + '/auth/dislike/' + this.props.id,
            type: 'post',
            xhrFields: {
                withCredentials: true
            }
        });

        request.done(function (data, textStatus, jqXHR) {
            console.log("success");
        });

        request.fail(function (jqXHR) {

            if (jqXHR.status == "200") {
                $(".error").hide();
                $(".success").html(jqXHR.statusText);
                console.log("success");
                return;
            } else if (jqXHR.status == "406") {
                $(".success").hide();
                $(".error").html(jqXHR.status + " " + jqXHR.statusText + " You can only vote 1 time per comment ");
                $(".error").show();
                //only one voting
                console.log("only one voting");
                //redirect to next comment

                return;
            } else if (jqXHR.status == "404") {

            }

            $(".success").hide();
            $(".error").html(jqXHR.status + " " + jqXHR.statusText +  `... Something bad happened, are you logged in ?? <a href='${host}/login'>Login</a>`);
            $(".error").show();
            $(".error").focus();

        });

    },

    componentWillReceiveProps: function(){
        //console.log("componentWillReceiveProps")
        $(".error").hide();
        $(".success").hide();
        this.setState({disliked: false});
    },

    render: function () {
        var text = this.state.disliked ? 'DisLiked' : '';

        return (
            <div className="col-xs-6 btn btn-yellow" onClick={this.handleClick}>
                <p><img src="/static/img/thumbs-down.png" style={{width: '50px',height: "50px"}}/>{text}</p>
            </div>
        );
    }
});
