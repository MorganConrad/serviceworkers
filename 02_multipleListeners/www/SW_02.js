const EXERCISE_NAME = "SW_02";
const FOLDER_NAME = "";
const MY_NAME = EXERCISE_NAME + FOLDER_NAME;
const VERSION = "_V1";
const CACHE_NAME = MY_NAME + VERSION;

/** Global variables and code are very unusual, test */
var someGlobal = "";


const INITIAL_CACHE = [
  "index.html",
  "help.html",
  "blog/PlayTheAcceleratedDragon.html",
  "users/HouYifan.html"
];


self.addEventListener('install', function(event) {
  someGlobal = someGlobal + " install";
  console.log(MY_NAME + ': install event' + someGlobal);

  // example "cache buster"
  let cacheBuster = "?cacheBuster=" + new Date().getTime();
  let updatedURLs = INITIAL_CACHE.map((url) => {return url+cacheBuster} );

  event.waitUntil(caches.open(CACHE_NAME)
    .then(function(cache) {
      return cache.addAll(updatedURLs);
    })
    /*
      Failure is not only an option, it is the best option
      Don't install a faulty ServiceWorker

    .catch(function(err) { console.log('install failed: ' + err)} )
    */
  );
});


self.addEventListener('activate', function(event) {
  someGlobal = someGlobal + " & activate";
  console.log(CACHE_NAME + ': activate event' + someGlobal);
  event.waitUntil(
    caches.keys()
    .then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (!cacheName.endsWith(VERSION)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
    // .catch((err) => console.log('activate failed: ' + err))
  );
});


// first, attach a "do nothing" handler
// try moving this after the real one
self.addEventListener('fetch', function doNothing(event) {
  console.log(MY_NAME + ': doNothing() fetch listener called for ' + event.request.url);
  return;  // we aren't handling it, no call to event.respondWith()
});


// then add a "real" event handler (that just fetches from network...)
self.addEventListener('fetch', function realHandler(event) {
  console.log(MY_NAME + ': realHandler() fetch listener called for ' + event.request.url);
  event.respondWith(fetch(event.request));  // just fetch from network...
});
