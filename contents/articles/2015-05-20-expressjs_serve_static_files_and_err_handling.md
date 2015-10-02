# [Express.js] -- 存取靜態檔案以及錯誤處理

取自Express.js 官網[serving static file](http://expressjs.com/starter/static-files.html) 和 [Error handling](http://expressjs.com/guide/error-handling.html)翻譯 +筆記。

建議看過 [[Express.js] 撰寫middleware(一)](/posts/2015-05-15-express_middleware_1.html) 和 [[Express.js] 撰寫middleware(二)](/posts/2015-05-20-express_middleware_2.html)。


## 存取靜態檔案

存取css, images, js或是其他static files可以使用Express.js內建的middleware: `express.static`。

假設我們的static file都放在`assets`目錄下: 

``` bash
assets/
├── css
│   └── main.css
├── font
├── imgs
│   └── a.jpg
├── index.html
├── js
└── vendor
```
 
就可以註冊`express.static`來存取static file: 

``` js
app.use(express.static('assets'));
```

我們就可以像以下一樣存取static file: 

``` bash
http://localhost:3000/imgs/a.jpg
http://localhost:3000/css/main.css
http://localhost:3000/index.html
http://localhost:3000/
```

我們可以註冊多個static file所在的資料夾: 

``` js
app.use(express.static('public'));
app.use(express.static('files'));
```

或是給一個虛擬的名字, 例如:

``` js
app.use('/static', express.static('public'));
```

就可以像這樣存取(URL多了`/static`的prefix):

``` js
http://localhost:3000/static/hello.html
```


像如果我用npm安裝了bootstrap或是jquery的套件, 那我就會設定如下: 

``` js
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist')); 
```

## Render plain HTML 

我們不需要使用`res.render()`這樣的方法來回應一個HTML給user, 如果有一個特定的檔案, 那麼就使用`res.sendFile()`就可以, 不然就放在特定資料夾, 用上述的`express.static()` middleware來處理。


## 處理 404 找不到頁面

預設會跑出像是`Cannot GET '/asdasd'`這樣的訊息, 不過這對一般user來說太硬了看不懂, 我們應該要好好處理一下404 not find。

對於Express.js來說, 404找不到頁面 並不是錯誤。因此error-handler middleware並不會去抓404的錯誤, 404只代表沒有符合的routes/middleware。 

要處理404, 只要在所有middleware chain最下方註冊一個middleware來處理: 

``` js
app.use(function(req, res, next){
  res.status(404).send('Not found');
});

```

## 處理其他錯誤

要在middleware chain最下方(比處理404更下面), 加入一個處理所有錯誤的middleware, 這個middleware比其他middleware多了一個`err`參數, 混合上面404 handler改寫如下: 

``` js
app.use(function(req, res, next){
  if(res.status === 404){
    res.status(404).send('Sorry cant find that');
  } else {
    next();
  }
});

app.use(function(err, req, res, next){
  console.log(err.stack);
  res.status(500).send('Something broke!');
});

```
