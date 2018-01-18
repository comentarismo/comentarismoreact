'use strict';

var React = require('react');
var createReactClass = require('create-react-class');

module.exports = createReactClass({
    displayName: 'ExternalScripts',
    shouldComponentUpdate: function() {
        return false;
    },
    render: function() {
        return (
            <div>
            </div>
        );
    }
});