# [Express.js] 撰寫測試


[Unit Testing Express Middleware](http://www.slideshare.net/morrissinger/unit-testing-express-middleware)

## 測試middleware的挑戰

http response tests  --> 500 error , 當我們加middleware到stack的時候會發生? 

如何測試 mid-stack 所在的middleware ? 

如何反映出測試失敗? --> 例如next() 沒有被呼叫? 

知道何時要測試? --> 何時要 assertion 

要怎麼加入測試來源data(例如從DB撈資料過來)? 

有兩個test case, 哪一個改動了來源的測試資料?

原本有兩個middleware, 後來又有人在stack加入新的middleware ? 


--> 使用 promise

## Pull middleware into endpoints, tests

原本: 

``` js 
app.get('example/endpoint', function(req, res, next){
  // middleware implementation
}, function(req, res, next){
  // middleware implementation
})
```

改成用這樣: 

``` js
var middleware = {
  first: function(req, res, next){},
  second: function(req, res, next){}
};

app.get('example/endpoint', 
  middleware.first,
  middleware.second);
```

## Mock req, res

為了要測試middleware, 因為middlware接收 req, res參數, 我們首先要可以mock(模仿) req, res傳入到middleware中。

這裡採用 [node-mocks-http](https://github.com/howardabrams/node-mocks-http)這套件來幫忙

比用[request](https://github.com/request/request)來的清爽:

``` js
it ('resolve under condition X with result Y', function(){
  
  var req = httpMock.createRequest();
  var res = httpMock.createResponse();

  //Call middleware(req, res) and assert
});
```

## use promise as link between middleware and endpoints 

middleware傳回 promise

Use Promise as Link between middleware and endpoints: 

``` js
var Q = require('q');

module.exports = function(req, res){
  var deferred = Q.defer();

  //define middleware behavior and resolve or reject promise

  return deferred.promise;
}
```

## return client-server interaction to endpoint 

## Mocha + Promise

使用 chai,  chai-as-promised

## Testing with data 

data必須要: 

 - 測試跟環境是獨立的
 - Data 可以跟著repo走
 - db可以很輕鬆的reset到初始的data set 

### The high level

  使用mongoose + mockgoose(Mockgoose is a simplified in memory database)

  --> (me)使用 sinon 來 mock mongodb ?

 - mock mongoDB with in-memory db 這樣就可以測試完就丟棄這些資料
 - 寫好的test data, 可以跟著repo走 (使用pow-mongoose-fixtures)

### Loading fixtures 




## More

[官網測試](https://github.com/strongloop/express/tree/master/test)

[getting started with node.js and Mocha](https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-mocha?utm_source=nodeweekly&utm_medium=email)

[Unit Testing Express Middleware](http://www.slideshare.net/morrissinger/unit-testing-express-middleware)
