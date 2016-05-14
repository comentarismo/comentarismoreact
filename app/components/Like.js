'use strict';

import config from 'config'
var host = config.API_URL;


var React = require('react');

module.exports = React.createClass({
    displayName: 'Like',

    getInitialState: function () {
        return {liked: false};
    },

    onError: function () {
        console.log('Like error - removing');
    },

    componentDidMount: function () {
        if (this.props.forceUpdate) {
            // reload src to force onerror to be called if image link was not valid
            //this.getDOMNode().src = this.props.src;
            this.forceUpdate();
        }
    },

    handleClick: function (event) {
        this.setState({liked: !this.state.liked});

        //http on comentarismo api and properly like this comment :D
        var request = $.ajax({
            url: host + '/auth/like/' + this.props.id,
            type: 'post',
            xhrFields: {
                withCredentials: true
            }
        });

        request.done(function (data, textStatus, jqXHR) {
            console.log("success");
            $(".error").hide();
            $(".success").html(jqXHR.statusText);
            //redirect to next comment
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
            $(".error").html(jqXHR.status + " " + jqXHR.statusText +  ` ... Something bad happened, are you logged in ?? <a href='${host}/login'>Login</a> `);
            $(".error").show();
            $(".error").focus();

        });

    },

    componentWillReceiveProps: function(){
      //console.log("componentWillReceiveProps")
        $(".error").hide();
        $(".success").hide();
        this.setState({liked: false});
    },

    render: function () {
        //console.log("like render")
        var text = this.state.liked ? 'Liked' : '';

        return (
            <div>
                <div id={this.props.id + '-success'} className='success' style={{display: "none"}}></div>
                <div id={this.props.id + '-error'} className='error' style={{display: "none"}}></div>
                <div className="col-xs-6 btn btn-custom" onClick={this.handleClick}>
                    <p><img src="/static/img/thumbs-up.png" style={{width: '50px',height: "50px"}}/>{text}</p>
                </div>
            </div>
        );
    }
});
