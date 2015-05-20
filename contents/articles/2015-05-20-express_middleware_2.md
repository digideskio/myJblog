# [Express.js] 撰寫middleware(二) 

Express.js 4 引入一個概念叫作 [Router](http://expressjs.com/4x/api.html#router), router就像是一個 "mini-application", 有助於我們把整個大app分成許多獨立的元件。

例如我們有一個Express server, 提供兩種服務: 一個是home page與相關像是產品頁面, 一個是給顧客來存取的API(例如給client-side app, 像是Angularjs之類)。 很明顯提供home page和API service的程式碼與相關函式庫都不太相同, 那麼就很適合獨立成兩個Express routers。

## Hello World + Routers

延續前段劇情, 如果我們只要紀錄來存取API的log, 那我們的app可能會長的這樣: 

``` js
var app = express();
var apiRouter = express.Router();

apiRouter.use(logger);
app.use(hello, bye);
app.use('/api', apiRouter);
```

我們把 API service獨立成一個Express router, 然後指定`/api` 會導向到這個router。

上述不管任何URL, 都會傳回Hello和Bye字樣, 只有`/api` route會在server上顯示log紀錄。

測試一下: 

``` bash
$ curl localhost:8000
Hello 
Bye 
$ curl localhost:8000/api
Hello 
Bye 
$ curl localhost:8000/api/hello
Hello 
Bye 

```

測試都正常, 不過觀看一下server顯示, 卻沒有任何log出現。why ?


## 註冊Middleware的順序很重要

Express.js 把middleware看成是一條鎖鏈(chain)的鏈結, 會不斷的執行middleware直到遇到response為結束(**res.end()**), 或是Express.js本身決定什麼也不做而中止。

所以, 在Express.js註冊middleware的順序很重要。

在上面的例子, 我們先註冊`bye`這個middleware, 然後才註冊`apiRouter`。但是在`bye`這個middleware裏面, 我們沒有呼叫`next()`而是使用`res.end()`中止了整個middleware chain, 因此`apiRouter`是完全沒有啟動作用的! 

解法就是重新排序我們的middleware註冊順序: 先註冊apiRouter： 

``` js 
app.use('/api', apiRouter);
app.use(hello, bye);
```

執行: 

``` bash
$ curl localhost:8000/api/hello
Hello 
Bye 
```

在server就可以看到log訊息:

``` bash
Wed May 20 2015 09:52:46 GMT+0800 (CST) 'GET' '/hello'
```

不過我們request是`/api/hello`, 為何結果會是`/hello`? 

## URL是相對於Router的

原因在於router不知道他本身是被附加在哪個app之上, 所以他只知道他自己的範圍。如果我們想要知道正確完整的URL, 就要使用`req.originalUrl`來取得。使用`req.baseUrl`就會取得`/api`。

## 如何除錯middlewre 

如果使用了第3方的middleware發生錯誤, 就是尋找接收`(req, res, next)`的地方, 然後尋找在那邊呼叫了`next()`或`res.end()`, 或許就可以找出錯誤所在。

或是使用[node-inspector](https://github.com/node-inspector/node-inspector)


## more

[unit testing express middleware](http://www.slideshare.net/morrissinger/unit-testing-express-middleware)

[Expressjs - Using Middleware](http://expressjs.com/guide/using-middleware.html)

[How to write middleware for express.js App](https://stormpath.com/blog/how-to-write-middleware-for-express-apps/?utm_source=nodeweekly&utm_medium=email)



