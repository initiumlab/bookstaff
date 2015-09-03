(function(){
  "use strict";
  var express = require('express');
  var app = express();
  var bodyParser = require('body-parser');
  var fs = require('fs');

  var hansToHantMultipleMapping = JSON.parse(fs.readFileSync('multiple-mapping-HansToHant.json', 'utf-8'));
  var suspiciousCharacters = (function (){
    var i, result=[];
    for (i in hansToHantMultipleMapping) if (hansToHantMultipleMapping.hasOwnProperty(i)) {
      result.push(hansToHantMultipleMapping[i]['hansChar']);
    }
    return result;
  }());
  var OpenCC = require('opencc');
  var opencc = new OpenCC('s2hk.json');
  var initium_fix = JSON.parse(fs.readFileSync('initium_fix.json', 'utf-8'));

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use(bodyParser.text({defaultCharset: 'utf-8'}));

  app.post('/',function(request, response, next){
    "use strict";

    function calcDiffLocations(s1, s2) {
      var i;
      var result = [];
      for (i = 0; i < s1.length; i += 1) {
        if (s1[i] !== s2[i]) {
          result.push(i);
        }
      }
      return result;
    }

    function getEntryFromMapping(charSimp, mapping) {
      var i;
      for (i in mapping) if (mapping.hasOwnProperty(i)) {
        if (charSimp === mapping[i]["hansChar"]) {
          return mapping[i];
        }
      }
    }

    function getLocationWithNotes(simpText, diffLocations) {
      var i, result=[];
      for (i = 0; i < simpText.length; i += 1) {
        if (suspiciousCharacters.indexOf(simpText[i]) !== -1) {
          result.push({
            note: getEntryFromMapping(simpText[i], hansToHantMultipleMapping),
            location: i
          })
        }
      }
      return result;
    }

    function applyInitiumFix(text) {
      var i, fix, re_fixFrom;
      var result = text;
      for (i = 0; i < initium_fix.length; i += 1) {
        fix = initium_fix[i];
        re_fixFrom = new RegExp(fix.from, 'g');
        result = result.replace(re_fixFrom, fix.to);
      }
      console.log('initium fix applied');
      return result;
    }

    response.setHeader('Content-Type', 'application/json');
    var content = {};

    var simpText = request.body;
    console.log('simpText='+simpText);
    var tradText = opencc.convertSync(simpText);
    console.log('tradText='+tradText);
    content.tradText = applyInitiumFix(tradText);
    console.log('after initum fix=', content.tradText);
    
    content.diffLocations = calcDiffLocations(simpText, tradText);

    content.locationWithNotes = getLocationWithNotes(simpText, content.diffLocations);

    response.end(JSON.stringify(content));
  });

  var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
  });
}());
