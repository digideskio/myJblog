var jade = require('jade');
var conf = require('./conf');
var marked = require('marked'); 
var _ = require('lodash');
var yaml = require('js-yaml');  
var fs = require('fs');
var Promise = require('bluebird');
Promise.promisifyAll(fs);

var postFn = jade.compileFile('./templates/Post.jade', {pretty:false,debug:true});
var indexFn = jade.compileFile('./templates/Index.jade', {pretty:false,debug:true});

marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});


fs.readdirAsync(conf.articleSource)
  .then(function(lists){
    return reversedLists = _(lists).reverse().value();
  })
  .each(function(md){
    var titleArr = md.split('.')[0].split('-');
    var headTitle = "Cho-Ching's Blog - " + titleArr[3];
    var postDate = titleArr[0] +'-'+ titleArr[1] +'-'+ titleArr[2];   

    var inPath = conf.articleSource + md;
    //注意, 目前只收 2014-11-02-nodejs_test.md, 不能收 2014-11-02-nodejs-test.md
    var outPath  = conf.buildto + 'posts/'+ postDate + '-' + titleArr[3] + '.html';

    var articleTitles= []; //給index.html生list用的

    fs.readFileAsync(inPath, 'utf8')
      .then(function(data){
        //var doc = yaml.safeLoad(data);
        //articleTitles.push(doc.title); //給index.html用的
        var lines = data.split('\n');

        //取得'---'所在行數
        //移除中間的行數
        var indices = [];
        var ymlMark = '---';
        var idx = lines.indexOf(ymlMark);
        while(idx != -1){
          indices.push(idx);
          idx = lines.indexOf(ymlMark, idx+1);
        }  

        var ymlInfo = [];
        for(var a = indices[0]; a <= indices[1]; a++){
          ymlInfo.push(lines[a]);
          delete lines[a];
        }

        //TODO: yaml 內容暫時沒有作用
        return {
          head: ymlInfo.join('\n'),
          content: lines.join('\n')
        };
      })
      .then(function(data){
        return postFn({source: '../', title: headTitle,  content: marked(data.content)});
      })
      .then(fs.writeFileAsync.bind(fs, outPath))
      .done(function(){
        console.log('[done] ' + md  + ' --> ' + outPath );
      });
      
  })
  //gen index.html
  .map(function(md){
    var titleArr = md.split('.')[0].split('-');
    var postDate = titleArr[0] +'-'+ titleArr[1] +'-'+ titleArr[2];   
    return fs.readFileAsync(conf.articleSource + md, 'utf8')
      .then(function(content){
        return {
          link: '/posts/' + md.split('.')[0] + '.html',
          title: content.split('\n')[0], //像是:  # 標題  
          date: postDate
        };
      });
  })
  .then(function(lists){
    //console.log('lists: '+ JSON.stringify(lists));
    return indexFn({source: './', title: "Cho-Ching's Blog", lists: lists});
  })
  .then(fs.writeFileAsync.bind(fs, conf.buildto + 'index.html'))
  .then(function(){
    console.log('[done] index.html created.');
  });
