# [ES6] ECMAScript 6筆記(二) -- iteration protocols + for...of + generators, yield

參考Babel的[learn-es2015](https://babeljs.io/docs/learn-es2015/)和 [MDN- iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)的解釋。


ES6定義`iteratable protocol`和 `iterator protocol` 兩個協定。

## The iterable protocol 

`iterable` protocol 允許 JavaScript物件定義或是客製化他們自己的迭代行為(iteration behavior)。例如使用`for..of`結構來loop所有的值。

像 `Array`或 `Map`已經有預設的iteration behavior, 有的沒有(例如`Object`)


為了要可以iterable, 物件必須要實作 iterator method, 就是說該物件要有一個屬性有`Symbol.iterator` key, 其值為一個不帶參數的函式, 這個函式傳回一個符合 `iterator protocol`的物件。

當這個物件需要被遍歷(iteratored), 例如使用`for..of` 迴圈, 其 iterator method就會被呼叫傳回`iterator`, 我們就可以利用這個iterator來loop取值。

## The iterator protocol 

`iterator` protocol 定義一個標準的方法來產生一個值的序列(無限或有限)。

一個物件只要實作了`next()` method, 就被當作是一個iterator。`next()`是一個無參數的函式, 傳回帶有兩個以下兩個屬性的物件: 

  - done(boolean) : 如果是false, 表示還有下個值(next value)
  - value 


## Example 

例如`String`就有內建的iterable物件了, 預設的iteraor會一個一個傳回字串的字元: 

``` js 
'use strict';
var s = 'hi';
var it = s[Symbol.iterator]();
console.log(it + '');  // [object String Iterator]
console.log(it.next()); //  { value: "h", done: false }
console.log(it.next()); //  { value: "i", done: false }
console.log(it.next()); //   { value: undefined, done: true }
```

定義我們自己的iterator: 

``` js
'use strict';
function makeIterator(array){
  var nextIndex = 0;
  return {
    next: function(){
      return nextIndex < array.length?
        {value: array[nextIndex++], done: false}:
        {done: true};
    }
  };
}
var it = makeIterator(['yo', 'ya']);
console.log(it.next().value); // yo
console.log(it.next().value) // ya;
console.log(it.next().done); // true
```

## for...of 

`for...of`和`for...in` loop的差別在於, `for...in`是遍歷(iterate)屬性名(property names), 那`for...of`是遍歷屬性值(property values):

``` js
let arr = [3, 5, 7];
arr.foo = "hello";

for (let i in arr) {
  console.log(i); // logs "0", "1", "2", "foo"
}

for (let i of arr) {
  console.log(i); // logs "3", "5", "7"
}
```

babel的範例: 

``` js
let fibonacci = {
  [Symbol.iterator]() {
    let pre = 0, cur = 1;
    return {
      next() {
        [pre, cur] = [cur, pre + cur];
        return { done: false, value: cur }
      }
    }
  }
}

for (var n of fibonacci) {
  // truncate the sequence at 1000
  if (n > 1000)
    break;
  console.log(n);
}
```

## generator function + yield

`function`宣告前面加上`*`號, 就表示我們定義了一個`genrator function`. 這個函式會傳回一個`Generator`物件。

``` js
function * name([param[, param[, ... param]]]) {
  //statements
}
```

Generators are functions which can be exited and later re-entered. Their context (variable bindings) will be saved across re-entrances.

呼叫generator function不會立刻執行,會先回傳一個`iterator`物件, 當iterator物件的`next()` method被呼叫, 這個函式的主體就會開始執行,直到遇到第一個`yield`運算式為止。

`yield` 會從iterator指定一個值回傳, 或是連同`yield*`發送值給其他的generator function。

接下來`next()` method傳回一個物件, 這個物件帶有一個包含被送出(yielded)的值的屬性,以及一個`done`屬性指出是否這個generator已經發送出其最新的值。

例如: 

``` js
function* idMaker(){
  var index = 0;
  while(index < 3)
    yield index++;
}

var gen = idMaker();

console.log(gen.next()); // { value: 0, done: false }
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: undfined, done: true }
```

使用 `yield*` 呼叫其他的generator function: 

``` js
function* anotherGenerator(i) {
  yield i + 1;
  yield i + 2;
  yield i + 3;
}

function* generator(i){
  yield i;
  yield* anotherGenerator(i);
  yield i + 10;
}

var gen = generator(10);

console.log(gen.next().value); // 10
console.log(gen.next().value); // 11
console.log(gen.next().value); // 12
console.log(gen.next().value); // 13
console.log(gen.next().value); // 20
```

babel範例, 改寫: 

``` js
'use strict';
require("babel/polyfill");
var fibonacci = {
  [Symbol.iterator]: function*() {
    var pre = 0, cur = 1;
    for (;;) {
      var temp = pre;
      pre = cur;
      cur += temp;
      yield cur;
    }
  }
}                                                                                                                                       
for (var n of fibonacci) {
  // truncate the sequence at 1000                                                                                                      
  if (n > 1000)
    break;
  console.log(n);
}
```



## More 

[iteration Iteration_protocols -- MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)

[for-of -- MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)

[function * -- MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)
