# [Express.js] 撰寫middleware(一)

[Express.js](http://expressjs.com/) 應該是node.js旗下最老牌而且主流的網頁框架了, 利用express.js這樣的輕量化框架, 可以很開心的寫網站或是撰寫REST API。

以前都馬開心的使用[Express generator](http://expressjs.com/starter/generator.html)拼拼湊湊寫完就丟出去, 現在乖乖來理解一下。以下的文章參考 [How to write middleware for express.js App](https://stormpath.com/blog/how-to-write-middleware-for-express-apps/?utm_source=nodeweekly&utm_medium=email), 寫的太好了我幾乎都是翻譯，然後自己一點補充說明這樣 XD

## 什麼是Middleware 

Express.js寫出來的網站, 就是一個大App, user發送request給我們寫好的App, 我們處理好後回應response給user。

**Middleware** 就是一個可以接收request(**req**)和 response(**res**)物件的function。這個middleware可以修改或傳遞request或是response物件, 然後傳給下個middleware。每個middleware可以決定要繼續傳遞, 或是中斷整個傳遞鍊。

在某些框架 middleware的概念叫作 **filters**, 意思是一樣的, 一個request, 一堆傳遞轉換的function, 輸出response。

![express](http://i.imgur.com/dShahtQ.jpg)

一個middleware長的樣子如下: 

``` js
function logger(req, res, next){
  console.log(new Date(), req.method, req.url);
  next();
}
```
express middleware就是一個function帶有3個參數: `req`, `res`, `next`。

上面所寫的logger middleware會把每次request的時間, method還有url都列印在終端機上, 然後呼叫`next()`往下個middleware過去。

**Express.js的任務, 就是管理你所有middleware chain。**

## 'Hello' 和 'ByeBye' middleware

先寫出一個Express app: 

``` js
var express = require('express');
var app = express();
app.listen(8000);
```

app有了, 不過這個app沒法做任何事, 要加入middleware才成, 我們把上面寫好的`logger` middleware加入:

``` js
app.use(logger);
```

啟動我們寫好的app, 利用curl測試看看, 會發現印出以下訊息:

``` bash
$ curl http://localhost:8000/
Cannot GET /
```
但是server這邊有順利列印出log: 

``` bash
$ node server
Fri May 15 2015 15:00:47 GMT+0800 (CST) 'GET' '/'
```

### 'Not Found'表示 '不做任何事'

會這樣是因為我們在logger middleware呼叫了`next()`,但是並沒有註冊其他middleware給Express用, Express就只好什麼都不做, 又因為我們呼叫了`next()`,表示我們並未結束這個response, Express就會回應預設的`404 Not Found`找不到訊息。

解法就是利用`res.end()`來完成結束整個response。

### app.use 和 app.get 

再來我們寫一個叫作`hello`的middleware: 

``` js 
function hello(req, res, next){
  res.write('Hello! \n');
  next();
}
```

將這個middleware加到我們的middlware chain中: 

``` js 
app.use(logger);
app.get('/hello', hello);
```

`app.use`表示 **所有的request都會執行這個middleware**

`app.get`表示 **只有針對該URL 做 GET request的時候才會執行這個middleware**

測試一下看結果: 

``` bash
$ curl localhost:8000/hello
Hello 

```

察看一下server log: 

```
Fri May 15 2015 15:26:02 GMT+0800 (CST) 'GET' '/hello'
```

結果都ok, 但是發現 curl沒有終止 ... 

## 注意response 有沒有結束

要結束response, 就要呼叫`res.end()`。

我們再來寫一個middleware, 在這個middleware裏面,我們會結束這個response: 

``` js
function bye(req, res, next){
  res.write('ByeBye \n');
  res.end();
}
```

修改一下我們的middleware chain: 

``` js
app.use(logger);
app.get('/hello', hello, bye);
```

這次就可以順利結束response了: 

``` bash 
$ curl localhost:8000/hello
Hello 
Bye 
$
```


## more

[Expressjs - Using Middleware](http://expressjs.com/guide/using-middleware.html)

[How to write middleware for express.js App](https://stormpath.com/blog/how-to-write-middleware-for-express-apps/?utm_source=nodeweekly&utm_medium=email)
