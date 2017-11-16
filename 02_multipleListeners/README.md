# Example 2: Multiple Listeners

In this example, we have only one Service Worker, but we attach multiple listeners to the "fetch" event.

See SW_02.js

Line 53 we add a doNothing(), which doesn't event.respondWith() anything.  The event passes on to any other handlers.

Line 59 we add the realHandler().  It just fetches from the network.

In the console, you will see that doNothing() got called, followed by the real handler.

<pre>
SW_02: doNothing() fetch listener called for http://127.0.0.1:8080/...
SW_02: realHandler() fetch listener called for http://127.0.0.1:8080/...
</pre>

Edit SW_02.js by cut/paste the code so that `realHandler()` is added first.  
Since `realHandler()` does response to `event.respondWith()`, `doNothing()` never gets called.

If only `doNothing()` is added, the event falls through to the system default handler, which is `fetch(event.request)`.
