
const EXERCISE_NAME = "SW_05";
const FOLDER_NAME = "";
const MY_NAME = EXERCISE_NAME + FOLDER_NAME;
const VERSION = "_V1";
const CACHE_NAME = MY_NAME + VERSION;
const CACHE_FAILURES = MY_NAME + "_FAILS" + VERSION;
const failmessage = "Network is off, will retry";


const INITIAL_CACHE = [];  // the caching is annoying here...


self.addEventListener('install', function(event) {
   console.log(MY_NAME + ': install event');
   event.waitUntil(caches.open(CACHE_NAME)
                    .then(function(cache) {
                        return cache.addAll(INITIAL_CACHE);
                     })
                     .catch(err => console.log('install failed: ' + err))
      );
});



self.addEventListener('activate', function(event) {
   console.log(MY_NAME + ': activate event');
   event.waitUntil(
      caches.keys().then(function(cacheNames) {
         return Promise.all(
            cacheNames.map(function(cacheName) {
               if (!cacheName.endsWith(VERSION)) {
                  return caches.delete(cacheName);
               }
            })
          );
       })
   );
});


self.addEventListener('fetch', function doNothing(event) {
   console.log(MY_NAME + ': doNothing() fetch listener called for ' + event.request.url);
   return;  // we aren't handling it
});


self.addEventListener('fetch', function postHander(event) {
   if (event.request.method === 'POST') {
      console.log(MY_NAME + ': postHander() fetch listener called for ' + event.request.url);
      var copyOfRequest = event.request.clone();
      event.respondWith(
         fetch(event.request)
         .then (function(response) {
            if (!response.ok)
               return saveFailedRequest(copyOfRequest, "fail: " + response.status, response, event.clientId);
            else
               return response;
         })
         .catch(function(err) {
             return saveFailedRequest(copyOfRequest, "Network is off, will retry");
         })
      );
   }
});


function saveFailedRequest(failedRequest, fillinMessage, originalResponse, clientId) {
   console.log('saveFailedRequest(): ' + fillinMessage);
   var tempResponse = new Response(fillinMessage);
   originalResponse = originalResponse || tempResponse;
   var fakedRequest;
   return fakeGETRequest(failedRequest)
      .then(function(faked) {
         fakedRequest = faked;
         fakedRequest.clientId = clientId;
         return caches.open(CACHE_FAILURES);
      })
      .then(function(cache) {
         cache.put(fakedRequest, originalResponse);
         return tempResponse;
      });
}


self.addEventListener('sync', function(event) {
   console.log(MY_NAME + " sync event called " + event);
   event.waitUntil(
      var theCache;
      caches.open(CACHE_FAILURES)
      .then(cache => {
         theCache = cache;
         return cache.keys();
      })
      .then(function(failedRequests) {
         console.dir(failedRequests);
         return failedRequests.map(function(failedRequest) {
            theCache.delete(failedRequest)
            .then(function() {
               var originalRequest = restoreFakedRequest(failedRequest);
               // in a real app would do something here
               console.log("would be notifying " + originalRequest.clientId);
            })
          })
       })
    );
   //           return fetch(realRequest)
   //                  .then(function(response) {
   //                     clients.
   //                  });
   //        })
   //
   //     })
   //     .then()
   // )
})


function retry(request) {
   var unFake = fakeRequest(request);

}


self.addEventListener('xxxsync', event => {
   var rspText;
  if (event.tag == 'submit') {
      var formData = new FormData();
      formData.set("name", "JohnDoe");
    event.waitUntil(
      fetch('http://www.flyingspaniel.com/echo.php', {
          method: 'POST',
          mode: 'no-cors',
          body: formData,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
      .then(function(response) {
         return response.text();
      })
      .then(function(text) {
         rspText = text; // ick
  // ick
        // Tell pages of your success so they can update UI
        return clients.matchAll({ includeUncontrolled: true })
      }).then(function(clients) {
        clients.forEach(function(client) { client.postMessage('submit successful with response ' + rspText)} );
      })
    );
  }
});


/**
 * You can't cache a Request that has a body or isn't a GET
 * This creates a "GET" request that preserves the info
 * This reads from and "uses up" the incoming request
 *
 * @param  Request      request destroyed by ths fucntion
 * @param  String       method  only used from restoreFakedRequest
 * @param  arrayBuffer  body    only used from restoreFakedRequest
 * @return Promise      for a Request
 */
function fakeGETRequest(request, method, body) {
   return request.arrayBuffer()
     .then(function(bodyArrayBuffer) {
        var init = {
           // these two may get "toggled" to refer to a previous version
           method: method || 'GET',
           body: body,

           // these are preserved
           headers: request.headers,
           mode: request.mode,
           credentials: request.credentials,
           cache: request.cache,
           redirect: request.redirect,
           referrer: request.referrer,
           integrity: request.integrity,
        }
        var faked = new Request(request.url, init);

        faked.methodWas = request.method;  // preserve these for next time through
        faked.bodyWas = bodyArrayBuffer;
        faked.clientId = request.clientId;

        return faked;
     });
}

// could be named "toggle" but thought this was clearer
function restoreFakedRequest(request) {
   return fakeGETRequest(request, request.methodWas, request.bodyWas);
}

function updateCache(request, response) {
   if (response && (response.status === 200)) {
      caches.open(CACHE_NAME)
         .then(function(cache) {
            console.log(MY_NAME + ': updated cache for ' + request.url);
            cache.put(request, response);
         });
   }
}
