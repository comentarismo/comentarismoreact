import * as ActionType from 'actions/commentators';
import _ from 'lodash'

let defaultState = {
    user: {}
};

export default function (state = defaultState, action) {
    let cloned
    switch (action.type) {
        case ActionType.LOADED_COMMENTATOR_DETAIL:
            cloned = _.clone(state)
            return _.merge(cloned, action.response)

        default:
            return state
    }
}
