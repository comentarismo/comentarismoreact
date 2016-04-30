import * as ActionType from 'actions/articles';
import _ from 'lodash'

let defaultState = {
  user: {}
};

export default function(state = defaultState, action) {
  let cloned
  switch(action.type) {
    case ActionType.LOADED_ARTICLE_DETAIL:
      cloned = _.clone(state)
      return _.merge(cloned, action.response)

    default:
      return state
  }
}
