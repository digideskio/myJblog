var jade = require('jade');
var conf = require('./conf');
var marked = require('marked'); 
var _ = require('lodash');
var yaml = require('js-yaml');  
var fs = require('fs');
var Bluebird = require('bluebird');
Bluebird.promisifyAll(fs);

var postFn = jade.compileFile('./templates/Post.jade', {pretty:false,debug:true});
var indexFn = jade.compileFile('./templates/Index.jade', {pretty:false,debug:true});

marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});


//將最新的file排在最前面
function reverseDirList(list){
  return _(list).reverse().value();
}

//解析source markdown fileiname的資訊
function parseInfo(fileName){
  var titleArr= fileName.split('.')[0].split('-');
  var postDate = titleArr[0] +'-'+ titleArr[1] +'-'+ titleArr[2];   
  return {
    fileName: fileName,
    headTitle: conf.name + ' - ' + titleArr[3],
    postDate: postDate,
    inPath: conf.articleSource + fileName,
    //注意, 目前只收 2014-11-02-nodejs_test.md, 不能收 2014-11-02-nodejs-test.md
    outPath: conf.buildto + 'posts/'+ postDate + '-' + titleArr[3] + '.html',
    content: fs.readFileAsync(conf.articleSource + fileName, 'utf8')
  };
}

function markdownToHtml(md){
  var postFn = jade.compileFile('./templates/Post.jade', {pretty:false,debug:true});
  md.content
    .then(marked)
    .then(function(data){
      return postFn({
        source: '../', 
        title: md.headTitle, 
        content: data
      });  
    })
    .then(fs.writeFileAsync.bind(fs, md.outPath))
    .done(function(){
      console.log('[done] ' + md.fileName  + ' --> ' + md.outPath );
    });
}

fs.readdirAsync(conf.articleSource)
  .then(reverseDirList)
  .map(parseInfo)
  .each(markdownToHtml);


