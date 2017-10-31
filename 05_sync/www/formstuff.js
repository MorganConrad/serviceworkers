function doFetch(url, method, formID, textAreaID) {
   var formData = new FormData(document.getElementById(formID));
   fetch(url, {
      method: method,
      body: formData
   })
   .then(function(response) {
      return response.text();
   })
   .then(function (text) {
      if (textAreaID) {
         document.getElementById(textAreaID).value=text;
      }
      return text;
   });
}
