import { CALL_API, CHAIN_API } from 'middleware/api'
import config from 'config'

export const LOADED_INTRO = Symbol('LOADED_INTRO')
export function loadIntroDetail({ index,value,skip,limit }) {
    //console.log("loading Intro data");
    return {
        [CHAIN_API]: [
            ()=> {
                return {
                    [CALL_API]: {
                        method: 'get',
                        path: `${config.BASE_URL}/intropage/commentaries/${index}/${value}/${skip}/${limit}/`,
                        successType: LOADED_INTRO
                    }
                }
            }
        ]
    }
}
