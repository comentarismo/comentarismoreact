var React = require('react');
var moment = require("moment");

module.exports = React.createClass({
    render: function () {
        var date = moment.utc(this.props.date).format("MMMM DD, YYYY");
        return <b>{date}</b>
    }
});