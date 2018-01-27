import React from 'react'

var createReactClass = require('create-react-class')

import { State, Navigation } from 'react-router'



import { GoogleSearchScript } from 'components/GoogleSearchScript'
import {
    CardActions,
    CardHeader,
    CardText
} from 'material-ui/Card'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

var YoutubeReportRun = createReactClass({
    displayName: 'Sentiment',
    
    getInitialState: function () {
        let {url, comment, lang, refresh} = this.props
        
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
            window.location.href = '/sentiment/' +
                encodeURIComponent(this.state.vid) + '?' +
                (this.state.lang ? 'lang=' + this.state.lang : '')
        }
    },
    
    updateReport: function () {
        if (typeof window !== 'undefined') {
            window.location.href = '/sentiment/' +
                encodeURIComponent(this.state.vid) + '?' +
                (this.state.lang ? 'lang=' + this.state.lang : '') +
                '&refresh=true'
        }
    },
    
    handleChange: function (event) {
        var change = event.target.value
        this.setState({vid: change})
    },
    
    handleChangeLang: function (event) {
        var change = event.target.value
        this.setState({lang: change})
    },
    
    render: function () {
        
        return (
            <div>
                <CardHeader
                    title="** HOT FREE DEAL ** "
                    subtitle="Paste a Youtube URL below And Get a Free Sentiment Analysis Right Now!"
                    avatar="/static/img/sources/avatar_offer.png"
                />
                
                <CardText>
                    
                    <TextField
                        name="vid"
                        errorText={'Please add a valid source URL for the report'}
                        value={this.state.vid}
                        onChange={this.handleChange}
                        hintText="Post URL"
                        fullWidth={true}
                    />
                    <SelectField
                        floatingLabelText={'Select Language'}
                        errorText={'Please select the language'}
                        onChange={this.handleChangeLang}
                        value={this.state.lang}
                    >
                        <MenuItem value="en" primaryText="English"/>
                        <MenuItem value="es" primaryText="Spanish"/>
                        <MenuItem value="pt"
                                  primaryText="Portuguese"/>
                        <MenuItem value="fr" primaryText="French"/>
                        <MenuItem value="it" primaryText="Italian"/>
                        <MenuItem value="ru" primaryText="Russian"/>
                        <MenuItem value="hr"
                                  primaryText="Croatian"/>
                    
                    </SelectField>
                
                
                </CardText>
                <CardActions>
                    <RaisedButton label="Create new Report"
                                  primary={true}
                                  onClick={this.runReport}/>
                </CardActions>
            </div>
        )
    },
})

export { YoutubeReportRun }