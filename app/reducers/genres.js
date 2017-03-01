import * as ActionType from 'actions/genres';

function genresReducer(state = [], action) {
    switch (action.type) {
        case ActionType.LOADED_GENRES:
            return action.response;
            break;
        default:
            return state;
    }
}

export default genresReducer;
