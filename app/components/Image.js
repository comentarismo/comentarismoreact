'use strict';

import React from 'util/safe-react';
var createReactClass = require('create-react-class');

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
            <img  onError={this.onError} className={this.props.classes} src={this.props.src} />
        );
    }
});
