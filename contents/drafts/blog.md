# [Blog]

## go-blog todo(issue)

index post list 取md第一行

byte傳到html template應該可以直接顯示, 而不是還要事先轉 string(byteArr)

404, 500處理

err handling 補足

index post

template style(CSS) 

index要有short desc!! 

index posts list 要按照時間順序排列

build.go --> 不能同時有兩個main func --> 如何寫兩個command都可執行?
`go run`只能執行`main package`, 非main package就不行
--> 不然只能在main package function裏面選擇指令選項或是參數:

```
go run blog.go --watch
go run blog.go --build
```


### style 

配色篤定選一個

h2, h3配色大小可以參考golang/doc,  h2有底色, h3加粗無底色

code block 縮短文字會跳出框外

code block 字體改用hack

h1 文字過大折疊後,行高還是預設的1.5倍行高

index blog title 要跟h1大小不一樣(最大)


## 回憶

string to byte : `[]byte("Here is a string....")`

byte to string: `string(byteArr[:n])`

[creating blog go](http://blog.definedcode.com/creating-blog-go): 直接讀folder file list成index summary

[slice tricks](https://github.com/golang/go/wiki/SliceTricks)

[讀取檔案每行](http://stackoverflow.com/questions/8757389/reading-file-line-by-line-in-go)

## 新增功能

draft紀錄 start - end

post list分頁

RSS feed

## 風格參考

應該用這個就好, 最簡單乾淨: http://www.rosipov.com/blog/use-vimdiff-as-git-mergetool/

或是直接抄dockerfile的style, 也很清爽! [dockerfile](https://docs.docker.com/reference/builder/)


觀察其mobile first設計! 

用這個!  http://jacinabox.com.au/


  --> blog title 和 menu 在螢幕展開的時候也要在正中間不然看起來很怪

  --> mobile 的post lists 字體要在大一點

  --> pre/code 用更簡單的風格(不然code反而看起來更亂, 顏色標示錯誤)
      --> 使用 highlightjs的 Color Brewer


[http://azimi.me/](http://azimi.me/): 最適合從目前的blog改成這樣


[stevenwhite](http://stevenwhite.com/building-a-rest-service-with-golang-1/)


[更精減的風格](http://dougblack.io/words/a-restful-micro-framework-in-go.html) : code與文字的字體不同,先用這!



## Form 風格參考

https://wingmen.fi/#contact
