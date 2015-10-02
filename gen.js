var conf = require('./conf');
var utils = require('./utils');
var fs = require('fs');
var Bluebird = require('bluebird');
Bluebird.promisifyAll(fs);
var jade = require('jade');

fs.readdirAsync(conf.articleSource)
  .then(utils.reverseDirList)
  .map(utils.parsePostInfo)
  .each(utils.markdownToHtml)
  .map(utils.getPostList)
  .then(utils.genPostIndex)
  .then(fs.writeFileAsync.bind(fs, conf.buildto + 'index.html'))
  .done(function(){
    console.log('[done] index.html created.');
  });

fs.readdirAsync(conf.pageSource)
  .map(utils.parsePageInfo)
  .each(utils.markdownToHtml)
  .done(function(){
    console.log('[done] All pages  created.');
  });

fs.readdirAsync(conf.englishSource)
  .then(utils.reverseDirList)
  .map(utils.parseEnglishPostInfo)
  .each(utils.markdownToHtml)
  .map(utils.getEnglishPostList)
  .then(utils.genEnglishPostIndex)
  .then(fs.writeFileAsync.bind(fs, conf.buildto + 'english/index.html'))
  .done(function(){
    console.log('[done] english/index.html created.');
  });
  
