import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import configureStore from 'store/configureStore';

import App from 'containers/App';
import Intro from 'containers/Intro';

import Commentators from 'containers/Commentators';
import Commentator from 'containers/Commentator';

import Articles from 'containers/Articles';
import Article from 'containers/Article';

import ArticleLegacy from 'containers/ArticleLegacy';

import Comment from 'containers/Comment';

import SuggestComment from 'containers/SuggestComment'

import Notfound from 'containers/Notfound';

export default function (history) {
    return (
        <Router history={history}>
            <Route path="/" component={App}>
                <Route path="commentators/:id" component={Commentator}/>
                <Route path="commentators/:index/:value" component={Commentators}/>
                <Route path="news/:id" component={Article}/>
                <Route path="news/:index/:value" component={Articles}/>
                <Route path="news/:continent/:country/:index/:genre/:year/:month/:day/:value/" component={ArticleLegacy}/>
                <Route path="news/:continent/:country/:index/:year/:month/:day/:value/" component={ArticleLegacy}/>
                <Route path="c/:id" component={Comment}/>
                <Route path="play/:index/:value/:skip/:limit" component={SuggestComment}/>
                <Route path="*" component={Notfound}/>
                <IndexRoute component={Intro}/>
            </Route>
        </Router>
    );
};
