# [Promise][Bluebird] 做一個簡單的靜態Blog網站產生器

利用 `Promise`方式做一個簡單的靜態Blog產生器。

不需要資料庫, 只需要撰寫markdown文章, 就轉換成靜態網頁。不需要額外租用網頁空間, 利用[Github Pages](https://pages.github.com/) 開開心心發佈我們的部落格。

## 想法與架構

功能很簡單： 我寫了一堆markdown的部落格文章, 執行一個產生器程式, 就幫我產生一個條列所有文章的首頁(index page), 
上面可以聯結到每個從markdown轉成html的文章頁面。

檔案結構如下: 

```
.
├── build
├── templates
│   ├── xxx.jade
│   ├── ...
├── posts
│   ├── xxx.md
│   ├── ...
├── gen.js
└── ...

```

其中:

- `build`: 放我們最後產出的靜態網頁內容, 
- `templates`: 放我們寫好的網頁樣板,
- `posts`: 放我們寫的markdwon部落格文章,
- `gen.js`: 產生器主程式。

`gen.js`會先蒐集`posts`資料夾有哪些markdown檔案, 然後解析markdown檔名, 讀取每個檔案並套用樣板轉換成HTML網頁, 最後將所有檔案資訊, 整理製作成index.html。

產生的結果都放在`build`資料夾內, 我們就可以把整包拿去發佈了:   

``` 
.
├── ...
├── index.html
└── posts
    ├── 2015-05-12-hello_world.html
    ├── 2015-05-13-install_and_setting_golang_on_ubuntu_and_vim.html
    ├── 2015-05-14-flexbox.html
    ├── 2015-05-15-express_middleware_1.html
    ├── ...
```

## Markdown文章格式

為了方便(簡單), 撰寫的markdown文章檔名必須要像以下格式: 

```
YYYY-MM-DD-post_article_url.md
```

檔名開頭是`YYYY-MM-DD`日期開頭, 再來接個`-`字號, 最後是整個文章的名字, 可以取名像是`post_article_url`, 但是不能取名用`-`字號連起來的名字, 例如`post-article-url`這樣就不行。 XD


每個文章開頭一定是大寫標題1: 

``` md
# 你好,我是文章標題

....
```

`gen.js`會取每個markdown文章的第1行, 條列在首頁的文章列表上。


## 用到的函式庫

把會用到的函式庫安裝一下: 

``` bash
$ npm i --save bluebird marked jade lodash highlight.js
```

其中: 

- [bluebird](https://github.com/petkaantonov/bluebird) 是一個高效能的promise函式庫, 
- [marked](https://github.com/chjj/marked) 是一個markdown paser和compiler,
- [jade](https://github.com/jadejs/jade) 是個樣板引擎(你也可以換成你喜歡的),
- [lodash](https://github.com/lodash/lodash/) 是一個js工具函式庫
- [highlight.js](https://github.com/lodash/lodash/) 拿來做語法高亮顯示用。

## 取得目錄

Promise概念和Bluebird使用, 可以參考我寫的[[Promise]使用Bluebird](/posts/2015-05-25-promise_1.html)

開始寫`gen.js`嚕! 

``` js
var _ = require('lodash');
var fs = require('fs');
var Bluebird = require('bluebird');
Bluebird.promisifyAll(fs);

var conf = {
  name: 'My Blog',
  desc: '程式筆記本',
  articleSource: './posts',
  buildto: './build'
};

function reverseDirList(list){
  return _(list).reverse().value();
}   


//=== My Flow ======================
fs.readdirAsync(conf.articleSource)
  .then(reverseDirList);

```

這裡我利用`fs.readdirAsync(conf.articleSource)`建立了一個新的promise陣列, 

再來利用`reverseDirList`函式將我們取得的目錄陣列做反轉, 讓最新的文章排在陣列第一個, 之後首頁列表顯示的時候才會由最新的文章依序往下排。

## 解析markdown檔案資訊

取得了文章檔案列表, 再來我們要把一些用到的資訊整理抽離出來:

``` js
function parseInfo(fileName){
  var titleArr= fileName.split('.')[0].split('-');
  var postDate = titleArr[0] +'-'+ titleArr[1] +'-'+ titleArr[2];
  return {
    fileName: fileName,
    headTitle: conf.name + ' - ' + titleArr[3],
    postDate: postDate,
    inPath: conf.articleSource + fileName,
    outPath: conf.buildto + 'posts/'+ postDate + '-' + titleArr[3] + '.html',
    content: fs.readFileAsync(conf.articleSource + fileName, 'utf8')
  };
} 
```

`parseInfo`函式利用每個檔案名稱, 傳回了要顯示在每個文章title標籤的的`headTitle`, 發表文章的`postDate`日期, 來源路徑`inPath`, 目的地路徑`outPath`,還有讀出來的檔案內容`content`。 

最後利用bluebird的[map](https://github.com/petkaantonov/bluebird/blob/master/API.md#mapfunction-mapper--object-options---promise) method, 讓陣列裡的每個item都執行`parseInfo`後傳回新的promise陣列。

``` js
fs.readdirAsync(conf.articleSource)
  .then(reverseDirList)
  .map(parseInfo);
```

## 文章要套用的樣板

樣板這裡使用jade, 如果不習慣jade寫法的人,可以用自己喜歡的, 或是有現成HTML的板型, 可以利用[html-to-jade](http://html2jade.aaron-powell.com/)轉成jade。

基本樣版`Html.jade`,主要就是共通引用的css,js寫在這, 以及< Body >的結構: 

``` jade
doctype html
html(lang='zh')
  head
    block head
      meta(charset='utf-8')
      meta(http-equiv='X-UA-Compatible', content='IE=edge,chrome=1')
      meta(name='viewport', content='width=device-width')
      link(rel='stylesheet', href=source+'css/github.css')
      link(rel='stylesheet', href=source+'css/main.css')
      title= title
  body
    .Wrapper
      .Header
        h1: a(href='/') My Blog
      block main
      .Footer
        include ./Footer.jade
```

注意這裡聯結css的地方, 必須要使用傳入的變數`source`, 例如:

``` jade
link(rel='stylesheet', href=source+'css/github.css')

```

主要是因為現在是我所有文章都放在`build/posts`資料夾下, 而css我是放在`build/css`下, 所以`source`在引用是文章的時候值為`../`, 在index.html的值為`./`。(應該還有更好寫法)

`Post.jade`: 

``` jade
extends ./Html.jade
block main
  .Main!= content
  h3: a(href='/') << 回到文章列表
```

Post.jade傳入的`content`, 就是我們由markdown內容轉換過來的HTML。


## Markdown --> HTML --> save

繼續我們的流程。

依照陣列裡的每個項目,我們將`content`由markdown轉成html, 套用我們寫好的jade樣版, 再一起轉成html後寫到我們的目的地(`build/posts`)資料夾去。

首先, 引用了jade和marked函式庫, 並在轉換markdown的時候設定使用highlight.js做語法高亮: 

``` js
var jade = require('jade');
var marked = require('marked'); 

marked.setOptions({
  highlight: function (code) {
    return require('highlight.js').highlightAuto(code).value;
  }
});
```

再來,在原來的流程中,加入`.each(markdownToHtml)`。

`markdownToHtml`是自定義的function, 使用bluebird的[each](https://github.com/petkaantonov/bluebird/blob/master/API.md#eachfunction-iterator---promise) 對前promise陣列中所存的每個item, 執行轉換markdown存到html檔案的動作: 

``` js
fs.readdirAsync(conf.articleSource)
  .then(reverseDirList)
  .map(parseInfo)
  .each(markdownToHtml);
```

`markdownToHtml`就像是延伸的promise流程, 先將markdown內容轉換成html, 將這html字串套用jade樣板, 最後寫入到目標路徑去, 完成後顯示訊息。使用[done](https://github.com/petkaantonov/bluebird/blob/master/API.md#donefunction-fulfilledhandler--function-rejectedhandler----void) method的差異在於, 任何未處理的rejection都會在這裡被拋出然後統一處理: 


``` js
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
```

## 首頁要套用的樣板

好了, 我們已經順利的將所有文章都轉好了, 現在要來處理產生index.html的內容。

首先先把首頁需要的樣板撰寫一下, `templates/Index.jade`: 

``` jade
extends ./Html.jade
block main
  .Main
    ul.Posts
      each list in lists
        li: a(href=list.link) #{list.title} <b>(#{list.date})</b>
```

這裡我們列出文章的標題與撰寫的時間, 並提供聯結到對應的文章去。

## 製作文章列表

流程新增一個項目`.map(getPostList)`: 

``` js
fs.readdirAsync(conf.articleSource)
  .then(reverseDirList)
  .map(parseInfo)
  .each(markdownToHtml)
  .map(getPostList);
```

`getPostList`把我們原來的promise item, 改成要產生文章列表所需要的"材料", `link` URL聯結, `title`聯結標題, `date`文章撰寫日期: 

``` js
function getPostList(md){
  return md.content
    .then(function(data){
      return {
        link: '/posts/' + md.fileName.split('.')[0] + '.html',
        title: data.split('\n')[0], //像是:  # 標題  
        date: md.postDate
      };
    });
}
```

## 產生index.html

要做的工作很單純, 把我們整理好的文章lists傳到`Index.jade`組裝成我們最後的HTML, 寫入檔案： 

``` js
function genIndex(lists){
  var indexFn = jade.compileFile('./templates/Index.jade', {pretty:false,debug:true});
  return indexFn({
    source: './', 
    title: conf.name,
    lists: lists
  }); 
}

fs.readdirAsync(conf.articleSource)
  .then(reverseDirList)
  .map(parseInfo)
  .each.markdownToHtml)
  .map(getPostList)
  .then.genIndex)
  .then(fs.writeFileAsync.bind(fs, conf.buildto + 'index.html'))
  .done(function(){
    console.log('[done] index.html created.');
  });
```

## Express Watch server

平常開發的時候, 還要把markdown檔案編成html檔案後, 再啟動http server看修改內容實在很麻煩, 這時候有個監看的web server幫忙就好多了, 這裡我利用expressjs, nodemon, npm script很簡單的方式實現。

安裝一下必要套件: 

``` bash
$ npm i --save express nodemon
```

[Express.js](http://expressjs.com/)是最普及的輕量化nodejs網頁框架, [nodemon](https://github.com/remy/nodemon)幫忙監控任何nodejs app檔案的變化, 一有變化就重新啟動server。

在`package.json`加上script自動化一些動作: 

``` js
{
  ...
  "scripts": {
    "dev": "nodemon server.js",
    "build": "sass ./contents/scss/main.scss:build/css/main.css & node gen",
    "scss": "sass --watch ./contents/scss/main.scss:build/css/main.css"
  },
  ...
}
```

執行 `npm run dev` 就執行express watch server, 只要新增/修改了markdown文章, server就重新啟動, 那重新realod瀏覽器就可以看到更新後的結果。

文章都寫好了, 確定要發佈就執行 `npm run build`, 就會直接呼叫`gen.js`和sass轉換css, 轉換好的`build`資料夾就可以整包拿去發佈。

開發的時候若要改動外觀css, 那麼除了執行`npm run build`以外, 再執行`npm run scss`就會啟動監看sass檔案, 一有改動就會更新css。

`server.js`就是我們的監看程式, 基本上, 就是利用我們寫的promise產生流程, 所以首先我們把`gen.js`的function全部抽出獨立成一個`util.js`, 設定的部份抽出成`conf.js`,  這樣`gen.js`和`server.js`都可以共用這些函式。

`server.js` 基本內容就是, 引用函式庫, 使用jade樣板, 啟動, 然後沒相關的route全部導到錯誤處理這樣: 

``` js

var express = require('express');
var conf = require('./conf');
var utils = require('./utils');
var marked = require('marked'); 
var fs = require('fs');
var Bluebird = require('bluebird');
Bluebird.promisifyAll(fs);

var app = express();

app.listen(3000, function(){
  console.log('server listening on port 3000');
});

app.set('views', './templates');
app.set('view engine', 'jade');
app.use('/css', express.static(__dirname + '/build/css'));

//Blog Route

//Err handling
app.use(function(req, res, next){
  var err = new Error('Not found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next){
  if(err.status === 404) {
    res.status(404).send('Not Found');
  }
  if(err.status === 500) {
    console.log(err.stack);
    res.status(500).send('Something broke!');
  }
});
```

再來加入要處理的routes: 要處理的route只有兩種, 一個就是index page, 另外就是每篇文章, 處理index page的route像這樣: 

``` js
//Blog Route
app.get('/', function(req, res){
  fs.readdirAsync(conf.articleSource)
    .then(utils.reverseDirList)
    .map(utils.parseInfo)
    .map(utils.getPostList)
    .then(utils.genIndex)
    .then(function(indexPage){
      res.send(indexPage);
    });
});
``` 

完全就把`gen.js` promise流程拿來用就對了! 這裡的流程和`gen.js`相比, 只是拿掉了`.each(utils.markdownToHtml)`每個markdown轉成html的部份, 以及最後我們沒有把index page寫入檔案, 而是把整個index page 直接傳回顯使給使用者(`res.send(indexPage)`)。

顯示每篇文章的部份, 則是我們上述所寫到的`markdownToHtml` 函式的內容, 我們解析URL, 讀取解析出來對應的markdown檔案, 轉換html, 最後直接render解析jade樣板後, 傳送結果給使用者: 

``` js
//Blog Route
app.get('/', function(req, res){
  //...
}

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
```


## 大功告成

終於完成 OH YA! 是不是比想像中簡單呢。利用promise, 讓整個非同步流程看起來十分清爽, 整理除錯上效率就提高不少, 雖然我覺得, promise的風格, 的確需要時間熟悉再適應。

這個網站就是利用這樣的方式完成的, 以上的程式碼我放在[這裡](https://github.com/jblog/jblog)。 

