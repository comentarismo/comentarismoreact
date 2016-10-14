import superAgent from 'superagent';
import Promise, {using} from 'bluebird';
import _ from 'lodash';
import config from 'config';

export const CALL_API = Symbol('CALL_API');
export const CHAIN_API = Symbol('CHAIN_API');

export default ({dispatch, getState}) => next => action => {
    if (action[CALL_API]) {
        return dispatch({
            [CHAIN_API]: [
                ()=> action
            ]
        })
    }

    let deferred = Promise.defer();

    if (!action[CHAIN_API]) {
        return next(action)
    }

    let promiseCreators = action[CHAIN_API].map((apiActionCreator)=> {
        return createRequestPromise(apiActionCreator, next, getState, dispatch)
    });

    let overall = promiseCreators.reduce((promise, creator)=> {
        return promise.then((body)=> {
            return creator(body)
        })
    }, Promise.resolve());

    overall.finally((err)=> {
        deferred.resolve(err)
    }).catch((err)=> {
        console.log("createRequestPromise catch((err)", err);
    });

    return deferred.promise
}

function createRequestPromise(apiActionCreator, next, getState, dispatch) {
    return (prevBody)=> {
        let apiAction = apiActionCreator(prevBody);
        let deferred = Promise.defer();

        let params = extractParams(apiAction[CALL_API]);
        console.log("createRequestPromise -> ", params.url);
        superAgent[params.method](params.url)
            .withCredentials()
            .end((err, res)=> {
                if (err) {
                    console.log("createRequestPromise err -> ", res.error.message);
                    if (params.errorType) {
                        dispatch({
                            type: params.errorType,
                            error: err
                        })
                    }

                    if (_.isFunction(params.afterError)) {
                        params.afterError({getState})
                    }
                    deferred.reject()
                } else {

                    //var response = Object.keys(res.body).length == 0 ? res.text : res.body;

                    dispatch({
                        type: params.successType,
                        response: res.body
                    });

                    if (_.isFunction(params.afterSuccess)) {
                        params.afterSuccess({getState})
                    }

                    //console.log("res.body",response);

                    deferred.resolve(res.body)
                }
            });

        return deferred.promise;
    }

}

function extractParams(callApi) {
    let {method, path, successType, errorType, afterSuccess, afterError} = callApi;
    let url = `${path}`;

    return {
        method,
        url,
        successType,
        errorType,
        afterSuccess,
        afterError
    }
}
