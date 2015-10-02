# [Go] 補充& Todo 

## How to write Go code 

### go install 

copy files and set attributes.

The install program copies files (often just compiled) into destination locations you choose.

例如會把compile好的binary放到 $GOPATH/bin去, 例如`$GOPATH/bin/hello`, 直接執行`hello`也可以

## go-wraper 

https://github.com/docker-library/golang/blob/master/go-wrapper

## mgo connection pool / http

http://stackoverflow.com/questions/23223743/connections-pool-in-mgo

Further sessions to the same cluster are then established using the New or Copy methods on the obtained session. This will make them share the underlying cluster, and manage the pool of connections appropriately.

So a single call to `Dial` or `DialWithTimeout` or `DialWithInfo` will establish the connection pool, if you require more than one session, use the `session.New()` or `session.Copy()` methods to obtain it from the session returned from whichever Dial function you chose to use.

**spf13文件有講到了** :  http://spf13.com/presentation/MongoDB-and-Go/

``` go
func (s *Server) handle(w http.ResponseWriter, r *http.Request){
  session := s.session.Copy()
  defer session.Close()
  //...
}

```

**這篇有範例!!** https://medium.com/@matryer/the-http-handlerfunc-wrapper-technique-in-golang-c60bf76e6124



## slice 操作

[官網 Slice Tricks](https://github.com/golang/go/wiki/SliceTricks)

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


## go的template模板怎么才能引入css和js等静态文件？

http://golangtc.com/t/55555bcd421aa90930000005


## http/template


[THE GO TEMPLATES POST](http://andlabs.lostsig.com/blog/2014/05/26/8/the-go-templates-post)

[go template include html](http://stackoverflow.com/questions/18175630/go-template-executetemplate-include-html): 有用blackfriday 轉markdown到html的例子


## display a count on html template in go  

http://stackoverflow.com/questions/14102845/display-a-count-on-html-template-in-go


## os

``` go 
import "os"
```

Package `os` provides a platform-independent interface to operating system functionality.

例如檔案操作(CRUD, Pipe, 是否存在, SameFile), 權限操作(chomod), 目錄操作(chdir, TempDir), 環境變數操作(setenv), Exit, 

設計像Unix-like, 但錯誤處理像Go-like, 錯誤傳回錯誤的值而不是error numbers。


## io

[http://golang.org/pkg/io/](http://golang.org/pkg/io/)

file to disk, the network, STDIN/STDOUT

使用 `[]byte`

### io.Reader

``` go
type Reader interface {
  Read(p []byte) (n int, err error)
}
```

`Reader` 為包裹了基本`Read` method的interface.

## bufio

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

### 將檔案讀到一個string slice去

[golang read text file into string array](http://solvedstack.com/questions/golang-read-text-file-into-string-array-and-write)

## strings 

[http://golang.org/pkg/strings/](http://golang.org/pkg/strings/)

string 可以用加號串聯

注意是string**s**, 提供炒作strings的函式

包含(Contains), Counts, HasPrefix, index, Replace, Split, Trim, 

還有`Reader` 和 `Replacer` type: 

![reader and Replacer](http://imgur.com/PEZfA0al.png)


### func Split

``` go
fmt.Printf("%s\n", strings.Split("a,b,c", ","))
fmt.Printf("%q\n", strings.Split("a man a plan a canal panama", "a "))
fmt.Printf("%q\n", strings.Split("xyz", ""))
fmt.Printf("%q\n", strings.Split("", "Bernardo O'Higgins"))
```

輸出: 

```
[a b c]
["" "man " "plan " "canal panama"]
["x" "y" "z"]
[""]
```

### func Join 

func Split 的相反

### func Fields

A field is separated by one or more space characters. 

``` go
func Fields(s string) []string
``` 

例如: 

``` go
fmt.Printf("Fields are: %q", strings.Fields("  foo bar  baz   "))
```

結果為: 

``` 
Fields are: ["foo" "bar" "baz"]
```

## func FieldsFunc 

FieldsFunc splits the string s at each run of Unicode code points c satisfying f(c) and returns an array of slices of s. If all code points in s satisfy f(c) or the string is empty, an empty slice is returned.  If f does not return consistent results for a given c, FieldsFunc may crash.

不保證切割字串得到的slice元素排列順序和原來字串一樣

``` go
package main

import (
  "fmt"
  "strings"
  "unicode"
)

func main() {
  f := func(c rune) bool {
    return !unicode.IsLetter(c) && !unicode.IsNumber(c)
  }
  fmt.Printf("%q", strings.FieldsFunc("  foo1;bar2,baz3...", f))
}
```

得到: 

```
["foo1" "bar2" "baz3"]
```

再來一個例子: 

``` go 
f := func(c rune) bool {
  return c == ',' || c == ':' || c == ' '
}
fmt.Printf("Fields are: %q", strings.FieldsFunc(" cat,dog:bird", f))   
```

注意 `rune`型別表示的是該符號的unicode code point, 為int32型別, 表示寫法為單引號。

## unicode 

Package unicode provides data and functions to test some properties of Unicode code points.

## Basic type

重要官網參考: [Strings, bytes, runes and characters in Go](http://blog.golang.org/strings)

## string 和 bytes 的選擇

[string 或是 byte slice](http://joshua.poehls.me/2014/04/go-101-string-or-byte-slice/)


### type string 

In Go, a string is in effect a read-only slice of bytes

### type rune 

`rune` 是 `int32`的alias, 目的用來代表一個Unicode的代碼點([Code Point](https://en.wikipedia.org/wiki/Code_point)), 例如ASCII有128個code points, 因此可以塞到一個byte(8bit)中去。

`rune`型別就是用來表示Unicode code points。

例如: 

``` 
'⌘'
```

以rune型別來表示為integer value: `0x2318`, 注意rune的表示為*單引號*


## strconv

Package strconv implements conversions to and from string representations of basic data types.

Append(Bool, Float, Int. Quote), Format(Bool, Float, Int..), Parse(Bool, Float...), Quote..



## go 的config檔案應該用哪種好? json ? 

## interface conversions(轉換)

[http://golang.org/doc/effective_go.html#interface_conversions](http://golang.org/doc/effective_go.html#interface_conversions)
 
