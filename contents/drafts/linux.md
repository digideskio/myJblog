# [Linux]指令 

## 利用 sed 做搜尋與取代

sed - stream editor for filtering and transforming text

 -i[SUFFIX] : edit files in place (makes backup if SUFFIX supplied)

 > sed -i'' 's/1000/3000'


## xfce4-terminal

http://www.webupd8.org/2013/01/how-to-use-xfce4-terminal-06x-as-drop.html

``` 
$ xfce4-terminal --drop-down
```

在快速鍵設定這個指令為`F12` 就可以快速開啟中央terminal! 


## 建立目錄並且切換到新的目錄:

```
$ mkdir /home/foo/test && cd $_
```

## echo 新增檔案內容

``` 
$ echo "hello" > test.md
$ echo "go" >> test.md
```

輸出

```
$ more test.md
hello
go
```

## 好用的bash alias 

[Ask HN: Share your favourite bash/zsh aliases](https://news.ycombinator.com/item?id=9869231)


## Google Chrome shortcut

[chrome shortcut](https://support.google.com/chrome/answer/157179?hl=en)

`Ctrl+F`找符合字串, 按`Enter`找下個符合字串, `Shift+Enter`找前個符合字串

back --> `Alt+left` , forward --> `Alt + right`

focus on url bar --> `alt + d` 或 `F6` 或 `ctrl+L`
