var bookstaffMain = (function(window, document){
  "use strict";

  function postAndUpdate(content, targetDOMNode) {
    var url = "//104.236.146.235";
    //var url="https://249b92b5.ngrok.io";
    var req = new XMLHttpRequest;
    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'text/plain; charset=UTF-8');
    req.onload = function () {
      var response = JSON.parse(req.responseText);
      var i;
      var targetHTML = '';
      var previousPopup = null;

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

      // Add popups
      function getPopupCallBack(spanInText) {
        return function(event){
          var char = spanInText.innerText;
          var i, j, tradChar;

          // Insert the div
          var divPopup = document.createElement('div');
          divPopup.classList.add('hintPopup');
          divPopup.style.top = event.pageY + 15 + 'px';
          divPopup.style.left = event.pageX - 250 + 'px';

          document.body.appendChild(divPopup);

          // Create layout in the div

          // first line
          var characterBox = document.createElement('div');
          characterBox.id = 'characterBox';

          var divSimpChar = document.createElement('div');
          var divTradChars = document.createElement('div');
          var spanTradChar;
          var note;
          divSimpChar.id = 'divSimpChar';
          divTradChars.id = 'divTradChars';
          characterBox.appendChild(divSimpChar);
          characterBox.appendChild(divTradChars);

          divPopup.appendChild(characterBox);

          for (i = 0; i < response.locationWithNotes.length; i += 1) {
            if (response.locationWithNotes[i].note.hantChars.indexOf(char) !== -1) {
              note = response.locationWithNotes[i].note;
              break;
            }
          }

          divSimpChar.innerText = '簡化字：' + note.hansChar + '  |  傳統字：';

          // Add traditional Chinese characters

          for (i = 0; i < note.hantChars.split(' ').length; i += 1) {
            tradChar = note.hantChars.split(' ')[i];
            spanTradChar = document.createElement('span');
            spanTradChar.innerText = tradChar;
            spanTradChar.classList.add('spanTradChar');
            divTradChars.appendChild(spanTradChar);

            if (spanTradChar.innerText === spanInText.innerText) {
              spanTradChar.classList.add('spanTradChar-chosen');
            }

            spanTradChar.addEventListener('mousedown', function(spanInText) {
              return function(event) {
                spanInText.innerText = event.target.innerText;
                var allSpanTradChar = document.getElementsByClassName('spanTradChar');

                for (j = 0; j < allSpanTradChar.length; j += 1) {
                  allSpanTradChar[j].classList.remove('spanTradChar-chosen');
                }
                event.target.classList.add('spanTradChar-chosen');
              }
            }(spanInText))
          }

          // second line
          var explanation = document.createElement('div');
          explanation.innerText = "解釋：" + note.explanation;
          divPopup.appendChild(explanation);

          // third line
          var example = document.createElement('div');
          example.innerText = "用例：" + note.example;
          divPopup.appendChild(example);

          // fourth line
          var btnConfirm = document.createElement('button');
          btnConfirm.innerText = '確認修改';
          btnConfirm.id = 'btnConfirm';
          btnConfirm.addEventListener('mousedown', function(){
            previousPopup.style.display = 'none';
          });
          divPopup.appendChild(btnConfirm);

          // Hide the previous popup when the next one is activated
          if (previousPopup) {
            previousPopup.style.display = 'none';
          }
          previousPopup = divPopup;
        };
      }

      // Add popup event-binding
      var suspiciousSpans = document.getElementsByClassName('suspicious');
      var span;
      for (i = 0; i < suspiciousSpans.length; i += 1) {
        span = suspiciousSpans[i];
        span.addEventListener('mousedown', getPopupCallBack(span));
      }

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