const EXERCISE_NAME = "SW_03";
const FOLDER_NAME = "";
const MY_NAME = EXERCISE_NAME + FOLDER_NAME;
const VERSION = "_V1";
const CACHE_NAME = MY_NAME + VERSION;

/** Global variables and code are very unusual, test */
var someGlobal = " someGlobal" + CACHE_NAME;


const INITIAL_CACHE = [
   "/index.html",
   "/help.html",   // deliberately leave out more.html
   "/",
   "/folderA/indexA.html"  // and folderB
];



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
               if (!cacheName.endsWith(VERSION)) {
                  return caches.delete(cacheName);
               }
            })
          );
       })
   );
});



self.addEventListener('fetch', function(event) {
   if (shouldHandleFetch(event)) {   
      event.respondWith(cacheFirstThenNetwork(event, true));
      //event.respondWith(networkFirstThenCache(event, true));
   }
});



function cacheFirstThenNetwork(event, andUpdateCache) {
   return caches.match(event.request)
      .then (function(response) {
         if (response) {
            console.log(MY_NAME + ': fetch event ' + event.request.url + ' from cache');
            return response;
         }

         var clonedRequest = event.request.clone();
         console.log(MY_NAME + ': fetch event ' + event.request.url + ' from network');
         return fetch(clonedRequest).then(
            function(response) {
               if (andUpdateCache)
                  updateCache(clonedRequest, response.clone());

               return response;
            }
         );
      })
}


function networkFirstThenCache(event, andUpdateCache) {
   return fetch(event.request)
      .then (function(response) {
         // really should check for 404??? 
         console.log(MY_NAME + ': fetch event ' + event.request.url + ' from network');
         if (andUpdateCache)
            updateCache(event.request, response.clone());
         return response;
      })

   .catch(function () {
      var clonedRequest = event.request.clone();
      console.log(MY_NAME + ': fetch event ' + event.request.url + ' from cache');
      return caches.match(clonedRequest).then(
         function(response) {
            return response;
         }
      );
   });
}



function updateCache(request, response) {
   if (shouldCacheThis(request, response)) {
      caches.open(CACHE_NAME)
         .then(function(cache) {
            console.log(MY_NAME + ': updated cache for ' + request.url);
            cache.put(request, response);
         });
   }
}

// this can get messy and varies by your application
function shouldCacheThis(request, response) {
   return (request.method === 'GET') &&
   response.ok)                          // only status 200-299   Some online example code also checks for null
   (response.type === 'basic')           // don't cache other sites (cors)
   
   /* other types of things you might want to check
   (response.headers.get('Content-Type') === 'whatever')
   response.url.endsWith('.html)
   !response.redirected;
   location.origin === response.url.origin   // another way to check cross site stuff...
   */
}


// this can also get messy and varies by your application
function shouldHandleFetch(event) {
   return (event.request.method === 'GET');
   
   /* more possibilities
      new URL(event.request.url).origin === self.location.origin
      request.mode === 'origin'
      request.headers.get('Accept') === 'whatever'
   */
}
