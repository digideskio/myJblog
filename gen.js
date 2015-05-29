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
  .then(function(){
    console.log('[done] index.html created.');
  });
