function registerServiceWorker(path, noisy) {
   if (path && ('serviceWorker' in navigator)) {
      navigator.serviceWorker.register(path).then(function(registration) {
        if (noisy) console.log('ServiceWorker ' + path + ' registered with scope: ', registration.scope);
      }).catch(function(err) {
         console.log('ServiceWorker ' + path + ' registration failed: ' + err);
      });
   };
}
