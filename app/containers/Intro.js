import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class Intro extends Component {
    render() {
        return (
            <div className="intro">
                <h1>Intro Page</h1>
                <Link to="/news/operator/bbcuk">NEWS BBCUK</Link>
                <Link to="/commentators/operator/bbcuk">Commentators BBCUK</Link>
            </div>
        );
    }
}

function mapStateToProps() {
    return {};
}

export default connect(mapStateToProps)(Intro);
