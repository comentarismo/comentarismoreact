import { CALL_API, CHAIN_API } from 'middleware/api'
import config from 'config'

export const LOADED_ARTICLES = Symbol('LOADED_ARTICLES')
export function loadArticles({index,value}) {
  return {
    [CALL_API]: {
      method: 'get',
      path: `${config.BASE_URL}/gapi_range/news/${index}/${value}/0/50/?range=12`,
      successType: LOADED_ARTICLES
    }
  }
}

export const LOADED_ARTICLE_DETAIL = Symbol('LOADED_ARTICLE_DETAIL')
export function loadArticleDetail ({ id }) {
  return {
    [CHAIN_API]: [
      ()=> {
        return {
          [CALL_API]: {
            method: 'get',
            path: `${config.BASE_URL}/api/news/${id}`,
            successType: LOADED_ARTICLE_DETAIL
          }
        }
      }
    ]
  }
}


export const LOADED_ARTICLE_LEGACY = Symbol('LOADED_ARTICLE_LEGACY')
export function loadArticleLegacy ({ index,value }) {
  return {
    [CHAIN_API]: [
      ()=> {
        return {
          [CALL_API]: {
            method: 'get',
            path: `${config.BASE_URL}/api/news/${value}`,
            successType: LOADED_ARTICLE_DETAIL
          }
        }
      }
    ]
  }
}