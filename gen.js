var conf = require('./conf');
var utils = require('./utils');
var fs = require('fs');
var Bluebird = require('bluebird');
Bluebird.promisifyAll(fs);
var jade = require('jade');

fs.readdirAsync(conf.articleSource)
  .then(utils.reverseDirList)
  .map(utils.parseInfo)
  .each(utils.markdownToHtml)
  .map(utils.getPostList)
  .then(utils.genIndex)
  .then(fs.writeFileAsync.bind(fs, conf.buildto + 'index.html'))
  .done(function(){
    console.log('[done] index.html created.');
  });

fs.readdirAsync('./contents/pages')
  .map(function(fileName){
    var title = fileName.split('.')[0];
    return {
      fileName: fileName,
      headTitle: conf.name + ' - ' + title,
      inPath: conf.pageSource + fileName,
      outPath: conf.buildto + 'pages/'+ title + '.html',
      content: fs.readFileAsync(conf.pageSource + fileName, 'utf8')
    };
    })
  .each(utils.markdownToHtml)
  .done(function(){
    console.log('[done] All pages  created.');
  });

fs.readdirAsync('./contents/english')
  .then(utils.reverseDirList)
  //TODO: 和parseInfo只差 articleSource和 englishSource不同而已
  .map(function(fileName){
    var titleArr= fileName.split('.')[0].split('-');
    var postDate = titleArr[0] +'-'+ titleArr[1] +'-'+ titleArr[2];   
    return {
      fileName: fileName,
      headTitle: conf.name + ' - ' + titleArr[3],
      postDate: postDate,
      inPath: conf.englishSource + fileName,
      outPath: conf.buildto + 'english/'+ postDate + '-' + titleArr[3] + '.html',
      content: fs.readFileAsync(conf.englishSource + fileName, 'utf8')
    };
  })
  .each(utils.markdownToHtml)
  .map(function(md){
    return md.content
      .then(function(data){
        return {
          link: '/english/' + md.fileName.split('.')[0] + '.html',
          title: data.split('\n')[0], //像是:  # 標題  
          date: md.postDate
        };
      });
  })
  .then(function(lists){
    var indexFn = jade.compileFile('./templates/Index.jade', {pretty:false,debug:true});
    return indexFn({
      source: '../', 
      title: conf.name,
      lists: lists
    }); 
  })
  .then(fs.writeFileAsync.bind(fs, conf.buildto + 'english/index.html'))
  .done(function(){
    console.log('[done] english/index.html created.');
  });
  
