import { combineReducers } from 'redux';

import commentators from 'reducers/commentators';
import commentatorDetail from 'reducers/commentatorDetail';
import articles from 'reducers/articles';
import articleDetail from 'reducers/articleDetail';
import commentDetail from 'reducers/commentDetail';

import suggestCommentDetail from 'reducers/suggestCommentDetail'
import introDetail from 'reducers/introDetail'


const rootReducer = combineReducers({
    commentators,
    commentatorDetail,
    commentDetail,
    suggestCommentDetail,
    articles,
    articleDetail,
    introDetail,
});

export default rootReducer;
