import { CALL_API, CHAIN_API } from 'middleware/api'
import config from 'config'

export const LOADED_INTRO = Symbol('LOADED_INTRO')
export function loadIntroDetail({  }) {
    //console.log("loading Intro data");
    return {
        [CHAIN_API]: [
            ()=> {
                return {
                    [CALL_API]: {
                        method: 'get',
                        path: `${config.BASE_URL}/apihomepage/`,
                        successType: LOADED_INTRO
                    }
                }
            }
        ]
    }
}
