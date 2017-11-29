
## Why?

 > Service Worker is a part of [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps/)– ...means for
 > making websites accessible, functional… and annoying when not
 > used properly (I’m talking to you, Web Push Notifications).

<br>

 > The best thing about Service Worker is that it enables you to
 > cache static HTML documents, assets ... your website can be
 > available to the user who has no Internet connection or if
 > your server went down.

### Other parts of a "Progressive Web App"
 - https
 - web app manifest json file, for Add to Homescreen (a.k.a. "A2HS")
 - responsive design ("mobile-friendly")
 - add og: and twitter: meta-data
 - inform user when they are offline

Use [Lighthouse](https://developers.google.com/web/tools/lighthouse/) to test most if this stuff

## Gory Details
 - Service Workers run in a different context, ["ServiceWorkerGlobalScope"](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope), and all asynchronously (Promises), so they cannot access
    - DOM elements (you could access the raw body and parse it)
    - JavaScript variables in the main thread
    - localStorage   
 - Service Workers _can_ access
    - [indexedDB](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/indexedDB)
    - [location](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/location)
    - [navigator](https://developer.mozilla.org/en-US/docs/Web/API/WorkerNavigator)
    - [caches](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage) sandboxed to your origin.
 - They may load other JS libraries via [importScipts( )](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts).  Check out [sw-toolbox](https://github.com/GoogleChromeLabs/sw-toolbox)
 - Client page and SW must be on same origin and on HTTPS (or localhost)
    - but any request _originated_ at that page can be intercepted
    - subdomains make a mess
 - A Service Worker usually has "scope" over the base location _of the script_.  So you usually place one in the top level.
    - only one Service Worker per folder
    - but may have separate ones for subfolders.  see 01_multipleSWs


## Lifecycle

### install
Fired once when a ServiceWorker is first fetched, or browser detects a change in the code.  
(or Developer Tools > Application > Service Workers, check "Update on reload")
Since you know you are online here, install usually downloads and caches vital files.
Normally, the new SW will enter a "waiting" state, until the previous SW is idle (all it's clients/pages are closed).

#### Gotchas / Ideas
 - May want a "cache-buster" dummy query to avoid browser cacheing.
 - install SW during some idle time... onLoad()?
 - instead of hardcoding filenames to install, GET a json file.
 - Though it's safe/required to use Promises and ES6 in the ServiceWorker, don't use it for the registerSW.js code.
 - Always(?) install a nice "/offline.html" page.
 - Split into "critical" and "nice to haves"?
 - May want to periodically clean out old or lesser used cache - send a message?

### activate
Fired when first activated, _or if getting reactivated when not in use_.
Typically you delete any of your caches no longer needed.  You cannot rely on global state to persist
across activations, but can use indexedDB to preserve state.

**Note** To force the new ServiceWorker to take effect immediately, your install handler should call [`self.skipWaiting()`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting) and your activate handler should call [`clients.claim()`](https://developer.mozilla.org/en-US/docs/Web/API/Clients/claim).

### fetch
Fired when website tries to fetch a resource.  Default is to use `fetch()`.  This is where a lot of your magic happens

### message
Used for messaging.  
 - It's not clear if you can send messages to your web pages and let them manipulate DOM.

## You will use fetch() a lot.  Gotchas:

 - by default, provides no credentials such as cookies.
 - CORS is an issue (I don't fully understand)
 - the [response](https://developer.mozilla.org/en-US/docs/Web/API/Response) might have a status !== 200, check it!
 - checking the details and headers of the [Request is possible if tedious](https://developer.mozilla.org/en-US/docs/Web/API/Request).
 - [setting the cache mode](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) to avoid browser caching isn't implemented yet on Chrome.
 - you can add multiple fetch listeners, for example, to handle different MIME types.

## References

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
