# [Go] by Example 筆記(七) --  Defer, Panic

## Panic 

Go沒有所謂的`try...catch`來處理exception, `panic`就是我們平常所接觸的"拋出一個exception"。

一個`panic`表示某些事情非預期的出錯了, 大多數時間我們用在把不應該出錯的正常運作快速的導向失敗(拋出異常), 或是處理我們還沒有很好處理的錯誤。

例如: 

``` go
package main
func main(){
  panic("a problem")
}
```

就會立刻panic, 印出錯誤堆疊訊息: 

```
$ go run panic.go 
panic: a problem

goroutine 1 [running]:
main.main()
  /../sample/panic.go:6 +0x64

goroutine 2 [runnable]:
runtime.forcegchelper()
  /.../.gvm/gos/go1.4.2/src/runtime/proc.go:90
runtime.goexit()
  /.../.gvm/gos/go1.4.2/src/runtime/asm_amd64.s:2232 +0x1

  ...
runtime.goexit()
  /.../.gvm/gos/go1.4.2/src/runtime/asm_amd64.s:2232 +0x1
exit status 2
```

`panic`通常用在處理一個函式傳回一個錯誤我們不知道(或是不想)處理, 就呼叫panic。

例如建立檔案: 

``` go
package main
import "os"
func main(){
 _,err:= os.Create("./test")
  if err != nil {
    panic(err)
  }
}
```

## Defer

`Defer`用來確認一個function call是否在一個程式執行後被執行。通常被用來作cleanup。就像其他語言的`ensure`以及`finally`

例如我們現在新建一個檔案,然後寫入資料到檔案, 最後把檔案close關掉, 最後這個close的工作,就是`defer`來做:

``` go
package main

import (
  "fmt"
  "os"
)

func main(){
  f:= createFile("./test")
  defer closeFile(f)
  writeFile(f)
}

func createFile(p string) *os.File {
  fmt.Println("creating")
  f, err := os.Create(p)
  if err != nil {
    panic(err)
  }
  return f
}

func writeFile(f *os.File) {
  fmt.Println("writing")
  fmt.Fprintln(f, "data")
}

func closeFile(f *os.File) {
  fmt.Println("closing")
  f.Close()
}
```

這裡`defer`將會在`writeFile`執行完成後, main要關起來的時候執行。執行結果會依序輸出: 

``` go
$ go run defer.go
creating
writing
closing
```

證明defer是最後執行的。

## db的例子

例如[mgo](https://labix.org/mgo)的例子, 連接db資料庫, 執行完動作後最後把db連線關掉: 

``` go
package main

import (
  "fmt"
  "log"
  "gopkg.in/mgo.v2"
  "gopkg.in/mgo.v2/bson"
)

type Person struct {
  Name string
  Phone string
}

func main() {
  session, err := mgo.Dial("server1.example.com,server2.example.com")
  if err != nil {
    panic(err)
  }
  defer session.Close()

  c := session.DB("test").C("people")
  err = c.Insert(&Person{"Ale", "+55 53 8116 9639"},
         &Person{"Cla", "+55 53 8402 8510"})
  if err != nil {
    log.Fatal(err)
  }
}
```


## More 

[defer, panic and recover - Go blog](http://blog.golang.org/defer-panic-and-recover)

[understanging defer panic and recover](http://www.goinggo.net/2013/06/understanding-defer-panic-and-recover.html) 
