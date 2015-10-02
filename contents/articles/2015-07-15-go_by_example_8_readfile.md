# [Go] by Example 筆記(八) -- Reading files


## 讀取整個檔案

最基本讀取檔案的方式, 就是讀取整個檔案到記憶體中去。

Go提供了 [ioutil](https://golang.org/pkg/io/ioutil/) package, 實現了一些實用的I/O函式,以下 利用`ioutil.ReadFile`:

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

`ioutil.ReadFile`定義: 

``` go 
func ReadFile(filename string) ([]byte, error)
```

注意引用ioutil是`io/ioutil`而不是`ioutil`

將檔案讀取成byte型式的slice。

檔案不大的時候, `ioutil.ReadFile`提供了很方便的選擇, 注意ReadFile成功時候`err == nil`而不是`err == EOF`。


## 打開檔案

如果想要對讀取檔案做更多的控制, 那就需要利用Go的 [os](https://golang.org/pkg/os/) package, os package提供跟平台有關的操作介面例如檔案操作。 這裡利用`os.Open`函式: 

``` go
import (
  "os"
  "log"
)
file, err:=os.Open("file.go") //for read access.
defer file.Close()
if err != nil {
  log.Fatal(err)
}
```

注意打開檔案後做完所有處理後, 我們利用`defer file.Close()`將開啟的檔案關閉。

打開檔案失敗的話, 錯誤訊息就會自我解釋: 

``` bash
open file.go: no such file or directory
```

`os.Open`傳回一個`*File`型別, `File`實作`io.Reader` interface:

``` go
func Open(name string) (file *File, err error)
```

`os.Open`或是`os.Create`都是呼叫`os.OpenFile`:

``` go
func OpenFile(name string, flag int, perm FileMode) (file *File, err error)
```

flag例如是`O_RDONLY`只允許讀取, perm像是`0666`這樣。`os.Open`就是呼叫os.OpenFile, 傳入的flag參數為`O_RDONLY`(只允許讀取)。

### type File

`os.File`可以執行的動作如下:  

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

## 一行一行讀取

Go [bufio](http://golang.org/pkg/bufio/ ) package實作 buffered I/O, 包裹`io.Reader`或是`io.Writer`變成新的Reader以及Writer, 新的Reader和Writer就提供了buffer的功能, 特別用在文字處理上。

這裡我們使用`ReadBytes('\n')`或是`ReadString('\n')`或是用`Scanner`(簡單使用還是推荐用Scanner)來達成一行一行讀取檔案的目的。

###  func NewScanner(r io.Reader) *Scanner

我們利用`bufio.NewScnner`取得檔案或是STDIN的`*Scanner`。

`Scanner`型別提供一個用來讀取資料方便的介面。像是一個用newline符號來分行的文字檔案。[#Scanner](http://golang.org/pkg/bufio/#Scanner)

`Scanner`型別可以使用的function包括: 

![bufio.Scanner](http://imgur.com/cOwfuAyl.png)

實作一行一行讀取檔案如下: 

``` go
package main
import (
  "bufio"
  "fmt"
  "os"
)
func main() {
  f, err := os.Open("./test")
  check(err)
  defer f.Close()
  scanner := bufio.NewScanner(f)
  for scanner.Scan() {
    fmt.Println(scanner.Text())
  }
}
```

利用`scanner.Scan()`判定是否還有下一行, 再利用`scanner.Text()`或是 `scanner.Bytes[]`讀取每行資料。

### 使用 ioutil 

當然，另外一種作法就是使用`ioutil.ReadFile`讀取整個檔案, 再利用`strings.Split`切割: 

``` go 
package main
import (
  "fmt"
  "io/ioutil"
  "strings"
)
func main() {
  doc, err := ioutil.ReadFile("./test.md")
  if err != nil {
    panic(err)
  }
  lines := strings.Split(string(doc), "\n")
  for _, line := range lines {
    fmt.Printf("%q\n", line)
  } 
}   
```

問題是這樣最後會多出一行...? . 


## More 

[go by example - reading files](https://gobyexample.com/reading-files)

[golang - read text file into string array and write](http://stackoverflow.com/questions/5884154/golang-read-text-file-into-string-array-and-write)
