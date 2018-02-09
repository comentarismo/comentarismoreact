import React from 'react';
var createReactClass = require('create-react-class');

var XDiv = createReactClass({
    render: function () {
        return (
            <div dangerouslySetInnerHTML={{__html:this.props.text}}/>
        )
    }
});

export { XDiv }
