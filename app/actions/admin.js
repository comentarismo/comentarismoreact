import { CALL_API, CHAIN_API } from 'middleware/api'

import config from 'config'
var host = config.API_URL;

export const LOADED_ADMIN_DETAIL = Symbol('LOADED_ADMIN_DETAIL');
export function loadAdminDetail({table,index}) {
    var target = `${host}/read/${table}/${index}/`;
    console.log("loadAdminDetail", target);
    return {
        [CALL_API]: {
            method: 'get',
            path: target,
            successType: LOADED_ADMIN_DETAIL
        }
    }
}