import { CALL_API, CHAIN_API } from 'middleware/api'
import config from 'config'

export const LOADED_ARTICLES = Symbol('LOADED_PRODUCTS')
export function loadProducts({index,value}) {
  return {
    [CALL_API]: {
      method: 'get',
      path: `${config.BASE_URL}/gapi_range/product/${index}/${value}/0/50/?range=12`,
      successType: LOADED_ARTICLES
    }
  }
}

export const LOADED_PRODUCT_DETAIL = Symbol('LOADED_PRODUCT_DETAIL')
export function loadProductDetail ({ id }) {
  return {
    [CHAIN_API]: [
      ()=> {
        return {
          [CALL_API]: {
            method: 'get',
            path: `${config.BASE_URL}/api/product/${id}`,
            successType: LOADED_PRODUCT_DETAIL
          }
        }
      }
    ]
  }
}
