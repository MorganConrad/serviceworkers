# Lesson 3: Multiple Listeners

In this lesson, we attach multiple listeners to the "fetch" event.

Line 54 we add a dummyHandler(), which doesn't event.respondWith() anything.  The event passes on to any other handlers.

Line 60 we add the realHandler().

In the console, you will see that doNothing() got called, followed by the real handler.

<pre>
doNothing() fetch listener called for http://127.0.0.1:8080/folderA/indexA.html
serviceworker.js:74 V1: fetch event http://127.0.0.1:8080/folderA/indexA.html from cache
</pre>

If you cut/paste the code so that realHandler() is added first, dummyHandler() never gets called.

If only dummyHandler is added, the event falls through to the default handler, which is fetch(event.request).


Failed to load http://flyingspaniel.com/echo.php: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://127.0.0.1:8080' is therefore not allowed access. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
