import * as ActionType from 'actions/commentators';
function suggestCommentReducer(state = [], action) {
    switch (action.type) {
        case ActionType.LOADED_SUGGESTCOMMENT_DETAIL:
            return action.response;
            break;
        default:
            return state;
    }
}

export default suggestCommentReducer;
