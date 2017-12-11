# Example 4: Templating

In this example, we show some other neat tricks for a Service Worker.
After fetching data, it does some (very simplistic) "templating".

See SW_04.js

You don't have direct access to the DOM of the response, but you can access the text.  
For our "templating", we just `String.replace()`, so that various console logging messages will appear on the web pages.

In a "real" example you would
 - cache the template
 - download a smallish set of data
 - Render using Pug, Handlebars, etc...

This example is setup for network first fetch, and also has primitive handling (just logging) of push and sync events...

### Run it
 - Start your own Apache or Nginx on the WWW folder
 - Launch serve or serve.bat (if you have [http-server](https://www.npmjs.com/package/http-server) installed)
 - [Open on GitHub Pages](https://morganconrad.github.io/serviceworkers/04_templating/www/index.html)
