# [React][ES6] 將react元件用ES6 classes改寫

純粹翻譯與整理這篇: [refactoring react component to es6 classes](http://www.newmediacampaigns.com/blog/refactoring-react-components-to-es6-classes)


自[react 0.13](https://facebook.github.io/react/blog/2015/03/10/react-v0.13.html)開始,官方都鼓勵使用 [ES6 classes](https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html) 來撰寫react元件了, 當然趁現在的空檔,從善如流的將react 0.12的程式碼翻寫一下。


如果有寫過[OO](https://zh.wikipedia.org/zh-tw/%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1)的應該都會很有熟悉感。

## 將 propTypes 和 getDefaultTypes抽出到class定義之外

``` js
var ExampleComponent = React.createClass({ ... });
ExampleComponent.propTypes = {
 aStringProp: React.PropTypes.string
};
ExampleComponent.defaultProps = {
 aStringProp: ''
};
```

## 將 createClass轉成使用ES6 Class

就不再需要`createClass` method啦, class直接繼承`React.Component`:

``` js
class HelloComponent extends React.Component {
 render() { 
  return <h1 onClick={this._handleClick}>Hello</h1>;
 }
 _handleClick() {
  console.log(this);
 }
}
```

method前面也不在需要`function` keyword。

## 使用 constructor 綁定instance methods

React的`createClass` method好用的地方在於, 他會將我們的methods自動榜定(binding)到component einstance去, 但是我們寫ES6 classes, 就要自己處理binding, react團隊建議作[prebinding](https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#autobinding):

``` js
class HelloComponent extends React.Component {
 constructor() {
  super();
  this. _handleClick = this. _handleClick.bind(this);
 }
 render() { 
  return <h1 onClick={this._handleClick}>Hello</h1>;
 }
 _handleClick() {
  console.log(this); // this 就是一個HelloCompoenent
 }
}
```

## 使用 constructor 初始化state

把`getgetInitialState` method移除, 將初始化state的動作放到constructor裡: 

``` js
class HelloComponent extends React.Component {
 constructor() {
  super();
  this. _handleClick = this. _handleClick.bind(this);
  this.state = Store.getState();
 }
 // ...
}
```

## 撰寫base component --> 繼承

撰寫base component來處理method prebinding: 

``` js
class BaseComponent extends React.Component {
 _bind(...methods) {
  methods.forEach( (method) => this[method] = this[method].bind(this) );
 }
}
```

以後寫的元件, 只要繼承這個base component, 就可以很方便的: 

``` js
class ExampleComponent extends BaseComponent {
 constructor() {
  super();
  this._bind('_handleClick', '_handleFoo');
 }
 // ...
}
```

## More 

[Refactoring React Components to ES6 Classes](http://www.newmediacampaigns.com/blog/refactoring-react-components-to-es6-classes)

[babel: Learn ES 2015](https://babeljs.io/docs/learn-es2015/)

