import * as ActionType from 'actions/articles';

function articlesReducer (state = [], action) {
  switch(action.type) {
    case ActionType.LOADED_ARTICLES:
      return action.response;
      break;
    default:
      return state;
  }
}

export default articlesReducer;
