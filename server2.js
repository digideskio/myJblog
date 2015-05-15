var express = require('express');
var app = express();

var logger = function(req, res, next){
  console.log(new Date(), req.method, req.url);
  next();
};

var hello = function(req, res, next){
  res.write('Hello \n');
  next();
};

var bye = function(req, res, next){
  res.write('Bye \n');
  res.end();
};


app.listen(8000, function(){
  console.log('server listening on port 8000');
});

app.use(logger);
app.get('/hello', hello, bye);
