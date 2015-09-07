# [HTML/CSS/JS] 蒐集

## CSS3 grid layout 

[The future of layout with CSS: Grid Layouts](https://medium.com/@patrickbrosset/css-grid-layout-6c9cba6e8a5a)

目前chrome 實作較多, 不過預設沒有開啟這項功能,

chrome中輸入: `chrome://flags#enable-experimental-web-platform-features`, 設定enable: 

![unblock](http://imgur.com/tujIkdil.png)

推荐使用 [css-grid-polyfill](https://github.com/FremyCompany/css-grid-polyfill)

``` html
  ...
  <script src="/js/css-polyfills.min.js"></script>                                          
</body>
```

這樣所有browser都可以透過polyfill來使用Grid layout了! 


Grid layout: 

![grid](https://cdn-images-1.medium.com/max/800/1*zcOcwuBtMoBaUfHHAJPNyg.png)

*Lines*: 這個case有4條垂直線, 3條水平線

*Tracks*: a track is simply the space between 2 parall lines.

Lines are useful to say where content starts and stops, but tracks are ultimately where content goes.

*Cells*: a cell is where a horizontal and a vertical track meet.

*Areas*: an area is a reactangular shape that can span an arbitrary number of cells. Areas like lines, can be named.

以下定義了 A, B, C3個區域：

![g2](https://cdn-images-1.medium.com/max/800/1*LyY-gAwN4xdr8FmReEdMMw.png)

> One key advantage of CSS grids is that they enforce real separation of layout and markup.

Indeed, the grid itself is completely defined purely in CSS. This means that apart from the parent HTML element the grid is applied to, there's no need for defining any extra elements for the columns, rows, cells or areas.

![g3](https://cdn-images-1.medium.com/max/800/1*oB_sweiQByIMdVPXGZrw4Q.png)

如上, 我們把areas做命名, contents只要依照該area名字擺放就好了

This means that not only can we change this layout relatively easily in the future, as long as we maintain the named regions (here the named regions act as the layout’s public API in a way), but media-queries can also be used to change this layout dynamically too. 

grid layout是用css定義的, media query也是, 因此可以彼此工作的很好, 上面layout可以改成如下給small screen: 

![g4](https://cdn-images-1.medium.com/max/800/1*xr308r1kDYPKpkzVdYDglQ.png)




### Mor


[中文解釋](http://www.w3cplus.com/css3/how-to-enable-support-for-grid-layout-in-various-browsers.html)

## < figure >

< figure > 标签是 HTML 5 中的新标签。

http://www.w3school.com.cn/tags/tag_figure.asp

< figure > 标签规定独立的流内容（图像、图表、照片、代码等等）。
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
