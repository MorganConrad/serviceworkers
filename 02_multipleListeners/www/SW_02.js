const EXERCISE_NAME = "SW_02";
const FOLDER_NAME = "";
const MY_NAME = EXERCISE_NAME + FOLDER_NAME;
const VERSION = "_V1";
const CACHE_NAME = MY_NAME + VERSION;

/** Global variables and code are very unusual, test */
var someGlobal = "";


const INITIAL_CACHE = [
   "/index.html",
   "/help.html",
   "/",
   "/folderA/indexA.html",
   "/folderB/indexB.html"
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



// first, attach a "do nothing" handler
// try moving this after the real one 
self.addEventListener('fetch', function doNothing(event) {
   console.log(MY_NAME + ': doNothing() fetch listener called for ' + event.request.url);
   return;  // we aren't handling it
});

// then add a "real" event handler (that just fetches from network...)
self.addEventListener('fetch', function realHandler(event) {
      console.log(MY_NAME + ': realHandler() fetch listener called for ' + event.request.url);
      event.respondWith(fetch(event.request));  // just fetch from network...
});
