# Example 2: Multiple Listeners

In this example, we have only one Service Worker, but we attach multiple listeners to the "fetch" event.

See SW_02.js

Line 53 we add a doNothing(), which doesn't event.respondWith() anything.  The event passes on to any other handlers.

Line 60 we add the realHandler().  It just fetches from the network.

In the console, you will see that doNothing() got called, followed by the real handler.

<pre>
SW_02: doNothing() fetch listener called for http://127.0.0.1:8080/...
SW_02: realHandler() fetch listener called for http://127.0.0.1:8080/...
</pre>

Edit SW_02.js by cut/paste the code so that `realHandler()` is added first.  
Since `realHandler()` does respond to `event.respondWith()`, `doNothing()` never gets called.

If you edit so that only `doNothing()` is added, the event falls through to the system default handler, which is `fetch(event.request)`.

### Notes on install() and INITIAL_CACHE

 1. In some cases you end up fighting the browser's cache, and not downloading the latest versions.
 You might want to add a "cache-busting" query to the urls, such as a version number or the current time.  e.g. `/index.html?v=3.2.1`.

 2. Unfortunately, you cannot code with globs or wildcards.  That is, you cannot go:

  `INITIAL_CACHE = ['*.html', '/css/*.css'];`

  If you dislike all the typing, plus the necessity/flakiness to constantly updating this list, another strategy is to
  GET the list from the server (say, in JSON format), then create the initial array from that.
