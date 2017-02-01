import React, {ReactClass} from 'react';

import {State, Navigation} from 'react-router';

import {FormControl} from 'react-bootstrap';

var emojione = require("emojione");

import {GoogleSearchScript} from 'components/GoogleSearchScript';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';


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
        const style = {
            width: '85%',
            margin: 20,
            textAlign: 'center',
            display: 'inline-block',
        };
        return (
            <div>
                <Card style={style}>
                    <CardHeader
                        title="** HOT FREE DEAL ** "
                        subtitle="Paste a Youtube URL below And Get a Free Sentiment Analysis Right Now!"
                        avatar="/static/img/sources/avatar_offer.png"
                    />

                    <CardText>
                        <div id="navbar" className="navbar-collapse collapse">
                            <div className="navbar-form navbar-left form-horizontal">
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
                    </CardText>
                    <CardActions>
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                data-target="#navbar"
                                aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"/>
                            <span className="icon-bar"/>
                            <span className="icon-bar"/>
                        </button>
                    </CardActions>



                </Card>

            </div>
        );
    },
});


export {YoutubeReportRun}