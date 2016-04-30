import { combineReducers } from 'redux';

import commentators from 'reducers/commentators';
import commentatorDetail from 'reducers/commentatorDetail';
import articles from 'reducers/articles';
import articleDetail from 'reducers/articleDetail';


const rootReducer = combineReducers({
    commentators,
    commentatorDetail,
    articles,
    articleDetail
});

export default rootReducer;
