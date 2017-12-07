const EXERCISE_NAME = "SW_04";
const FOLDER_NAME = "";
const MY_NAME = EXERCISE_NAME + FOLDER_NAME;
const VERSION = "_V1";
const CACHE_NAME = MY_NAME + VERSION;

/** Global variables and code are very unusual, test */
var someGlobal = " someGlobal" + CACHE_NAME;
var debug = "";

const INITIAL_CACHE = [
  "index.html",
  "help.html",   // deliberately leave out more.html
  "blog/PlayTheAcceleratedDragon.html",
  "users/HouYifan.html"
];



self.addEventListener('install', function(event) {
  someGlobal = someGlobal + " install";
  console.log(MY_NAME + ': install event' + someGlobal);
  event.waitUntil(caches.open(CACHE_NAME)
    .then(function(cache) {
      return cache.addAll(INITIAL_CACHE);
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
    //.catch((err) => console.log('activate failed: ' + err))
  );
});



self.addEventListener('fetch', function(event) {
  event.respondWith(
    cacheFirstThenNetwork(event, true)
      .then(function(response) {

        // NEW STUFF: hack the response
        var init = {
          status: response.status,
          headers: response.headers
        };
        return response.text()
          .then(function(text) {
            var hacked = text.replace("{{debug}}", debug);
            return new Response(hacked, init);
          })
      })
  );
});


function cacheFirstThenNetwork(event, andUpdateCache) {
  return caches.match(event.request)
    .then(function (response) {
      if (response) {
        debugLog(MY_NAME + ': fetch from cache: ' + event.request.url);
        return response;
      }

      var clonedRequest = event.request.clone();
      debugLog(MY_NAME + ': fetch from network:' + event.request.url);
      return fetch(clonedRequest)
        .then(function (response) {
          return (andUpdateCache) ?
            updateCache(clonedRequest, response) :
            response;
        }
      );
  })
}


function networkFirstThenCache(event, andUpdateCache) {
  return fetch(event.request)
    .then (function(response) {
      if (response)
      debugLog(MY_NAME + ': fetch event ' + event.request.url + ' from network');
      return (andUpdateCache) ?
        updateCache(event.request, response) :
        response;
    })
    .catch(function () {
      var clonedRequest = event.request.clone();
      debugLog(MY_NAME + ': fetch event ' + event.request.url + ' from cache');
      return caches.match(clonedRequest)
        .then(function(response) {
          return response;
        }
      );
    });
}



function updateCache(request, response) {
  if (response && (response.status === 200)) {
    return caches.open(CACHE_NAME)
      .then(function(cache) {
        debugLog(MY_NAME + ': updated cache for ' + request.url);
        cache.put(request, response.clone());
        return response;
      });
  }
  else return response;
}


function debugLog(message, appendHere) {
  console.log(message);
  debug = debug + message + "\r\n    ";  // kludge
}



self.addEventListener('sync', function(event) {
   debugLog(MY_NAME + " sync event called " + JSON.stringify(event, 2));
})

self.addEventListener('push', function(event) {
   debugLog(MY_NAME + " push event called " + JSON.stringify(event, 2));
})
