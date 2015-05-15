# Flexbox排版探索(二) -- 加上media query

試著利用flexbox實現 Mobile-First approach排版。

Mobile-First 的方式就是我們先撰寫給mobile的CSS, 然後我們利用[media query](http://www.w3.org/TR/css3-mediaqueries/)來指定特定的style(例如較大的螢幕寬度)。


先設計一下我想要的基本結構:

``` html
<div class="Wrapper">
  <div class="Header">Header</div>
  <div class="Main">
    <div class="Content">Content</div>
    <div class="Desc">Desc</div>
  </div>
  <div class="Footer">Footer</div>
</div>  
```

對應的CSS外觀:

``` css
.Wrapper {background: black;}
.Header {background: yellow;}
.Content {background: green;}
.Desc {background: Fuchsia;}
.Footer {background: blue;}
.Header, .Desc, .Content, .Footer{ text-align: center;} 
```

長這樣: 

![base](http://imgur.com/dtQzqVll.png)


## mobile flexbox排版 

手機版沒啥梗, 依序顯示.Header, .Content, .Desc, .Footer:

``` css
.Wrapper, .Main {
  display: flex;
  flex-direction: column;
}
.Wrapper {
  min-height: 100vh;
}
.Main, .Content {
  flex: 1;
} 
```

可以參考[Flexbox排版探索(一)](/posts/2015-05-14-flexbox.html)

## media query -- 給大一點的螢幕

Media queries 是一些簡單的filters, 用來指定特定的style, 這讓我們很方便的可以依照使用裝置的寬度來調整各種style, 例如排版啦字體大小啦等等。

這裡設定兩個style, 手機(螢幕寬度小於600px)就用我們上面寫的預設版面, 超過600px寬度的時候我就將.Desc和 .Content並排, 並且.Desc比較窄放置於左邊。

新增CSS如下: 

``` css
@media (min-width: 37.5em){
  .Main {
    flex-direction: row;
  }
  .Desc {
    flex: 0 0 12em;
    order: -1;
  }
}
```

media query的語法如下: 

``` css
@media (query) {
  /* 當query條件符合, 就使用這裡的CSS規則 */
}
```

常用的query查詢條件有: `min-width`, `max-width`, `min-height`, `max-height`。

這裡設定的條件是`min-width: 37.5em`表示：當螢幕寬度大於37.5em的時候, 就會執行這個@media區塊。

當螢幕大於37.5em, 我就將.Main的`flex-direction`改回`row`(由左到右橫排)。

.Main下面有兩個flex item, 將.Desc設定`flex: 0 0 12em`表示將.Desc固定在12em的寬度, 設定`order:-1`表示反轉排列的順序, 這樣就會變成.Desc在左方, .Content這個item就會在右方。

結果如下: 

![ok](http://imgur.com/3BMaEG5l.png)

大功告成! 

## more 

[Use CSS media queries for responsiveness](https://developers.google.com/web/fundamentals/layouts/rwd-fundamentals/use-media-queries?hl=en)

[How to write Mobile-first CSS](http://www.zell-weekeat.com/how-to-write-mobile-first-css/)

[flexboxes + media queries = awesome layouts](https://www.new-bamboo.co.uk/blog/2014/03/10/flexboxes-media-queries-awesome-layouts/)
