import { CALL_API, CHAIN_API } from 'middleware/api'
import config from 'config'

export const LOADED_GENRES = Symbol('LOADED_GENRES')
export function loadGenres({table,index,value}) {
    return {
        [CALL_API]: {
            method: 'get',
            path: `${config.BASE_URL}/api/getalldistinctybyindex/${table}/${index}/${value}`,
            successType: LOADED_GENRES
        }
    }
}
