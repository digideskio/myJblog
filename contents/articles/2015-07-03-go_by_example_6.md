# [Go] by Exanmple 筆記(六) -- Select, Timeout, Non-Blocking Channel

## Select 

Go的`select` statement 很像`switch`, 不過是給channels的。

goruntines, channel, 加上 select 是Go的強大特色。


``` go
package main
import (
  "fmt"
  "time"
)
func main() {
  c1 := make(chan string)
  c2 := make(chan string)
  go func() {
    time.Sleep(time.Second * 1)
    c1 <- "one"
  }()
  go func() {
    time.Sleep(time.Second * 2)
    c2 <- "two"
  }()
  for i := 0; i < 2; i++ {
    select {
    case msg1 := <-c1:
      fmt.Println("received", msg1)
    case msg2 := <-c2:
      fmt.Println("received", msg2)
    }
  }
}
```

這裡我們建立兩個channels: c1和c2 ,  隔一個時間後就會各自收到一個值。

利用`select`同時等待這兩個數值, 當其中一個值到的時候就印出每個值。

得到結果為: 

``` 
received one
received two
```

整個的執行時間約為2秒, 因為兩個sleep 1秒和2秒是同步執行的。


## timeout 

`select` statement通常用來實作`timeout`

Timeouts 對用來連接外埠資料的或是要結合執行時間的程式很重要。

例如以下程式片斷: 

``` go 
  c1 := make(chan string, 1)
  go func() {
    time.Sleep(time.Second * 2)
    c1 <- "result 1"
  }()
```

這個goroutine就像摹擬執行一個外部呼叫, 在2秒後傳回結果到channel c1。

``` go
  select {
  case res := <-c1:
    fmt.Println(res)
  case <-time.After(time.Second * 1):
    fmt.Println("timeout 1")
  } 
```

這裡的select實作了一個timeout, `res:=<-c1`會等待結果, `<-time.After`等待接收結果若超過1秒就timeout。

因為`select`會先收到第一個ready的狀態, 所以如果接受結果超過1秒的話, 就會得到timeout。執行時間需要2秒, 因此會先select `<-time.After`的case, 印出`timeout 1`。

## Non-Blocking Channel Operations

基本上在Channel之間的收送都是blocking的, 不過我們可以利用`select`和`default`來實作non-blocking。

``` go
  messages := make(chan string)
  select {
  case msg := <-messages:
    fmt.Println("received message", msg)
  default:
    fmt.Println("no message received")
  }
```

這裡我們實作了non-blocking receive。如果有收到messages, select就會選擇`<-message` case列印出received messge字樣, 若沒有就立刻選擇`default` case。

同理也可以製作non-blocking case, 或是混合, 例如以下為non-blocking接收messages和signals: 

``` go 
  select {
  case msg := <-messages:
    fmt.Println("reveived message", msg)
  case sig := <-signals:
    fmt.Println("reveived signal", sig)
  default:
    fmt.Println("no activity")
  }
```

## More

[官網 A Tour of Go](https://tour.golang.org/)

[Go by Example](https://gobyexample.com)

[An introduction to Programming in Go](http://www.golang-book.com/)
