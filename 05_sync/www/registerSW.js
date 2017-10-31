function registerServiceWorker(path) {
   if (path && ('serviceWorker' in navigator)) {
      navigator.serviceWorker.register(path)
        .then(registration => navigator.serviceWorker.ready)
        .then(registration => { // register sync
            registration.sync.register('submit')
            .then(() => { console.log('Sync registered'); })
         })
         .catch(err => { console.log('ServiceWorker ' + path + ' registration failed: ' + err) });
   }
   else console.log('not registered');

   registerMessage();
}


function registerMessage() {
   navigator.serviceWorker.addEventListener('message', function(event) {
      window.alert(event.data);
   });
}
