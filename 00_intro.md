
## Why?  (some quotes)

 > Service Worker is a part of [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/)– ...means for
 > making websites accessible, functional… and annoying when not
 > used properly (I’m talking to you, Web Push Notifications).

<br>

 > The best thing about Service Worker is that it enables you to
 > cache static HTML documents, assets ... your website can be
 > available to the user who has no Internet connection or if
 > your server went down.

#### Benefits
 - Make the website function while offline
 - Speed performance even when online by reducing network requests
 - Customize offline experience
 - Google Lighthouse likes you.

## Why Not?
 - Browser support is inconsistent, see [Is Serviceworker Ready?](https://jakearchibald.github.io/isserviceworkerready/)
   - Chrome and Firefox have best support including debugging (with some stale log issues)
   - Opera supports debugging in experimental developer mode
   - Safari and Edge are "in development" (Edge 16+)
 - Unit Testing tools still bleeding edge: [npm sw-test-env](https://www.npmjs.com/package/sw-test-env)
 - Some limited development libraries on GitHub, Google...
 - Soma APIs, like Sync, are poorly supported.
 - You can mess up and create [Zombie Service Workers](https://www.youtube.com/watch?v=CPP9ew4Co0M)

### Other parts of a "Progressive Web App"
 - https
 - web app manifest.json file, for Add to Homescreen (a.k.a. "A2HS")
 - responsive design ("mobile-friendly")
 - add og: and twitter: meta-data
 - inform user when they are offline

Use [Lighthouse](https://developers.google.com/web/tools/lighthouse/) to test most of this stuff

## Gory Details
 - **Must use https**, or, for testing, localhost
 - Uses "self" instead of "this".  Not sure why???
 - Service Workers run in a different thread and context from their pages, ["ServiceWorkerGlobalScope"](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope), and must _not block_ => asynchronously (Promises).  They _cannot access_
    - DOM elements (you could access the raw body and parse it)
    - JavaScript variables in the main thread
    - localStorage   
 - Service Workers _can_ access
    - [indexedDB](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/indexedDB)
    - [location](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/location)
    - [navigator](https://developer.mozilla.org/en-US/docs/Web/API/WorkerNavigator)
    - [caches](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage) sandboxed to your origin.
 - They may load other JS libraries via [importScripts( )](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts).  Check out [sw-toolbox](https://github.com/GoogleChromeLabs/sw-toolbox)
 - Original client page and SW must be on same origin and on HTTPS (or localhost)
    - but any request _originated_ from that page can be intercepted
    - subdomains make a mess
 - A Service Worker usually has "scope" over the base location _of the script_.  So you usually place one in the top level.
    - only one active Service Worker per folder
    - but may have separate ones for subfolders.  see 01_multipleSWs


## Lifecycle

### install
Fired once when a ServiceWorker is first fetched, or browser detects a change in the code.
(or Developer Tools > Application > Service Workers, check "Update on reload")
Since you know you are online here, install usually downloads and caches vital files.
Normally, the new SW will enter a "waiting" state, until the previous SW is idle (all it's clients/pages are closed).

#### Gotchas / Ideas
 - May want a "cache-buster" dummy query to avoid browser cacheing.  (see SW_02.js)
 - install SW during some idle time... onLoad()?
 - instead of hardcoding filenames to install, GET a json file?  [Example Code](https://serviceworke.rs/json-cache.html)
 - It's safe/required to use Promises and ES6 in the ServiceWorker.  Don't use them for the registerSW.js code.
 - Always(?) install a nice "/offline.html" page.
 - Split into "critical" and "nice to haves"?  (in separate caches?)
 - Periodically clean out old or lesser used cache - send a message?
 - Periodically "phone home" to look for updates or kill switches?
 - In theory you can use async await instead of Promises but these seem to be many gotchas right now.
 - Smartly "recycle" assets between caches when upgrading???
 - postMessage API is "weird", consider a library like Swivel
 - beware renaming the SW file since the _index.html may be cached._  Set short cache-control headers for it.
 - Put explicit timestamp or version number in SW to ensure reinstall.


### activate
Fired when first activated, _or if getting reactivated after "swapping out" from not in use_.
 - Typically you delete any of your caches no longer needed.  
 - You cannot rely on global state to persist across activations, use indexedDB (painful).

**Note** To force the new ServiceWorker to take effect immediately, your install handler should call [`self.skipWaiting()`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting) and your activate handler should call [`clients.claim()`](https://developer.mozilla.org/en-US/docs/Web/API/Clients/claim).  Usually a bad idea.

### fetch
Fired when website tries to fetch a resource.  Default is to use `fetch()`.  This is where a lot of your magic happens, see examples...

### message
Used for messaging.  
 - It's not clear if you can send messages to your web pages and let them manipulate DOM.


## You will use fetch() a lot.  Gotchas:

 - by default, it provides no credentials such as cookies.
 - CORS is an issue (I don't fully understand)
 - the [response](https://developer.mozilla.org/en-US/docs/Web/API/Response) might have a status !== 200, check response.ok!
 - checking the details and headers of the [Request is possible if tedious](https://developer.mozilla.org/en-US/docs/Web/API/Request).
 - [setting the cache mode](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) to avoid browser caching isn't implemented yet on Chrome.
 - you can add multiple fetch listeners, for example, to handle different MIME types.

## References

 - [Video about Zombie Service Workers](https://www.youtube.com/watch?v=CPP9ew4Co0M)
 - [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers/)
 - [is Serviceworker Ready](https://jakearchibald.github.io/isserviceworkerready/resources.html)
 - [The offline cookbook (2014)](https://jakearchibald.com/2014/offline-cookbook/)
     - [Templating idea](https://jakearchibald.com/2014/offline-cookbook/#serviceworker-side-templating)
 - [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
     - [Using Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)
     - [Tagged links](https://developer.mozilla.org/en-US/docs/tag/ServiceWorker)
 - [Service Worker gotchas](https://www.kollegorna.se/en/2017/06/service-worker-gotchas/)
 - [Making A Service Worker: A Case Study](https://www.smashingmagazine.com/2016/02/making-a-service-worker/)
 - [awesome-service-workers](https://github.com/TalAter/awesome-service-workers)
 - [awesome-progressive-web-apps](https://github.com/TalAter/awesome-progressive-web-apps)
 - [Taking the web offline with service workers](https://mobiforge.com/design-development/taking-web-offline-service-workers)
 - [Introduction to Progressive Web Apps (part 3)](https://auth0.com/blog/introduction-to-progressive-web-apps-push-notifications-part-3/)
