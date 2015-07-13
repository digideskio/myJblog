# [Go] 補充& Todo 

## Go FMT 

automatically formants Go source code

integration with editors(vim, emacs, others) 

can also refactor code (看spf13的blog)


## Go TEST

enable easy testing of application 

itegrates with the testing package

support benchmark, functional & unit style testing

combine with 'looper' to have realtime feedback 


## packages

`package`不是 classes 也不是objects , 

`package`不包含任何subpackages 


Go的最基礎的building block

visibility in package-level, not type-level

程式都從`main` package開始執行

package包含 types, functions ...


## go wiki example 

function literals ---> 有很多重複的 error code 處理 ,使用function literal

## text/template



## http/template

``` go
import "html/template"
```

`html/template`實作 data-driven templates, 用來產生 html output。

不管是不是最後輸出為html, 都應該使用`html/template`而不是 `text/template`

``` go
tmpl, err:= template.New("name").Parse(...)
err = tmpl.Execute(out, data)
```

成功的話, templ是injection-safe


[hugo的golang template解釋](http://gohugo.io/templates/go-templates/): 很清楚

[THE GO TEMPLATES POST](http://andlabs.lostsig.com/blog/2014/05/26/8/the-go-templates-post)

[go template include html](http://stackoverflow.com/questions/18175630/go-template-executetemplate-include-html): 有用blackfriday 轉markdown到html的例子



## os

``` go 
import "os"
```

Package `os` provides a platform-independent interface to operating system functionality.

例如檔案操作(CRUD, Pipe, 是否存在, SameFile), 權限操作(chomod), 目錄操作(chdir, TempDir), 環境變數操作(setenv), Exit, 

設計像Unix-like, 但錯誤處理像Go-like, 錯誤傳回錯誤的值而不是error numbers。

## 打開檔案讀取

``` go
file, err:=os.Open("file.go") //for read access.
if err != nil {
  log.Fatal(err)
}
```

打開檔案失敗的話, 錯誤訊息就會自我解釋了: 

``` bash
open file.go: no such file or directory
```

`os.Open`傳回一個`File`型別, `File`實作`io.Reader` interface:

``` go
func Open(name string) (file *File, err error)
```

`os.Open`或是`os.Create`都是呼叫`os.OpenFile`:

``` go
func OpenFile(name string, flag int, perm FileMode) (file *File, err error)
```

flag例如是`O_RDONLY`只允許讀取, perm像是`0666`這樣。



`File`可以執行的動作如下:  

![os.File](http://imgur.com/NJ0aTNnl.png)

例如把檔案的資料讀到一個bytes slice, `file.Read(data)`傳回讀取到的bytes計數：

``` go
data := make([]byte, 100)
count, err := file.Read(data)
if err != nil {
  log.Fatal(err)
}
fmt.Printf("read %d bytes: %q\n", count, data[:count])
```

## io

### io.Reader

``` go
type Reader interface {
  Read(p []byte) (n int, err error)
}
```

`Reader` 為包裹了基本`Read` method的interface.

## bufio

``` go 
import "bufio"
```

http://golang.org/pkg/bufio/

Package bufio implements buffered I/O.

It wraps an io.Reader or io.Writer object,

creating another object (Reader or Writer) that also implements the interface but provides buffering and some help for textual I/O.


建議使用`ReadBytes('\n')`或是`ReadString('\n')`或是用`Scanner`(簡單使用還是推荐用Scanner)


###  func NewScanner(r io.Reader) *Scanner

type `Scanner` 提供一個用來讀取資料方便的介面。像是一個用newline符號來分行的文字檔案。[#Scanner](http://golang.org/pkg/bufio/#Scanner)

``` go
package main

import (
  "bufio"
  "fmt"
  "os"
)

func main() {
  scanner := bufio.NewScanner(os.Stdin)
  for scanner.Scan() {
    fmt.Println(scanner.Text()) // Println will add back the final '\n'
  }
  if err := scanner.Err(); err != nil {
    fmt.Fprintln(os.Stderr, "reading standard input:", err)
  }
}
```

`Scanner`型別可以使用的function如下: 

![bufio.Scanner](http://imgur.com/cOwfuAyl.png)




## ioutil 

[read a text file and replace certain words](https://www.socketloop.com/tutorials/golang-read-a-text-file-and-replace-certain-words)


## fmt

## strings 

**string的加減!!**

注意是string**s**, 提供炒作strings的函式

包含(Contains), Counts, HasPrefix, index, Replace, Split, Trim, 

還有`Reader` 和 `Replacer` type: 

![reader and Replacer](http://imgur.com/PEZfA0al.png)

## strconv

Package strconv implements conversions to and from string representations of basic data types.

Append(Bool, Float, Int. Quote), Format(Bool, Float, Int..), Parse(Bool, Float...), Quote..



## go 的config檔案應該用哪種好? json ? 
 
