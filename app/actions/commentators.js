import { CALL_API, CHAIN_API } from 'middleware/api'

import config from 'config'

//NOT IN USE
export const LOADED_COMMENTATORS = Symbol('LOADED_COMMENTATORS');
export function loadCommentators({index,value}) {
    console.log("loadCommentators", index, value);
    return {
        [CALL_API]: {
            method: 'get',
            path: `${config.BASE_URL}/fapi/commentators/${index}/${value}/0/50/`,
            successType: LOADED_COMMENTATORS
        }
    }
}

export const LOADED_COMMENTATOR_DETAIL = Symbol('LOADED_COMMENTATOR_DETAIL');
export function loadCommentatorDetail({ id, table }) {
    return {
        [CHAIN_API]: [
            ()=> {
                return {
                    [CALL_API]: {
                        method: 'get',
                        path: `${config.BASE_URL}/api_v2/${table}/${id}`,
                        successType: LOADED_COMMENTATOR_DETAIL
                    }
                }
            }
        ]
    }
}


export const LOADED_COMMENT_DETAIL = Symbol('LOADED_COMMENT_DETAIL');
export function loadCommentDetail({ id }) {
    return {
        [CHAIN_API]: [
            ()=> {
                return {
                    [CALL_API]: {
                        method: 'get',
                        path: `${config.BASE_URL}/api/comment/${id}`,
                        successType: LOADED_COMMENT_DETAIL
                    }
                }
            }
        ]
    }
}


export const LOADED_SUGGESTCOMMENT_DETAIL = Symbol('LOADED_SUGGESTCOMMENT_DETAIL');
export function loadSuggestCommentDetail({ index,value,skip,limit }) {
    return {
        [CHAIN_API]: [
            ()=> {
                return {
                    [CALL_API]: {
                        method: 'get',
                        path: `${config.BASE_URL}/commentsapi/commentaries/${index}/${value}/${skip}/${limit}/`,
                        successType: LOADED_SUGGESTCOMMENT_DETAIL
                    }
                }
            }
        ]
    }
}

export const LOADED_SENTIMENTCOMMENT_DETAIL = Symbol('LOADED_SENTIMENTCOMMENT_DETAIL');
export function loadSentimentCommentDetail({ url, lang, refresh }) {
    var target = `${config.SNT_URL}/moody?vid=${url}`;
    if(lang) {
        target =  target+`&lang=${lang}`;
    }

    if(refresh){
        target =  target+`&refresh=${refresh}`;
    }

    console.log("loadSentimentCommentDetail -> ",target);
    return {
        [CHAIN_API]: [
            ()=> {
                return {
                    [CALL_API]: {
                        method: 'get',
                        path: target,
                        successType: LOADED_SENTIMENTCOMMENT_DETAIL
                    }
                }
            }
        ]
    }
}