# [Go] Readfile, WriteFile

先做個要用來讀取的測試檔案`test`: 

```
$ echo "hello" > test
$ echo "go" >> test
$ more test
hello
go
````

## 讀取整個檔案

讀取整個檔案到記憶體中去: 

``` go 
package main
import (
  "fmt"
  "io/ioutil"
)
func check(e error) {
  if e != nil {
    panic(e)
  }
}
func main() {
  dat, err := ioutil.ReadFile("./test")
  check(err)
  fmt.Print(string(dat))
} 
```

便捷的作法, 這裡我們使用 [ioutil](https://golang.org/pkg/io/ioutil/) package, `ioutil`實現了依些實用的I/O函式

`ioutil.ReadFile`定義: 

``` go 
func ReadFile(filename string) ([]byte, error)
```

查看該函式source code, 讀取完檔案後就會close該檔案,傳回 []byte slice, 以及error。

## 讀取檔案特定長度內容

使用`os.Open`函式來讀取檔案, 讀取到的資料放到bytes slice裏面(`f.Read(b1)`):

``` go
package main
import (
  "fmt"
  "os"
)
//...
func main() {
  f, err := os.Open("./test")
  check(err)
  b1 := make([]byte, 5)
  n1, err := f.Read(b1)
  check(err)
  fmt.Printf("%d bytes: %s\n", n1, string(b1))
} 
```

若更動b1的byte長度從5到7, 得到結果為: 

```
5 bytes: hello

Press ENTER or type command to continue
6 bytes: hello


Press ENTER or type command to continue
7 bytes: hello
g
```

第6個byte是分行符號。

## 一行一行讀取檔案

使用 package [bufio](http://golang.org/pkg/bufio/), `bufio`實作buffered I/O, bufio包裹了`io.Reader`或是`io,Writer`成為`Reader`與`Writer`物件,提供更多檔案文字上的函式處理。

看一下`bufio.NewReader`的定義: 

```go
func NewReader(rd io.Reader) *Reader
``` 

實作一行行讀取檔案如下: 


``` go
package main
import (
  "bufio"
  "fmt"
  "os"
)
//...
func main() {
  f, err := os.Open("./test")
  check(err)
  defer f.Close()
  reader := bufio.NewReader(f)
  scanner := bufio.NewScanner(reader)
  for scanner.Scan() {
    fmt.Println(scanner.Text())
  }
}
```

**NewScanner**的定義與範例


## 使用 io.Reader & io.Writer 

from [spf13 slides](http://www.slideshare.net/spf13/7-common-mistakes-in-go-2015?ref=http://spf13.com/presentation/7-common-mistakes-in-go-2015/):

> Simple & flexible interface for many operations around input and output
>
> Provides access to a huge wealth of functionality 
>
> Keeps operations extensible




