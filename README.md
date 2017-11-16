[![License](http://img.shields.io/badge/license-MIT-A31F34.svg)](https://github.com/MorganConrad/serviceworkers)

# Exercises in Service Workers


## 01: Hook up multiple service workers.  

One serviceworker for 
 - index.html
 - help.html
 - blog/
 - users/

In the console, you will see the workers get registered, then log messages when they get called for a fetch.

Because two different workers try to control the root directory, they swap back and forth.  This is probably a bug in real code.

In the other exercises, only a single service worker gets registered, at the root level.

[Try It Yourself](http://morganconrad.github.io/serviceworkers/01_multipleSWs/index.html)




## 02: Attach multiple listeners to the fetch event

One listener, named `doNothing()`, just logs.  Since it doesn't `event.respondTo()`, processing continues.

The second listener, `realHandler()`, responds by calling the normal fetch method, ending the listener chain.

Try swapping the order, putting `realHandler` first, and see if `doNothing` gets called.

[Try It Yourself](http://morganconrad.github.io/serviceworkers/02_multipleListeners/index.html)



## 03: A vaguely realistic fetch listener

This example responds with either cached results, or responses from the network.

[Try It Yourself](http://morganconrad.github.io/serviceworkers/03_fetch/index.html)



## 04: More fun stuff to do with Fetch - Templating

Illustrates how you could modify the response.  For example, fetching some JSON data to use in a template engine like Handlebars.

[Try It Yourself](http://morganconrad.github.io/serviceworkers/04_templating/index.html)




## More Ideas for Interesting uses of Service Workers

 - Use user's location to switch to a geographically closer server.
 - Load Balancing
 - Analytics
 