# [HTML/CSS/JS] 蒐集

## <figure>

<figure> 标签是 HTML 5 中的新标签。

http://www.w3school.com.cn/tags/tag_figure.asp

<figure> 标签规定独立的流内容（图像、图表、照片、代码等等）。
figure 元素的内容应该与主内容相关，但如果被删除，则不应对文档流产生影响。


## 棄用jsxhint, 改用 eslint !! 

https://www.npmjs.com/package/eslint

 `eslint --init`



## full screen div, and prevent size to be changed by content

[source](http://stackoverflow.com/questions/3276226/how-to-make-a-full-screen-div-and-prevent-size-to-be-changed-by-content)

用jquery: https://coderwall.com/p/nsv3cq/div-full-width-height-of-viewport



## jquery 按下按鈕觸發事件

http://stackoverflow.com/questions/19347269/jquery-keypress-arrow-keys

http://mikemurko.com/general/jquery-keycode-cheatsheet/

[這樣寫最好](http://stackoverflow.com/questions/1402698/binding-arrow-keys-in-js-jquery)

``` js
$('.selector').keydown(function (e) {
  var keyCode = e.keyCode || e.which,
      arrow = {left: 37, up: 38, right: 39, down: 40 };

  switch (keyCode) {
    case arrow.left:
      //..
    break;
    case arrow.up:
      //..
    break;
    case arrow.right:
      //..
    break;
    case arrow.down:
      //..
    break;
  }
});
```

## javascript switch multiple case 

``` js
switch (varName)
{
   case "afshin":
   case "saeed":
   case "larry": 
       alert('Hey');
       break;

   default: 
       alert('Default case');
}
```
