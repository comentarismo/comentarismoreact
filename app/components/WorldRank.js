'use strict';

import React from 'util/safe-react';
var createReactClass = require('create-react-class');

module.exports = createReactClass({
    displayName: 'AlexaRank',

    render: function () {
        let { alexarank } = this.props;

        return (
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 col-md-offset-2">
                            <div className="facts-box text-center">
                                <div className="row">
                                    <div className="col-sm-3 col-xs-6">
                                        <h2>+10 Million</h2>
                                        <p className="text-muted">Indexed Comments</p>
                                    </div>
                                    <div className="col-sm-3 col-xs-6">
                                        <h2>{!alexarank ? "" : alexarank.reach.RANK}</h2>
                                        <p className="text-muted">World Rank</p>
                                    </div>
                                    <div className="col-sm-3 col-xs-6">
                                        <h2>{!alexarank ? "" : alexarank.country.RANK}</h2>
                                        <p className="text-muted">{!alexarank ? "" : alexarank.country.CODE} Rank</p>
                                    </div>
                                    <div className="col-sm-3 col-xs-6">
                                        <h2>+7.000</h2>
                                        <p className="text-muted">Daily Visitors</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
});
