import superAgent from 'superagent'
import Promise, { using } from 'bluebird'
import _ from 'lodash'
import StackTrace from 'stacktrace-js'

export const CALL_API = Symbol('CALL_API')
export const CHAIN_API = Symbol('CHAIN_API')

export default ({dispatch, getState}) => next => action => {
    if (action[CALL_API]) {
        return dispatch({
            [CHAIN_API]: [
                () => action,
            ],
        })
    }
    
    if (!action[CHAIN_API]) {
        return next(action)
    }
    
    let promiseCreators = action[CHAIN_API].map((apiActionCreator) => {
        return createRequestPromise(apiActionCreator, next, getState, dispatch)
    })
    
    let overall = promiseCreators.reduce((promise, creator) => {
        return promise.then((body) => {
            return creator(body)
        })
    }, Promise.resolve())
    
    return new Promise(function (resolve, reject) { //Or Q.defer() in Q
        
        overall.finally((err) => {
            resolve(err)
        }).catch((err) => {
            StackTrace.fromError(err).then((stackFrames) => {
                const errStack = stackFrames.map(sf => sf.toString()).
                    join('\n')
                console.log(
                    'ERROR: api.js, createRequestPromise catch((err)), ',
                    errStack)
                reject(err)
            }).catch(error => {
                console.log(
                    'ERROR: api.js, createRequestPromise catch((err)), ', err,
                    error)
                reject(err)
            })
        })
        resolve(overall)
    })
}

function createRequestPromise (apiActionCreator, next, getState, dispatch) {
    return (prevBody) => {
        let apiAction = apiActionCreator(prevBody)
        
        let params = extractParams(apiAction[CALL_API])
        
        return new Promise(function (resolve, reject) {
            
            superAgent[params.method](params.url).
                withCredentials().
                end((err, res) => {
                    
                    if (err) {
                        console.log('ERROR: api.js, createRequestPromise, ',
                            params.url, err)
                        if (params.errorType) {
                            dispatch({
                                type: params.errorType,
                                error: err,
                            })
                        }
                        
                        if (_.isFunction(params.afterError)) {
                            params.afterError({getState})
                        }
                        reject(err)
                    } else {
                        
                        //var response = Object.keys(res.body).length == 0 ? res.text : res.body;
                        
                        dispatch({
                            type: params.successType,
                            response: res.body,
                        })
                        
                        if (_.isFunction(params.afterSuccess)) {
                            params.afterSuccess({getState})
                        }
                        
                        //console.log("res.body",response);
                        
                        resolve(res.body)
                    }
                    
                })
            
        })
    }
    
}

function extractParams (callApi) {
    let {method, path, successType, errorType, afterSuccess, afterError} = callApi
    let url = `${path}`
    
    return {
        method,
        url,
        successType,
        errorType,
        afterSuccess,
        afterError,
    }
}
