import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class App extends Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(App);
