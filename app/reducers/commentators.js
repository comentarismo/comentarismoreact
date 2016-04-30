import * as ActionType from 'actions/commentators';

function commentatorsReducer (state = [], action) {
  switch(action.type) {
    case ActionType.LOADED_COMMENTATORS:
      return action.response;
      break;
    default:
      return state;
  }
}

export default commentatorsReducer;
