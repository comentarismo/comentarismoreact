"use strict";var precacheConfig=[["app.js","2ab272d6f9f1c2ada6e8f9c33262fafc"],["manifest.js","5966edcc941bf18aad8a0fcdf10bd0e2"],["sw.js","6a644696b7ecddcc8a3611e57bb49988"]],cacheName="sw-precache-v3-comentarismo-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var n=new URL(e);return"/"===n.pathname.slice(-1)&&(n.pathname+=t),n.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(t){return new Response(t,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,t,n,r){var o=new URL(e);return r&&o.pathname.match(r)||(o.search+=(o.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(n)),o.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var n=new URL(t).pathname;return e.some(function(e){return n.match(e)})},stripIgnoredUrlParameters=function(e,t){var n=new URL(e);return n.hash="",n.search=n.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return t.every(function(t){return!t.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),n.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],n=e[1],r=new URL(t,self.location),o=createCacheKey(r,hashParamName,n,!1);return[r.toString(),o]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(n){if(!t.has(n)){var r=new Request(n,{credentials:"same-origin"});return fetch(r).then(function(t){if(!t.ok)throw new Error("Request for "+n+" returned a response with status "+t.status);return cleanResponse(t).then(function(t){return e.put(n,t)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(n){return Promise.all(n.map(function(n){if(!t.has(n.url))return e.delete(n)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var t,n=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching),r="index.html";(t=urlsToCacheKeys.has(n))||(n=addDirectoryIndex(n,r),t=urlsToCacheKeys.has(n));var o="https://www.comentarismo.com/";!t&&"navigate"===e.request.mode&&isPathWhitelisted([],e.request.url)&&(n=new URL(o,self.location).toString(),t=urlsToCacheKeys.has(n)),t&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(n)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(t){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,t),fetch(e.request)}))}}),function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).toolbox=e()}}(function(){return function e(t,n,r){function o(i,s){if(!n[i]){if(!t[i]){var c="function"==typeof require&&require;if(!s&&c)return c(i,!0);if(a)return a(i,!0);var u=new Error("Cannot find module '"+i+"'");throw u.code="MODULE_NOT_FOUND",u}var h=n[i]={exports:{}};t[i][0].call(h.exports,function(e){var n=t[i][1][e];return o(n||e)},h,h.exports,e,t,n,r)}return n[i].exports}for(var a="function"==typeof require&&require,i=0;i<r.length;i++)o(r[i]);return o}({1:[function(e,t,n){function r(e,t){((t=t||{}).debug||s.debug)&&console.log("[sw-toolbox] "+e)}function o(e){var t;return e&&e.cache&&(t=e.cache.name),t=t||s.cache.name,caches.open(t)}function a(e){var t=Array.isArray(e);if(t&&e.forEach(function(e){"string"==typeof e||e instanceof Request||(t=!1)}),!t)throw new TypeError("The precache method expects either an array of strings and/or Requests or a Promise that resolves to an array of strings and/or Requests.");return e}var i,s=e("./options"),c=e("./idb-cache-expiration");t.exports={debug:r,fetchAndCache:function(e,t){var n=(t=t||{}).successResponses||s.successResponses;return fetch(e.clone()).then(function(a){return"GET"===e.method&&n.test(a.status)&&o(t).then(function(n){n.put(e,a).then(function(){var o,a=t.cache||s.cache;(a.maxEntries||a.maxAgeSeconds)&&a.name&&(o=function(e,t,n){var o=e.url,a=n.maxAgeSeconds,i=n.maxEntries,s=n.name,u=Date.now();return r("Updating LRU order for "+o+". Max entries is "+i+", max age is "+a),c.getDb(s).then(function(e){return c.setTimestampForUrl(e,o,u)}).then(function(e){return c.expireEntries(e,i,a,u)}).then(function(e){r("Successfully updated IDB.");var n=e.map(function(e){return t.delete(e)});return Promise.all(n).then(function(){r("Done with cache cleanup.")})}).catch(function(e){r(e)})}.bind(null,e,n,a),i=i?i.then(o):o())})}),a.clone()})},openCache:o,renameCache:function(e,t,n){return r("Renaming cache: ["+e+"] to ["+t+"]",n),caches.delete(t).then(function(){return Promise.all([caches.open(e),caches.open(t)]).then(function(t){var n=t[0],r=t[1];return n.keys().then(function(e){return Promise.all(e.map(function(e){return n.match(e).then(function(t){return r.put(e,t)})}))}).then(function(){return caches.delete(e)})})})},cache:function(e,t){return o(t).then(function(t){return t.add(e)})},uncache:function(e,t){return o(t).then(function(t){return t.delete(e)})},precache:function(e){e instanceof Promise||a(e),s.preCacheItems=s.preCacheItems.concat(e)},validatePrecacheInput:a,isResponseFresh:function(e,t,n){if(!e)return!1;if(t){var r=e.headers.get("date");if(r&&new Date(r).getTime()+1e3*t<n)return!1}return!0}}},{"./idb-cache-expiration":2,"./options":4}],2:[function(e,t,n){var r="sw-toolbox-",o=1,a="store",i="url",s="timestamp",c={};t.exports={getDb:function(e){return e in c||(c[e]=(t=e,new Promise(function(e,n){var c=indexedDB.open(r+t,o);c.onupgradeneeded=function(){c.result.createObjectStore(a,{keyPath:i}).createIndex(s,s,{unique:!1})},c.onsuccess=function(){e(c.result)},c.onerror=function(){n(c.error)}}))),c[e];var t},setTimestampForUrl:function(e,t,n){return new Promise(function(r,o){var i=e.transaction(a,"readwrite");i.objectStore(a).put({url:t,timestamp:n}),i.oncomplete=function(){r(e)},i.onabort=function(){o(i.error)}})},expireEntries:function(e,t,n,r){return(o=e,c=n,u=r,c?new Promise(function(e,t){var n=1e3*c,r=[],h=o.transaction(a,"readwrite"),f=h.objectStore(a);f.index(s).openCursor().onsuccess=function(e){var t=e.target.result;if(t&&u-n>t.value[s]){var o=t.value[i];r.push(o),f.delete(o),t.continue()}},h.oncomplete=function(){e(r)},h.onabort=t}):Promise.resolve([])).then(function(n){return(r=e,o=t,o?new Promise(function(e,t){var n=[],c=r.transaction(a,"readwrite"),u=c.objectStore(a),h=u.index(s),f=h.count();h.count().onsuccess=function(){var e=f.result;e>o&&(h.openCursor().onsuccess=function(t){var r=t.target.result;if(r){var a=r.value[i];n.push(a),u.delete(a),e-n.length>o&&r.continue()}})},c.oncomplete=function(){e(n)},c.onabort=t}):Promise.resolve([])).then(function(e){return n.concat(e)});var r,o});var o,c,u}}},{}],3:[function(e,t,n){function r(e){return e.reduce(function(e,t){return e.concat(t)},[])}e("serviceworker-cache-polyfill");var o=e("./helpers"),a=e("./router"),i=e("./options");t.exports={fetchListener:function(e){var t=a.match(e.request);t?e.respondWith(t(e.request)):a.default&&"GET"===e.request.method&&0===e.request.url.indexOf("http")&&e.respondWith(a.default(e.request))},activateListener:function(e){o.debug("activate event fired");var t=i.cache.name+"$$$inactive$$$";e.waitUntil(o.renameCache(t,i.cache.name))},installListener:function(e){var t=i.cache.name+"$$$inactive$$$";o.debug("install event fired"),o.debug("creating cache ["+t+"]"),e.waitUntil(o.openCache({cache:{name:t}}).then(function(e){return Promise.all(i.preCacheItems).then(r).then(o.validatePrecacheInput).then(function(t){return o.debug("preCache list: "+(t.join(", ")||"(none)")),e.addAll(t)})}))}}},{"./helpers":1,"./options":4,"./router":6,"serviceworker-cache-polyfill":16}],4:[function(e,t,n){var r;r=self.registration?self.registration.scope:self.scope||new URL("./",self.location).href,t.exports={cache:{name:"$$$toolbox-cache$$$"+r+"$$$",maxAgeSeconds:null,maxEntries:null},debug:!1,networkTimeoutSeconds:null,preCacheItems:[],successResponses:/^0|([123]\d\d)|(40[14567])|410$/}},{}],5:[function(e,t,n){var r=new URL("./",self.location).pathname,o=e("path-to-regexp"),a=function(e,t,n,a){t instanceof RegExp?this.fullUrlRegExp=t:(0!==t.indexOf("/")&&(t=r+t),this.keys=[],this.regexp=o(t,this.keys)),this.method=e,this.options=a,this.handler=n};a.prototype.makeHandler=function(e){var t;if(this.regexp){var n=this.regexp.exec(e);t={},this.keys.forEach(function(e,r){t[e.name]=n[r+1]})}return function(e){return this.handler(e,t,this.options)}.bind(this)},t.exports=a},{"path-to-regexp":15}],6:[function(e,t,n){var r=e("./route"),o=e("./helpers"),a=function(e,t){for(var n=e.entries(),r=n.next(),o=[];!r.done;){new RegExp(r.value[0]).test(t)&&o.push(r.value[1]),r=n.next()}return o},i=function(){this.routes=new Map,this.routes.set(RegExp,new Map),this.default=null};["get","post","put","delete","head","any"].forEach(function(e){i.prototype[e]=function(t,n,r){return this.add(e,t,n,r)}}),i.prototype.add=function(e,t,n,a){var i;a=a||{},t instanceof RegExp?i=RegExp:i=(i=a.origin||self.location.origin)instanceof RegExp?i.source:i.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),e=e.toLowerCase();var s=new r(e,t,n,a);this.routes.has(i)||this.routes.set(i,new Map);var c=this.routes.get(i);c.has(e)||c.set(e,new Map);var u=c.get(e),h=s.regexp||s.fullUrlRegExp;u.has(h.source)&&o.debug('"'+t+'" resolves to same regex as existing route.'),u.set(h.source,s)},i.prototype.matchMethod=function(e,t){var n=new URL(t),r=n.origin,o=n.pathname;return this._match(e,a(this.routes,r),o)||this._match(e,[this.routes.get(RegExp)],t)},i.prototype._match=function(e,t,n){if(0===t.length)return null;for(var r=0;r<t.length;r++){var o=t[r],i=o&&o.get(e.toLowerCase());if(i){var s=a(i,n);if(s.length>0)return s[0].makeHandler(n)}}return null},i.prototype.match=function(e){return this.matchMethod(e.method,e.url)||this.matchMethod("any",e.url)},t.exports=new i},{"./helpers":1,"./route":5}],7:[function(e,t,n){var r=e("../options"),o=e("../helpers");t.exports=function(e,t,n){return n=n||{},o.debug("Strategy: cache first ["+e.url+"]",n),o.openCache(n).then(function(t){return t.match(e).then(function(t){var a=n.cache||r.cache,i=Date.now();return o.isResponseFresh(t,a.maxAgeSeconds,i)?t:o.fetchAndCache(e,n)})})}},{"../helpers":1,"../options":4}],8:[function(e,t,n){var r=e("../options"),o=e("../helpers");t.exports=function(e,t,n){return n=n||{},o.debug("Strategy: cache only ["+e.url+"]",n),o.openCache(n).then(function(t){return t.match(e).then(function(e){var t=n.cache||r.cache,a=Date.now();if(o.isResponseFresh(e,t.maxAgeSeconds,a))return e})})}},{"../helpers":1,"../options":4}],9:[function(e,t,n){var r=e("../helpers"),o=e("./cacheOnly");t.exports=function(e,t,n){return r.debug("Strategy: fastest ["+e.url+"]",n),new Promise(function(a,i){var s=!1,c=[],u=function(e){c.push(e.toString()),s?i(new Error('Both cache and network failed: "'+c.join('", "')+'"')):s=!0},h=function(e){e instanceof Response?a(e):u("No result returned")};r.fetchAndCache(e.clone(),n).then(h,u),o(e,t,n).then(h,u)})}},{"../helpers":1,"./cacheOnly":8}],10:[function(e,t,n){t.exports={networkOnly:e("./networkOnly"),networkFirst:e("./networkFirst"),cacheOnly:e("./cacheOnly"),cacheFirst:e("./cacheFirst"),fastest:e("./fastest")}},{"./cacheFirst":7,"./cacheOnly":8,"./fastest":9,"./networkFirst":11,"./networkOnly":12}],11:[function(e,t,n){var r=e("../options"),o=e("../helpers");t.exports=function(e,t,n){var a=(n=n||{}).successResponses||r.successResponses,i=n.networkTimeoutSeconds||r.networkTimeoutSeconds;return o.debug("Strategy: network first ["+e.url+"]",n),o.openCache(n).then(function(t){var s,c,u=[];if(i){var h=new Promise(function(a){s=setTimeout(function(){t.match(e).then(function(e){var t=n.cache||r.cache,i=Date.now(),s=t.maxAgeSeconds;o.isResponseFresh(e,s,i)&&a(e)})},1e3*i)});u.push(h)}var f=o.fetchAndCache(e,n).then(function(e){if(s&&clearTimeout(s),a.test(e.status))return e;throw o.debug("Response was an HTTP error: "+e.statusText,n),c=e,new Error("Bad response")}).catch(function(r){return o.debug("Network or response error, fallback to cache ["+e.url+"]",n),t.match(e).then(function(e){if(e)return e;if(c)return c;throw r})});return u.push(f),Promise.race(u)})}},{"../helpers":1,"../options":4}],12:[function(e,t,n){var r=e("../helpers");t.exports=function(e,t,n){return r.debug("Strategy: network only ["+e.url+"]",n),fetch(e)}},{"../helpers":1}],13:[function(e,t,n){var r=e("./options"),o=e("./router"),a=e("./helpers"),i=e("./strategies"),s=e("./listeners");a.debug("Service Worker Toolbox is loading"),self.addEventListener("install",s.installListener),self.addEventListener("activate",s.activateListener),self.addEventListener("fetch",s.fetchListener),t.exports={networkOnly:i.networkOnly,networkFirst:i.networkFirst,cacheOnly:i.cacheOnly,cacheFirst:i.cacheFirst,fastest:i.fastest,router:o,options:r,cache:a.cache,uncache:a.uncache,precache:a.precache}},{"./helpers":1,"./listeners":3,"./options":4,"./router":6,"./strategies":10}],14:[function(e,t,n){t.exports=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)}},{}],15:[function(e,t,n){function r(e,t){for(var n,r=[],o=0,a=0,s="",c=t&&t.delimiter||"/";null!=(n=l.exec(e));){var u=n[0],h=n[1],f=n.index;if(s+=e.slice(a,f),a=f+u.length,h)s+=h[1];else{var p=e[a],d=n[2],m=n[3],g=n[4],v=n[5],w=n[6],x=n[7];s&&(r.push(s),s="");var y=null!=d&&null!=p&&p!==d,b="+"===w||"*"===w,R="?"===w||"*"===w,E=n[2]||c,C=g||v;r.push({name:m||o++,prefix:d||"",delimiter:E,optional:R,repeat:b,partial:y,asterisk:!!x,pattern:C?(k=C,k.replace(/([=!:$\/()])/g,"\\$1")):x?".*":"[^"+i(E)+"]+?"})}}var k;return a<e.length&&(s+=e.substr(a)),s&&r.push(s),r}function o(e){return encodeURI(e).replace(/[\/?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function a(e){for(var t=new Array(e.length),n=0;n<e.length;n++)"object"==typeof e[n]&&(t[n]=new RegExp("^(?:"+e[n].pattern+")$"));return function(n,r){for(var a="",i=n||{},s=(r||{}).pretty?o:encodeURIComponent,c=0;c<e.length;c++){var u=e[c];if("string"!=typeof u){var h,l=i[u.name];if(null==l){if(u.optional){u.partial&&(a+=u.prefix);continue}throw new TypeError('Expected "'+u.name+'" to be defined')}if(f(l)){if(!u.repeat)throw new TypeError('Expected "'+u.name+'" to not repeat, but received `'+JSON.stringify(l)+"`");if(0===l.length){if(u.optional)continue;throw new TypeError('Expected "'+u.name+'" to not be empty')}for(var p=0;p<l.length;p++){if(h=s(l[p]),!t[c].test(h))throw new TypeError('Expected all "'+u.name+'" to match "'+u.pattern+'", but received `'+JSON.stringify(h)+"`");a+=(0===p?u.prefix:u.delimiter)+h}}else{if(h=u.asterisk?encodeURI(l).replace(/[?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()}):s(l),!t[c].test(h))throw new TypeError('Expected "'+u.name+'" to match "'+u.pattern+'", but received "'+h+'"');a+=u.prefix+h}}else a+=u}return a}}function i(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function s(e,t){return e.keys=t,e}function c(e){return e.sensitive?"":"i"}function u(e,t,n){f(t)||(n=t||n,t=[]);for(var r=(n=n||{}).strict,o=!1!==n.end,a="",u=0;u<e.length;u++){var h=e[u];if("string"==typeof h)a+=i(h);else{var l=i(h.prefix),p="(?:"+h.pattern+")";t.push(h),h.repeat&&(p+="(?:"+l+p+")*"),a+=p=h.optional?h.partial?l+"("+p+")?":"(?:"+l+"("+p+"))?":l+"("+p+")"}}var d=i(n.delimiter||"/"),m=a.slice(-d.length)===d;return r||(a=(m?a.slice(0,-d.length):a)+"(?:"+d+"(?=$))?"),a+=o?"$":r&&m?"":"(?="+d+"|$)",s(new RegExp("^"+a,c(n)),t)}function h(e,t,n){return f(t)||(n=t||n,t=[]),n=n||{},e instanceof RegExp?function(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return s(e,t)}(e,t):f(e)?function(e,t,n){for(var r=[],o=0;o<e.length;o++)r.push(h(e[o],t,n).source);return s(new RegExp("(?:"+r.join("|")+")",c(n)),t)}(e,t,n):(o=t,u(r(e,a=n),o,a));var o,a}var f=e("isarray");t.exports=h,t.exports.parse=r,t.exports.compile=function(e,t){return a(r(e,t))},t.exports.tokensToFunction=a,t.exports.tokensToRegExp=u;var l=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g")},{isarray:14}],16:[function(e,t,n){!function(){var e=Cache.prototype.addAll,t=navigator.userAgent.match(/(Firefox|Chrome)\/(\d+\.)/);if(t)var n=t[1],r=parseInt(t[2]);e&&(!t||"Firefox"===n&&r>=46||"Chrome"===n&&r>=50)||(Cache.prototype.addAll=function(e){function t(e){this.name="NetworkError",this.code=19,this.message=e}var n=this;return t.prototype=Object.create(Error.prototype),Promise.resolve().then(function(){if(arguments.length<1)throw new TypeError;return e=e.map(function(e){return e instanceof Request?e:String(e)}),Promise.all(e.map(function(e){"string"==typeof e&&(e=new Request(e));var n=new URL(e.url).protocol;if("http:"!==n&&"https:"!==n)throw new t("Invalid scheme");return fetch(e.clone())}))}).then(function(r){if(r.some(function(e){return!e.ok}))throw new t("Incorrect response status");return Promise.all(r.map(function(t,r){return n.put(e[r],t)}))}).then(function(){})},Cache.prototype.add=function(e){return this.addAll([e])})}()},{}]},{},[13])(13)}),toolbox.router.get(/^https:\/\/(www\.)?comentarismo.com$/,toolbox.networkFirst,{});