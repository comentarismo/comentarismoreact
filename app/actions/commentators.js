import { CALL_API, CHAIN_API } from 'middleware/api'


//NOT IN USE
export const LOADED_COMMENTATORS = Symbol('LOADED_COMMENTATORS')
export function loadCommentators({index,value}) {
    console.log("loadCommentators", index, value);
    return {
        [CALL_API]: {
            method: 'get',
            path: `/fapi/commentators/${index}/${value}/0/50/`,
            successType: LOADED_COMMENTATORS
        }
    }
}

export const LOADED_COMMENTATOR_DETAIL = Symbol('LOADED_COMMENTATOR_DETAIL')
export function loadCommentatorDetail({ id }) {
    return {
        [CHAIN_API]: [
            ()=> {
                return {
                    [CALL_API]: {
                        method: 'get',
                        path: `/api/commentators/${id}`,
                        successType: LOADED_COMMENTATOR_DETAIL
                    }
                }
            }
        ]
    }
}
