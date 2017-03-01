import { combineReducers } from 'redux';

import commentators from 'reducers/commentators';
import commentatorDetail from 'reducers/commentatorDetail';
import articles from 'reducers/articles';
import genres from 'reducers/genres';
import articleDetail from 'reducers/articleDetail';
import productDetail from 'reducers/productDetail';
import commentDetail from 'reducers/commentDetail';

import suggestCommentDetail from 'reducers/suggestCommentDetail'
import introDetail from 'reducers/introDetail'
import adminDetail from 'reducers/adminDetail'

const rootReducer = combineReducers({
    commentators,
    commentatorDetail,
    commentDetail,
    suggestCommentDetail,
    articles,
    genres,
    articleDetail,
    productDetail,
    introDetail,
    adminDetail
});

export default rootReducer;
