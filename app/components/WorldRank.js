'use strict';

import React from 'react';

module.exports = React.createClass({
    displayName: 'AlexaRank',

    render: function () {
        let { alexarank } = this.props;
        //console.log(alexarank);

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
                                        <h2>{alexarank.reach.RANK}</h2>
                                        <p className="text-muted">World Rank</p>
                                    </div>
                                    <div className="col-sm-3 col-xs-6">
                                        <h2>{alexarank.country.RANK}</h2>
                                        <p className="text-muted">{alexarank.country.CODE} Rank</p>
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
