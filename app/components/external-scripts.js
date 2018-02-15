'use strict';

import React from 'util/safe-react';
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