
const CACHE_NAME = "V1";
const CACHE_FAILURES = CACHE_NAME + "_FAILS";
const MY_NAME = "SW_04_" + CACHE_NAME;
const failmessage = "Network is off, will retry";

/** Global variables and code are very unusual, test */
var someGlobal = " MY_NAME" + CACHE_NAME;

//console.log('Entering serviceworker ' + someGlobal);
/* end of global test area */


const INITIAL_CACHE = [];  // the caching is annoying here...


self.addEventListener('install', function(event) {
   someGlobal = someGlobal + " install";
   console.log(MY_NAME + ': install event' + someGlobal);
   event.waitUntil(caches.open(CACHE_NAME)
                    .then(function(cache) {
                        return cache.addAll(INITIAL_CACHE);
                     })
                     .catch(err => console.log('install failed: ' + err))
      );
});



self.addEventListener('activate', function(event) {
   someGlobal = someGlobal + " & activate";
   console.log(MY_NAME + ': activate event' + someGlobal);
   event.waitUntil(
      caches.keys().then(function(cacheNames) {
         return Promise.all(
            cacheNames.map(function(cacheName) {
               if (!cacheName.startsWith(CACHE_NAME)) {
                  return caches.delete(cacheName);
               }
            })
          );
       })
   );
});



// first, attach a "do nothing" handler
// try moving this after the real one
self.addEventListener('fetch', function doNothing(event) {
   console.log('doNothing() fetch listener called for ' + event.request.url);
   event.request.foo = 'bar';
   return;  // we aren't handling it
});


self.addEventListener('fetch', function postHander(event) {
   if (event.request.method === 'POST') {
      console.log('postHander() fetch listener called for ' + event.request.url);
      var fake;
      event.respondWith(
         fakeRequest(event.request)
         .then(function(x) {
            fake = x.fake;
            fake.clientId = event.clientId;
            return fetch(x.original)
         })
         .then (function(response) {
            if (!response.ok)
               return saveFailedRequest(fake, "fail: " + response.status, response);
            else
               return response;
         })
         .catch(function(err) {
             return saveFailedRequest(fake, "Network is off, will retry");
         })
      );
   }
});


function saveFailedRequest(fakedRequest, fillinMessage, originalResponse) {
   console.log('saveFailedRequest(): ' + fillinMessage);
   var tempResponse = new Response(fillinMessage);
   originalResponse = originalResponse || tempResponse;;
   return caches.open(CACHE_FAILURES)
      .then(function(cache) {
         cache.put(fakedRequest, originalResponse);
         return tempResponse;
      });
}

self.addEventListener('sync', function(event) {
   event.waitUntil(
      caches.open(CACHE_FAILURES)
       .then(cache => {return cache.keys()})
       .then(function(failedRequests) {
          return requests.map(function(failedRequest) {
             var realRequest = fakeRequest(failedRequest);
             return fetch(realRequest)
                    .then(function(response) {
                       clients.
                    });
          })

       })
       .then()
   )
})


funcion retry(request) {
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


function fakeRequest(request, newMethod) {
   var original = request;
   request = request.clone(); // save body
   return request.arrayBuffer()
     .then(function(bodyArrayBuffer) {
        var init = {
           method: request.realMethod || newMethod || 'GET',
           body: request.realBody,

           headers: request.headers,
           mode: request.mode,
           credentials: request.credentials,
           cache: request.cache,
           redirect: request.redirect,
           referrer: request.referrer,
           integrity: request.integrity,
        }
        var fake = new Request(request.url, init);
        fake.realMethod = request.method;
        fake.realBody = bodyArrayBuffer;
        return { original, fake }
     });
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
