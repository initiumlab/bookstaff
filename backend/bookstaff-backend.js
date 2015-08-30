(function(){
  "use strict";
  var express = require('express');
  var app = express();
  var bodyParser = require('body-parser');

  app.use(bodyParser.text({defaultCharset: 'utf-8'}));

  app.post('/',function(request, response){
    "use strict";
    response.end('Received request: '+ request.body);
  });

  var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
  });
}());
