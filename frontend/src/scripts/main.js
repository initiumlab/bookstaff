var bookstaffMain = (function(window, document){
  "use strict";

  function postAndUpdate(content, targetDOMNode) {
    //var url = "//104.236.146.235";
    var url="https://249b92b5.ngrok.io";
    var req = new XMLHttpRequest;
    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'text/plain; charset=UTF-8');
    req.onload = function () {
      var response = JSON.parse(req.responseText);
      var i;
      var targetHTML = '';

      var multipleMappingLocations = response.locationWithNotes.map(function(entry){
        return entry.location
      });

      // Add the text back
      var tradText = response.tradText;
      for (i = 0; i < tradText.length; i += 1) {
        if (multipleMappingLocations.indexOf(i) !== -1) {
          var detailedClass = 'suspicious-' + content[i];
          targetHTML += '<span class="suspicious ' + detailedClass + '">' + tradText[i] + '</span>';
        } else {
          targetHTML += tradText[i];
        }
      }

      targetDOMNode.innerHTML = targetHTML;

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

  // Config post button
  var btnPost = document.getElementById('btnPost');
  btnPost.addEventListener('click', function(){
    firstClick = false;
    postAndUpdate(text.innerText, divText);
  })

}(window, window.document));