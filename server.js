var express = require('express');
var conf = require('./conf');
var utils = require('./utils');
var marked = require('marked'); 
var fs = require('fs');
var Bluebird = require('bluebird');
Bluebird.promisifyAll(fs);
var port = process.env.PORT || 4000;

var app = express();

app.listen(port, function(){
  console.log('server listening on port '+ port);
});

app.set('views', './templates');
app.set('view engine', 'jade');
app.use('/css', express.static(__dirname + '/build/css'));
app.use('/js', express.static(__dirname + '/build/js'));

app.get('/', function(req, res){
  fs.readdirAsync(conf.articleSource)
    .then(utils.reverseDirList)
    .map(utils.parsePostInfo)
    .map(utils.getPostList)
    .then(utils.genPostIndex)
    .then(function(indexPage){
      res.send(indexPage);
    });
});

app.get('/english', function(req, res){
  fs.readdirAsync(conf.englishSource)
    .then(utils.reverseDirList)
    .map(utils.parseEnglishPostInfo)
    .map(utils.getEnglishPostList)
    .then(utils.genEnglishPostIndex)
    .then(function(indexPage){
      res.send(indexPage);
    });
});

app.get('/draft', function(req, res){
  fs.readdirAsync(conf.draftSource)
    .then(utils.reverseDirList)
    .map(utils.parseDraftPostInfo)
    .map(utils.getDraftPostList)
    .then(utils.genDraftPostIndex)
    .then(function(indexPage){
      res.send(indexPage);
    });
});

app.get('/posts/:post', function(req, res){
  var html = req.params.post;
  var titleArr = html.split('.')[0].split('-');
  var headTitle = conf.name + ' - ' + titleArr[3];
  var inPath = conf.articleSource + html.split('.')[0] + '.md';

  fs.readFileAsync(inPath, 'utf8')
    .then(marked)
    .then(function(content){
      res.render('Post',{
        source: '../', 
        title: headTitle,  
        content: content
      });
    });
});


app.get('/draft/:post', function(req, res){
  var html = req.params.post;
  var titleArr = html.split('.')[0].split('-');
  var headTitle = conf.name + ' - ' + titleArr[3];
  var inPath = conf.draftSource + html.split('.')[0] + '.md';

  fs.readFileAsync(inPath, 'utf8')
    .then(marked)
    .then(function(content){
      res.render('Post',{
        source: '../', 
        title: headTitle,  
        content: content
      });
    });
});

app.get('/english/:post', function(req, res){
  var html = req.params.post;
  var titleArr = html.split('.')[0].split('-');
  var headTitle = conf.name + ' - ' + titleArr[3];
  var inPath = conf.englishSource + html.split('.')[0] + '.md';

  fs.readFileAsync(inPath, 'utf8')
    .then(marked)
    .then(function(content){
      res.render('Post',{
        source: '../', 
        title: headTitle,  
        content: content
      });
    });
});
app.get('/pages/:page', function(req, res){
  var html = req.params.page;
  var title = html.split('.')[0];
  var headTitle = conf.name + ' - ' + title;
  var inPath = conf.pageSource + title + '.md';

  fs.readFileAsync(inPath, 'utf8')
    .then(marked)
    .then(function(content){
      res.render('Post',{
        source: '../', 
        title: headTitle,  
        content: content
      });
    });
});


/** Error Handling **/

//Undefined route we send the 404 not find error
app.use(function(req, res, next){
  var err = new Error('Not found');
  err.status = 404;
  next(err);
});

//(Must last!) handling 404 and 500 errors
app.use(function(err, req, res, next){
  if(err.status === 404) {
    res.status(404).send('Not Found');
  }
  if(err.status === 500) {
    console.log(err.stack);
    res.status(500).send('Something broke!');
  }
});
