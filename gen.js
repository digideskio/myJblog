var conf = require('./conf');
var utils = require('./utils');
var fs = require('fs');
var Bluebird = require('bluebird');
Bluebird.promisifyAll(fs);

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

