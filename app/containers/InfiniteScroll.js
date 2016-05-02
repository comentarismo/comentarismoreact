var $ = require('jquery');

module.exports = function (React) {
    if (React.addons && React.addons.InfiniteScroll) {
        return React.addons.InfiniteScroll;
    }
    React.addons = React.addons || {};
    var InfiniteScroll = React.addons.InfiniteScroll = React.createClass({
        getDefaultProps: function () {
            return {
                skip: 0,
                limit: 5,
                hasMore: false,
                loadMore: function () {}
            };
        },
        componentDidMount: function () {
            this.skip = this.props.skip;
            this.limit = this.props.limit;
            this.attachScrollListener();
        },
        componentDidUpdate: function () {
            this.attachScrollListener();
        },
        render: function () {
            var props = this.props;
            return React.DOM.div(null, props.children, props.hasMore && (props.loader || InfiniteScroll._defaultLoader));
        },
        scrollListener: function () {
            var willScroll = $(window).scrollTop() == $(document).height() - $(window).height();
            if (willScroll) {
                this.detachScrollListener();
                // call loadMore after detachScrollListener to allow
                // for non-async loadMore functions
                this.skip = this.skip + this.limit;
                this.props.loadMore(this.skip,this.limit);
            }
        },
        attachScrollListener: function () {
            if (!this.props.hasMore) {
                return;
            }
            window.addEventListener('scroll', this.scrollListener);
            window.addEventListener('resize', this.scrollListener);
            this.scrollListener();
        },
        detachScrollListener: function () {
            window.removeEventListener('scroll', this.scrollListener);
            window.removeEventListener('resize', this.scrollListener);
        },
        componentWillUnmount: function () {
            this.detachScrollListener();
        }
    });
    InfiniteScroll.setDefaultLoader = function (loader) {
        InfiniteScroll._defaultLoader = loader;
    };
    return InfiniteScroll;
};