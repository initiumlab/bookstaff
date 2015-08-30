var bookstaffMain = (function(window, document){
  "use strict";

  function ajaxPost(content) {
    //var url = "//104.236.146.235";
    var url="https://249b92b5.ngrok.io";
    var req = new XMLHttpRequest;
    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'text/plain; charset=UTF-8');
    req.onload = function () {
      console.log('response=('+req.responseText+')');
    };
    req.send(content);
  }

  // Config text area
  var divText = document.getElementById('text');
  var firstClick = true;
  divText.addEventListener('mousedown', function(event){
    if (firstClick) {
      event.target.innerHTML = '';
      firstClick = false;
    }
  });

  var btnPost = document.getElementById('btnPost');
  btnPost.addEventListener('click', function(){
    ajaxPost(text.innerText);
  })

}(window, window.document));