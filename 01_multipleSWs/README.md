# Exercise 1: Multiple Service Workers

In this exercise, we attach multiple service workers: one per folder, "/", "blog" and "users".
We actually register different SWs for index.html and html.html (unusual)

 - In the Developer Tools -> Application -> Service Workers, you will (eventually) see three of them running.
 - As you toggle between index.html and help.html, the SWs will swap.
    - In a real application this would be **extremely** unusual.  Stick with one per level.
 - In the Developer Tools -> Console, you will see that only the Service Worker relevant to that folder is called for the `fetch()` event.

### Run it
 - Start your own Apache or Nginx on the WWW folder
 - Launch serve or serve.bat (if you have [http-server](https://www.npmjs.com/package/http-server) installed)
 - [Open on GitHub Pages](https://morganconrad.github.io/serviceworkers/01_multipleSWs/www/index.html)
