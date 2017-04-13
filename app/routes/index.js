import React from 'react';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute} from 'react-router';

// import App from 'containers/App';

// import Layout from 'containers/layout/Layout';
import Layout from 'containers/layout/Master';

import Intro from 'containers/Intro';
import IntroProduct from 'containers/IntroProduct';
import IntroYoutube from 'containers/IntroYoutube';

import Commentators from 'containers/Commentators';
import Commentator from 'containers/Commentator';
import CommentatorProduct from 'containers/CommentatorProduct';

import Articles from 'containers/Articles';
import Article from 'containers/Article';

import Product from 'containers/Product';
import ProductList from 'containers/ProductList';

import ArticleLegacy from 'containers/ArticleLegacy';

import Comment from 'containers/Comment';

import SuggestComment from 'containers/SuggestComment'

import Notfound from 'containers/Notfound';

import SentimentComment from 'containers/SentimentComment';

import TopVideos from 'containers/TopVideos';

import Search from 'containers/SearchComponent';
import SearchComponentJCP from 'containers/SearchComponentJCP';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

export default function (history) {
    return (
        <Router history={history}>


            <Route path="/" component={Layout}>
                <Route path="search" component={Search}/>

                <Route path="sentiment/:url" component={SentimentComment}/>
                <Route path="topvideos/:index/:value" component={TopVideos}/>
                <Route path="commentators/:id" component={Commentator}/>
                <Route path="commentators_product/:id" component={CommentatorProduct}/>

                <Route path="commentators/:index/:value" component={Commentators}/>
                <Route path="news/:id" component={Article}/>
                <Route path="news/:index/:value" component={Articles}/>

                <Route path="product/:id" component={Product}/>
                <Route path="product/:index/:value" component={ProductList}/>

                <Route path="news/:continent/:country/:index/:year/:month/:day/:value" component={ArticleLegacy}/>
                <Route path="news/:continent/:country/:index/:genre/:year/:month/:day/:value"
                       component={ArticleLegacy}/>
                <Route path="c/:id" component={Comment}/>
                <Route path="play/:index/:value/:skip/:limit" component={SuggestComment}/>

                <Route path="jcp" component={SearchComponentJCP}/>
    
                <Route path="home/product/:value" component={IntroProduct} />
                <Route path="home/youtube/:value" component={IntroYoutube} />
                <Route path="home/news/:value" component={Intro} />
                <IndexRoute component={Intro}/>
                
                <Route path="*" component={Notfound}/>
            </Route>
        </Router>
    );
};