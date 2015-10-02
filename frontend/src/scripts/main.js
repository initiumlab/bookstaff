var bookstaffMain = (function(window, document){
  "use strict";

  // Check innerText

  var div = document.createElement('div');
  if (typeof div.innerText !== 'string') {
    alert('您的瀏覽器不支持校書郎目前必須的功能(innerText),請換一個瀏覽器再試.')
  };

  var previousPopup = null;

  function postSimpAndUpdate(content, targetDOMNode) {
    var url = "//104.236.146.235";
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

        // The character has one-to-multiple mapping relationship and is suspicious of mistakes
        if (multipleMappingLocations.indexOf(i) !== -1) {
          var detailedClass = 'suspicious-' + content[i];
          targetHTML += '<span class="suspicious ' + detailedClass + '">' + tradText[i] + '</span>';

        // It's a newline
        } else if (tradText[i].charCodeAt(0) === 10) {
          targetHTML += '<br>';

        } else {
          targetHTML += '<span>' + tradText[i] + '</span>';
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

            spanTradChar.addEventListener('click', function(spanInText) {
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
          btnConfirm.addEventListener('click', function(spanInFocus){
            return function(){
              previousPopup.style.display = 'none';
              spanInFocus.classList.remove('suspicious');
            }
          }(spanInText));
          divPopup.appendChild(btnConfirm);

          // Hide the previous popup when the next one is activated
          if (previousPopup) {
            previousPopup.style.display = 'none';
          }
          // Prevent the click listener on body to hear it, which causes the popup to be closed immediately
          event.stopPropagation();
          previousPopup = divPopup;
        };
      }

      // Add popup event-binding
      var suspiciousSpans = document.getElementsByClassName('suspicious');
      var span;
      for (i = 0; i < suspiciousSpans.length; i += 1) {
        span = suspiciousSpans[i];
        span.addEventListener('click', getPopupCallBack(span));
      }

    };
    req.send(content);
  }

  function postTradAndUpdate(content, targetDOMNode) {
    var url = "//104.236.146.235";
    var req = new XMLHttpRequest;
    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'text/plain; charset=UTF-8');
    req.onload = function() {

      var response = JSON.parse(req.responseText);
      console.log(response);
      var i;
      var targetHTML = '';

      var multipleMappingLocations = response.locationWithNotes.map(function(entry) {
        return entry.location
      });

      // Add the text back
      var simpText = response.simpText;
      for (i = 0; i < simpText.length; i += 1) {

        // It's a newline
        if (simpText[i].charCodeAt(0) === 10) {
          targetHTML += '<br>';

        } else {
          targetHTML += '<span>' + simpText[i] + '</span>';
        }
      }

      targetDOMNode.innerHTML = targetHTML;

    }

    req.send('[[SIMP]]' + content);

  }

  // Config text area
  var divText = document.getElementById('text');
  var firstClick = true;
  divText.addEventListener('click', function(event){
    if (firstClick) {
      event.target.innerHTML = '';
      firstClick = false;
    }
  });

  // Remove format from paste
  divText.addEventListener('paste', function(event){
    event.preventDefault();
    divText.innerText = event.clipboardData.getData('text');
  });

  // Remove format when copying
  divText.addEventListener('copy', function(event){
    event.preventDefault();
    event.clipboardData.setData('text/plain', divText.innerText);
  });

  // Config post button
  var btnTraditionalize = document.getElementById('btnTraditionalize');
  btnTraditionalize.addEventListener('click', function(){
    firstClick = false;
    postSimpAndUpdate(text.innerText, divText);
  });

  var btnSimplify = document.getElementById('btnSimplify');
  btnSimplify.addEventListener('click', function(){
    firstClick = false;
    postTradAndUpdate(text.innerText, divText);
  });

  // Click anywhere to close an opened popup
  document.body.addEventListener('click', function(event) {

    if (!event.target.classList.contains('hintPopup')) {

      // A non-popup is clicked, hide the previous popup
      if (previousPopup !== null) {
        previousPopup.style.display = 'none';
      }

    }

  });


  // Add functionality for clear all button

  var btnClearAll = document.getElementById('clearAll');
  btnClearAll.addEventListener('click', function() {

    var suspiciousSpans = document.getElementsByClassName('suspicious');
    var i, span;
    console.log(suspiciousSpans);

    for (i = 0; i < suspiciousSpans.length; i += 1) {
      span = suspiciousSpans[i];
      span.style.backgroundColor = 'white';
      span.style.padding = '0';
      span.style.fontWeight = 'inherit';
    }

  });

}(window, window.document));