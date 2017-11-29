# Example 4: Templating

In this example, we show some other neat tricks for a Service Worker.
After fetching data, it does some (very simplistic) templating.  In a real
system one would use Pug, Handlebars, or whatever...

See SW_04.js

You don't have direct access to the DOM of the response, but you can access the text.  
You could parse the text if you really wanted a DOM-like structure.
Instead, we simply do a basic `String.replace()` on it, so that various console logging messages will appear on the web pages.
