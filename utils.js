var jade = require('jade');
var marked = require('marked'); 
var _ = require('lodash');
var conf = require('./conf');
var fs = require('fs');
var Bluebird = require('bluebird');
Bluebird.promisifyAll(fs);

marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});

//將最新的file排在最前面
function reverseDirList(list){
  return _(list).reverse().value();
}


function parseInfo(fileName, source, dest){
  var titleArr= fileName.split('.')[0].split('-');
  var postDate = titleArr[0] +'-'+ titleArr[1] +'-'+ titleArr[2];   
  return {
    fileName: fileName,
    headTitle: conf.name + ' - ' + titleArr[3],
    postDate: postDate,
    inPath: source  + fileName,
    //注意, 目前只收 2014-11-02-nodejs_test.md, 不能收 2014-11-02-nodejs-test.md
    outPath: conf.buildto + dest + '/'+ postDate + '-' + titleArr[3] + '.html',
    content: fs.readFileAsync(source  + fileName, 'utf8')
  };
}

//解析source markdown fileiname的資訊
function parsePostInfo(fileName){
  return parseInfo(fileName, conf.articleSource, 'posts');
}

function parseEnglishPostInfo(fileName){
  return parseInfo(fileName, conf.englishSource, 'english');
}

function parsePageInfo(fileName){
  var title = fileName.split('.')[0];
  return {
    fileName: fileName,
    headTitle: conf.name + ' - ' + title,
    inPath: conf.pageSource + fileName,
    outPath: conf.buildto + 'pages/'+ title + '.html',
    content: fs.readFileAsync(conf.pageSource + fileName, 'utf8')
  };
}

function markdownToHtml(md){
  var postFn = jade.compileFile('./templates/Post.jade', {pretty:false,debug:true});
  return md.content
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

//取得每個文章,在index.html要顯示的條列資訊
function getList(md, dest){
  return md.content
    .then(function(data){
      return {
        link: '/' + dest + '/' + md.fileName.split('.')[0] + '.html',
        title: data.split('\n')[0], //像是:  # 標題  
        date: md.postDate
      };
    });
}

function getPostList(md){
  return getList(md, 'posts');
  /*
  return md.content
    .then(function(data){
      return {
        link: '/posts/' + md.fileName.split('.')[0] + '.html',
        title: data.split('\n')[0], //像是:  # 標題  
        date: md.postDate
      };
    });
  */
}

function getEnglishPostList(md){
  return getList(md, 'english');
}


//產生index.html
function genIndex(lists, css_source){
  var indexFn = jade.compileFile('./templates/Index.jade', {pretty:false,debug:true});
  return indexFn({
    source: css_source, 
    title: conf.name,
    lists: lists
  }); 
}

function genPostIndex(lists){
  return genIndex(lists, './');
}

function genEnglishPostIndex(lists){
  return genIndex(lists, '../');
}

module.exports = {
  reverseDirList: reverseDirList,
  parsePostInfo: parsePostInfo,
  parseEnglishPostInfo: parseEnglishPostInfo,
  parsePageInfo: parsePageInfo,
  markdownToHtml: markdownToHtml,
  getPostList: getPostList,
  getEnglishPostList: getEnglishPostList,
  genPostIndex: genPostIndex,
  genEnglishPostIndex: genEnglishPostIndex
};
