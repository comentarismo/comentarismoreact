import React from 'react';
var createReactClass = require('create-react-class');

var XDiv = createReactClass({
    render: function () {
        return (
            <div ref="it" dangerouslySetInnerHTML={{__html:this.props.text}}></div>
        )
    }
});

export { XDiv }
