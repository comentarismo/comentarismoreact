import React, {ReactClass} from 'react';

import {State, Navigation} from 'react-router';

import {FormControl} from 'react-bootstrap';

var emojione = require("emojione");
var MainNavbar = require('components/MainNavbar');

import {GoogleSearchScript} from 'components/GoogleSearchScript';

var YoutubeReportRun = React.createClass({
    displayName: 'Sentiment',

    getInitialState: function () {
        let {url, comment, lang, refresh} = this.props;

        return {
            vid: url,
            comment: comment,
            numBubbles: 70,
            lang: lang,
            refresh: refresh,
        }
    },

    runReport: function () {
        if (typeof window !== 'undefined') {
            window.location.href = '/sentiment/' + encodeURIComponent(this.state.vid) + "?" + (this.state.lang ? "lang=" + this.state.lang : "");
        }
    },


    updateReport: function () {
        if (typeof window !== 'undefined') {
            window.location.href = '/sentiment/' + encodeURIComponent(this.state.vid) + "?" + (this.state.lang ? "lang=" + this.state.lang : "") + "&refresh=true";
        }
    },

    handleChange: function (event) {
        var change = event.target.value;
        this.setState({vid: change});
    },

    handleChangeLang: function (event) {
        var change = event.target.value;
        this.setState({lang: change});
    },

    render: function () {

        return (
            <div className="container">
                <div className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header navbar-brand">
                            <b>** HOT FREE DEAL ** Paste a Youtube URL below And Get a Free Sentiment Analysis Right Now!</b>
                        </div>
                    </div>
                </div>


                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                    data-target="#navbar"
                                    aria-expanded="false" aria-controls="navbar">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <span
                                className="navbar-brand">Insert a Youtube URL, Select the language and press Run.</span>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse col-xs-12 col-md-12 col-lg-12">
                            <div className="navbar-form navbar-left form-horizontal">
                                <div>
                                    <input type="text" className="form-control" placeholder="Post URL" name="vid"
                                           value={this.state.vid} onChange={this.handleChange}
                                           style={{width: "350px"}}/>
                                    <FormControl componentClass="select" placeholder="select" value={this.state.lang}
                                                 onChange={this.handleChangeLang}>
                                        <option value="en">English</option>
                                        <option value="es">Spanish</option>
                                        <option value="pt">Portuguese</option>
                                        <option value="fr">French</option>
                                        <option value="it">Italian</option>
                                        <option value="ru">Russian</option>
                                        <option value="hr">Croatian</option>
                                    </FormControl>

                                    <a className="btn btn-primary" onClick={this.runReport}>Run
                                    </a>
                                </div>
                            </div>
                            <ul className="nav navbar-nav">
                            </ul>
                        </div>
                    </div>
                </nav>

            </div>
        );
    },
});


export {YoutubeReportRun}