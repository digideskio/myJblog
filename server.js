var express = require('express');
var conf = require('./conf');
var marked = require('marked'); 
var _ = require('lodash');
var fs = require('fs');
var Promise = require('bluebird');
Promise.promisifyAll(fs);

var app = express();

app.listen(3000, function(){
  console.log('server listening on port 3000');
});

app.set('views', './templates');
app.set('view engine', 'jade');
app.use('/css', express.static(__dirname + '/build/css'));

app.get('/', function(req, res){
  fs.readdirAsync(conf.articleSource)
    .then(function(lists){
      return _(lists).reverse().value();
    })
    .map(function(md){
      var titleArr = md.split('.')[0].split('-');
      var postDate = titleArr[0] +'-'+ titleArr[1] +'-'+ titleArr[2];   
      return fs.readFileAsync(conf.articleSource + md, 'utf8')
        .then(function(content){
          return {
            link:  '/posts/' + md.split('.')[0] + '.html',
            title: content.split('\n')[0], //像是:  # 標題  
            date: postDate
          };
        });
    })
    .then(function(lists){
      //console.log('lists: '+ JSON.stringify(lists));
      res.render('Index',{source: './', title: "Cho-Ching's Blog", lists: lists});
    });
});

app.get('/posts/:post', function(req, res){
  var html = req.params.post;

  var titleArr = html.split('.')[0].split('-');
  var headTitle = "Cho-Ching's Blog - " + titleArr[3];
  var inPath = conf.articleSource + html.split('.')[0] + '.md';

  fs.readFile(inPath, 'utf8', function(err, doc){
    if (err) res.send('show post error!');
    res.render('Post',{source: '../', title: headTitle,  content: marked(doc)});
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
