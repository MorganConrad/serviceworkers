
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
                     //.catch(err => console.log('install failed: ' + err))
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


self.addEventListener('sync', function(event) {
   console.log(MY_NAME + " sync event called " + JSON.stringify(event, 2));
})

self.addEventListener('push', function(event) {
   console.log(MY_NAME + " push event called " + JSON.stringify(event, 2));
})
