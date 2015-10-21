# [Nodejs] WorkShop

## Node.js intro

Node.js: an **asynchronous**, **event-driven** framework built on top of **Chrome's JavaScript engine**

Node is **single-threaded** and uses a concurrency model based on an event loop.

 It is **non-blocking**, so it doesn't make the program wait, but instead it registers a **callback** and lets the program continue. 

This means it can handle concurrent operations without multiple threads of execution, so it can scale pretty well.


Nodejs is not designed for data processing. It's good for tasks such as getting data from database, doing simple transform and send user response.  

So I would like to have nodejs as a Restful API server and talk to Scala, which runs complex and long tasks.

### 現況 

ES5, ES6, ES7, babel

## 前置工具

windows: https://www.visualstudio.com/features/node-js-vs

mac: 安裝xcode 

http://coolestguidesontheplanet.com/install-and-configure-wget-on-os-x/

ubuntu: 

```
sudo apt-get install build-essential libssl-dev
sudo apt-get install curl
```

check是否系統有: curl 或 wget

## install 

use nvm(Node Version Manager) - Simple bash script to manage multiple active node.js versions

有些lib只跑特定版本node

install: 

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash
nvm --version
```

then: 

```
nvm install node && nvm alias default node
nvm list
node -v
```

If you want to install a new version of Node.js and migrate npm packages from a previous version:

```
nvm install node --reinstall-packages-from=node
```

移除不用的版本: `nvm uninstall`

http://www.cli-nerd.com/2015/09/09/7-reasons-to-upgrade-to-node-v4-now.html

https://nodejs.org/api/index.html

## 練習 

利用REPL(Read-Eval-Print-Loop)來做語法測試與除錯: The REPL provides a way to interactively run JavaScript and see the results.  `node`

照做: http://learnxinyminutes.com/docs/javascript/

str轉int, int轉str:  string + integer 

字串可以相加, 那str+int? 

## hello.js

print hello world. 

1. 使用REPL

2. `hello.js`

`node hello.js` or `node hello`

注意項目: 

- 字串： 單引號, 雙引號, *左上角那個引號*
- 當出錯的時候? 

## modules

Node.js has a simple module loading system.

In Node.js, **files and modules are in one-to-one correspondence**

A module encapsulates related code into a single unit of code. When creating a module, this can be interpreted as moving all related functions into a file.

撰寫一個module : say.js

```
var hello = function(){
  return 'Hello'
}

var helloSpanish = function(){
  return 'Hola';
}

module.exports.hello = hello;
```

使用`export`


Modules make it possible to include other Javascript files into your applications.

引用一個module: main.js

```
var say = require('./say');

console.log(say.hello());
//console.log(say.helloSpanish());
```

有export的,就像是public, 沒有export的, 就是private

https://www.airpair.com/javascript/node-js-tutorial#1-introduction

node_modules

### Share variables between modules

config.js: 

```
var config = {
  foo: 'bar'
};

module.exports = config;
```

server.js:

```
var config = require('./config');
console.log(config.foo);
```

## Nodejs 標準API 

Cluster: A single instance of Node.js runs in a single thread. To take advantage of multi-core systems the user will sometimes want to launch a cluster of Node.js processes to handle the load.

### require all files in a folder 

http://stackoverflow.com/questions/5364928/node-js-require-all-files-in-a-folder


## Event

Many objects in Node.js emit events: a net.Server emits an event each time a peer connects to it, a fs.readStream emits an event when the file is opened. All objects which emit events are instances of `events.EventEmitter`. You can access this module by doing: require("events");

Typically, event names are represented by a camel-cased string, however, there aren't any strict restrictions on that, as any string will be accepted.

Functions can then be attached to objects, to be executed when an event is emitted. These functions are called listeners. Inside a listener function, this refers to the EventEmitter that the listener was attached to.

這篇解釋得很清楚： http://www.tutorialspoint.com/nodejs/nodejs_event_loop.htm

In Node Application, any async function accepts a callback as a last parameter and the callback function accepts error as a first parameter.

http://stackoverflow.com/questions/5599024/what-so-different-about-node-jss-event-driven-cant-we-do-that-in-asp-nets-ht

## command line arguments

arguments都存在 `process.argv`

command_params.js: 

```
console.log(process.argv);
console.log(process.argv[2]);
console.log(process.argv.slice(2));
```

```
$ node command_params.js haha
[ '/Users/luchoching/.nvm/versions/node/v4.2.1/bin/node',
  '/Users/luchoching/code/nodejs-test/command_params.js',
  'haha' ]
haha
[ 'haha' ]
```

## file processing

利用 http://www.tutorialspoint.com/nodejs/nodejs_event_loop.htm 的例子

https://nodejs.org/api/fs.html

callback: 

```
fs.readdir(path, callback)
```

同步和非同步方法

fs.close(fd, callback) <-> fs.closeSync

執行順序是? 

## web server

https://nodejs.org/api/

你已經用過了, console.log

write a https server: hello world! : 

順便練習看懂nodejs官網API doc

原理: http server --> 原本像是apache, nginx, iis該做的事, 自己接手做
要: 處理route, 收request, 發送對應response, keep listening.

server.js:

```
var http = require('http');

const PORT=8080;

var server = http.createServer(function(req, res){
  res.end('Hello Nodejs Web! ' + req.url);
});

server.listen(PORT, function(){
  console.log('Server listening on PORT: ', PORT );
});
```

createServer裡的參數funtion --> requestListener --> `request` event, 用來處理request event

sync & async  --> 便當店 和  麥當勞

async --> use callback function 

createServer 這個部分，裏面的匿名函式雖然宣告，但是並不是直接觸發，而是等到當有使用者登入伺服器的時候才會觸發這個事件。

single thread --> callback + event driven --> 類似multi thread

todo: res.writeHead --> ex: plain/text type , res.write, res.end 

todo: use ES6 syntax:  arrow function 

todo: 加入route

## 其他

airbnb javascript coding style: https://github.com/airbnb/javascript 

https://github.com/felixge/node-style-guide

callback conventions: https://blog.risingstack.com/node-js-best-practices/

typeof 

instanceof

句點 

console.log

forEach 

data structure : list, array 

use `module.exports` not `exports`

`"use strict";`:   https://msdn.microsoft.com/library/br230269(v=vs.94).aspx#rest

http://eddychang.me/javascript/224-strict-mode

this --> function scope (save this)

## npm

npm is the package manager used to distribute Node modules.

https://docs.npmjs.com/

`npm --help`

`npm init`

`npm init -y` : 什麼都yes, 方便快速prototyping 

`package.json`

http://www.copterlabs.com/blog/json-what-it-is-how-it-works-how-to-use-it/

JSON is short for JavaScript Object Notation, and is a way to store information in an organized, easy-to-access manner. In a nutshell, it gives us a human-readable collection of data that we can access in a really logical manner.

name-value, value可以是string, int, {}, []

`npm search packagename`

`npm install` 又可簡寫為 `npm i`

`npm install --save`, `npm install --save-dev`

查看全域安裝了哪些package: `npm list -g --depth=0`

查看該專案安裝了哪些packages: `npm list --depth=0`

使用別人專案的第一個動作, 就是查看package.json , 然後`npm install`

Top 100 most dependent upon packages: https://github.com/anvaka/npmrank/blob/master/sample/dependencies.md

全世界種類最多的套件庫: http://www.modulecounts.com/

### library update

注意專案要更新library是大事, 要小心

### npm scripts

特殊: `npm start`, `npm test`

`npm run`

## expressjs 

http://expressjs.com/

installing 

helloworld 

routing 

serve static file 

http://expressjs.com/guide/writing-middleware.html

expressjs middleware的四個等級: http://expressjs.com/guide/using-middleware.html

利用middleware控制work flow

jade template engine: http://expressjs.com/guide/using-template-engines.html 

error handling : 404, 500: http://expressjs.com/guide/error-handling.html

https://www.lookami.com/using-es6-es2015-in-a-node-js-express/

database integration: http://expressjs.com/guide/database-integration.html 

## mongodb 

https://www.mongodb.org/

安裝, 操作mongo shell

http://docs.mongodb.org/manual/reference/sql-comparison/

mongodb native nodejs driver: https://github.com/mongodb/node-mongodb-native

撰寫 expressjs mongodb middleware

## callbacks

```
callback = (typeof callback === 'function') ? callback : function() {};
```

Callbacks Always Pass Error Parameter First

Always Check for “error” in Callbacks

## file I/O

https://medium.com/@yoshuawuyts/mastering-the-filesystem-in-node-js-4706b7cb0801

sync & async

## Tools 

beautify 

eslint 

emmet 

iron-node : Debug node.js with Chrome Developer Tools

shell.js

## automate the build process

https://blog.risingstack.com/terminal-guide-for-nodejs/

https://moroccojs.org/tutorials/npm-based-front-end-workflow/

## ES6 

目前nodejs實作ES6的進度: https://nodejs.org/en/docs/es6/

## 可以做什麼

mud遊戲

shelljs取代 shell script自動化

markdown document server (wiki like)

static blog website generator 

proxy

rest api server 

web app --> desktop app(electron)

## Links

http://justbuildsomething.com/node-js-best-practices/

http://www.toptal.com/nodejs/interview-questions

https://medium.com/javascript-scene/10-interview-questions-every-javascript-developer-should-know-6fa6bdf5ad95

paypal用的:  http://krakenjs.com/

Asynchronous Javascript templating for the browser and server. This fork is maintained by LinkedIn.  :  https://github.com/linkedin/dustjs

nodejs QA & CI :  http://www.clock.co.uk/blog/tools-for-unit-testing-and-quality-assurance-in-node-js
