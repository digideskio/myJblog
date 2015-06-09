# [Webpack] jQuery + Boostrap + Express dev/production server 

[Webpack](https://github.com/webpack/webpack)是一個module bundler。利用webpack就可以開心的管理我們的前端程式碼了, 使用npm管理module, 輸出source maps, 將大的javscript檔案拆成多個檔案, 幫我們前置處理像是jsx, coffeescript, sass, ES6.... 

如果只用了幾個`<script src='...'>`那可能看不出webpack效益, 不過若web app很巨大,或是要長的很大, 那麼用webpack效益就會很明顯。

[參考這篇](http://www.christianalfoni.com/articles/2015_04_19_The-ultimate-webpack-setup), 翻譯與整理。

## 使用情境

官網的內容很多, 先縮小一下範圍, 假設一下我的使用情境: 這次我想使用webpack, 管理我的[SPA](http://en.wikipedia.org/wiki/Single-page_application), 做一個可以很快速產出prototyping的環境。

我的SPA會大量用到boostrap和jQuery, SPA和REST API有可能會放在相同的Express server上,  我的Express server開發的時候可以hot-reload, 當我改變我的sass或是js程式碼的時候, 就會有webpack幫我在記憶體自動編譯,然後瀏覽器就會重新載入顯示更改過後的結果, 當我想要上線的時候, 透過webpack可以幫我的前端程式碼最佳化。 

## 檔案結構

``` bash
.
├── app
│   ├── main.js
│   └── main.scss
├── package.json
├── public
│   └── index.html
├── server
│   └── bundle.js
├── server.js
├── webpack.config.js
└── webpack.production.config.js
```

其中: 

  - `app`: SPA主資料夾
  - `app/main.js`: 我們app的進入點(entry point)
  - `public`: 依照express的慣例, 這裡放static file
  - `public/index.html`: 主要就是引用我們編好的js程式碼
  - `server/bundle.js`: bundler主程式
  - `server.js`: express server 和 proxy
  - `webpack.config.js`: 開發時期用的webpack設定檔
  - `webpack.production.config.js`: 要產出上線的webapck設定檔

## Express 基本設定

一開始, `server.js`主要就是區分上線或是prototype, 並且提供存取index.html的服務: 

``` js
var express = require('express');
var path = require('path');

var app = express();

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? 8080 : 5000;
var publicPath = path.resolve(__dirname, 'public');

app.use(express.static(publicPath));

app.listen(port, function(){
  console.log('Server running on port ' + port);
});
```

`public/index.html`單純就是引用bundle好的js檔案, 這裡我們設定bundle好的js檔案放在`public/bundle`下: 

``` html
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <title>Prototype</title>
</head>
<body>
</body>
<script type="text/javascript" src="build/bundle.js"></script>
</html>
``` 

## 設定開發時bundle規則

參考[官網設定](http://webpack.github.io/docs/configuration.html), 編寫`webpack.config.js`：

``` js 
var path = require('path');
var webpack = require('webpack');

var nodeModulePath = path.resolve(__dirname, 'node_modules');
var buildPath = path.resolve(__dirname, 'public', 'build');
var mainPath = path.resolve(__dirname, 'app', 'main.js');

var config = module.exports = {
  devtool: 'eval'
};
```

把相關路徑先做個整理, 先設定`devtool: 'eval'`方便之後使用devtool作debug。


### 進入點

再來設定要bundle的進入點: 

``` js
config.entry= [
  'webpack/hot/dev-server',
  'webpack-dev-server/client?http://localhost:8080',
  mainPath
];
```

我們pass給`entry`一個陣列, 那麼所有的module都會在開始的時候載入, 然後匯出最後一個(`mainPath`), 

我們使用[webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html)監看改變,webpack-dev-server就是一個epxress+socket.io server, 當我們js或style檔案改變的時候, webpack-dev-server就會幫我們動態更新頁面, 因此要設定`webpack/hot/dev-server`和 `webpack-dev-server/client?http://localhost:8080`這兩個特殊的entry point。

### 輸出

設定我們開發環境的輸出: 

``` js
config.output= {
  path: buildPath,
  filename: 'bundle.js',
  publicPath: '/build'
};
```

這裡是說, 我們把bundle好的js檔案輸出到`buildPath`路徑的`bundle.js`, 不過我們這邊借用webpack-dev-server, 所有的bundle都是在記憶體執行, 沒有實際輸出到檔案, 因此這個設定是沒有作用的, 不過這兩個設定拿掉webpack會報錯, 因此需要加著。 

所有關於webpack的檔案應該都要過`publicPath`(build path), 這裡代表都會經過`http://localhost:5000/build`, 這樣方便proxy來處理。

### 檔案前置處理

再來設定loaders: 

``` js
config.module = {};
config.module.loaders= [
  {
    test: /\.js$/, 
    loader: 'babel', 
    exclude: [nodeModulePath]
  },
  { 
    test: /\.css$/, 
    loader: 'style!css' 
  },
  { 
    test: /\.scss$/, 
    loader: 'style!css!sass' 
  },
  { 
    test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
    loader: 'url-loader?limit=100000' 
  }
];
```

[Loaders](http://webpack.github.io/docs/loaders.html)就很像其他build工具(例如gulp)裏面的`tasks`用來轉換檔案, 引用的loader名字可以簡寫例如`babel-loader`可以簡寫為`babel`。Loader是可串聯的, 串聯利用`!`來表示, 例如`style!css!sass`表示style-loader處理完換css-loader處理,最後sass-loader處理。

上面的意思這樣就很好理解了, 只要js檔案(除了`node_modules`)都會先利用babel-loader前置處理轉換ES6程式碼, 剩下類推。loders可參考 [Loader列表](http://webpack.github.io/docs/list-of-loaders.html)

記得要安裝相關loader套件: 

``` bash
$ npm i -save-dev babel-loader style-loader css-loader url-loader sass-loader
```

### 使用 Plugin


``` js
config.plugins= [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: 'jquery',
    _: "lodash"
  })
];
```

Webpack的能力可以靠著[Plugins](http://webpack.github.io/docs/plugins.html)來擴充, `HotModuleReplacementPlugin`啟動Hot Module Replacement功能, `ProvidePlugin`幫我們自動載入一些module, 例如上面設定後, 我們不再需要每個檔案用到jQuery時都要`var $ = require('jquery');`, 直接使用就成了,例如:  

``` js
$('#item').show();
```

[Plugings列表](http://webpack.github.io/docs/list-of-plugins.html)


## Bundler 

``` js
var Webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('../webpack.config.js');
var path = require('path');
var fs = require('fs');
var mainPath = path.resolve(__dirname, '..', 'app', 'main.js');

module.exports = function(){

  var bundleStart = null; //bundle起始時間
  var compiler = Webpack(webpackConfig); //注入webpack設定檔

  //編譯開始時的顯示訊息
  compiler.plugin('compile', function(){
    console.log('Bundling....');
    bundleStart = Date.now();
  });

  //編譯完成後的顯示訊息
  compiler.plugin('done', function(){
    console.log('Bundleed in ' + (Date.now() - bundleStart) + 'ms!');
  });

  var bundler = new WebpackDevServer(compiler, {
    publicPath: '/build/', 
    hot: true, //啟動hot replacement
    //以下為終端機顯示設定
    quiet: false,
    noInfo: true,
    stats: {
      color: true
    }
  });

  //webpakc-dev-server 監聽port為8080
  bundler.listen(8080, 'localhost', function(){
    console.log('Building project, please wait....');
  });
};
```

只要是`http://locahost:5000/build`的內容, 都會透過proxy轉送到這個`http://localhost:8080/build`這個webpack-dev-server來處理, webpack-dev-server就會依照我們的webpack.config.js設定檔, 將檔案前置處理並bundle好後回傳(在記憶體中未寫入檔案)。

## 設定Proxy到bundler

修改一下我們原來的`server.js`, 加入`http-proxy`, 利用proxy將要bundle的檔案透過proxy轉給webpack-dev-server: 


``` js
var express = require('express');
var path = require('path');
var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer();
var app = express();

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? 8080 : 5000;
var publicPath = path.resolve(__dirname, 'public');

app.use(express.static(publicPath));

//如果不是production mode, 就啟動webpack-dev-server
if (!isProduction){
  var bundle = require('./server/bundle.js');
  bundle();

  //所有localhost:5000/build的請求都proxy到webpack-dev-server
  app.all('/build/*', function(req, res){
    proxy.web(req, res, {
      target: 'http://localhost:8080'
    });
  });
}

//catch proxy errors!
proxy.on('error', function(e){
  console.log('Could not connect to proxy, please try again...');
});

app.listen(port, function(){
  console.log('Server running on port ' + port);
});

```

## Production 設定

另外寫一個`webpack.production.config.js`, 與原來`webpack.config.js`的差別在於我們拿掉了所有有關webpack-dev-server的設定: 

``` js
...
config.entry= mainPath ;
config.output= {
  path: buildPath,
  filename: 'bundle.js'
};
...
config.plugins= [
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: 'jquery',
    _: "lodash"
  })
];
```

## app/main.js

``` js
require('../node_modules/bootstrap/dist/css/bootstrap.min.css');
require('./main.scss');
require('bootstrap'); /* bootrstap.min.js */
```

在我們的bundle進入點`app/main.js`中加入對應引用, webpack就可以幫我們處理對應的前置處理與打包了! 不僅js檔案, css,scss都可以引用。

## npm scripts 

修改一下`package.json`, 這裡我加上了簡單的scripts: 

``` js
...
"scripts": {
  "dev": "rm -r public/build; node server",
  "build": "rm -r public/build; NODE_ENV=production webpack -p --config webpack.production.config.js",
},
...
```

不管是啟動開發或是production的bundle, 都先把`public/build`的內容物清除, 執行`npm run dev`就啟動了有webpack-dev-server的環境, 這樣只要修改任何的js或css檔案都會即時的前置編譯並在瀏覽器即時顯示修改結果。

執行`npm run build`就會使用`webpack.production.config.js`設定檔做編譯, 實際的將bundle好的檔案寫入到`public/build`去。


## More 

[The ultimate webpack setup](http://www.christianalfoni.com/articles/2015_04_19_The-ultimate-webpack-setup)

[gulp、webpackでjqueryプラグイン(scrollmagic、tweenmax等)を使う時の設定](http://qiita.com/ktkt/items/17e4fe57f6e6ecf65677)

[react-webpack-node](https://github.com/choonkending/react-webpack-node/blob/master/webpack.config.js)

[how to use webpack with rails](http://clarkdave.net/2015/01/how-to-use-webpack-with-rails/)
