var React = require('react');
var createReactClass = require('create-react-class');

var moment = require("moment");

module.exports = createReactClass({
    render: function () {
        var date = moment.utc(this.props.date).format("MMMM DD, YYYY");
        return <b>{date}</b>
    }
});