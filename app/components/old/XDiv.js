import React from 'react';

var XDiv = React.createClass({
    render: function () {
        return (
            <div ref="it" dangerouslySetInnerHTML={{__html:this.props.text}}></div>
        )
    }
});

export { XDiv }
