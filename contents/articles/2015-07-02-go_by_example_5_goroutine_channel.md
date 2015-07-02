# [Go] by Example 筆記(五) -- Goroutines, Channels

## Goroutine

`goroutine`是一個輕量化的執行續

``` go
package main
import "fmt"
func f(from string) {
  for i := 0; i < 3; i++ {
    fmt.Println(from, ":", i)
  }
}
func main() {
  f("direct")
  go f("goroutine")
  go func(msg string) {
    fmt.Println(msg)
  }("going")
  var input string
  fmt.Scanln(&input)
  fmt.Println("done")
} 
```


要在goroutine裏面呼叫函式, 只要使用像是 `go f(s)` 就成了, 這樣就會同步執行一個新的goroutine。

上面例子, 會先執行`f("dorect")`這是同步的, 兩個goroutine為非同步的, 

利用`Scanln` function讓程式要跳出前必須先按下enter, 不然程式執行完就會跳出我們就看不到印出來的內容,

執行結果就可能為如下: 

``` 
$ go run routines.go 
direct : 0
direct : 1
direct : 2
goroutine : 0
goroutine : 1
goroutine : 2
going

done
$ go run routines.go 
direct : 0
direct : 1
direct : 2
goroutine : 0
going
goroutine : 1
goroutine : 2

done
``` 

[官網的例子](https://tour.golang.org/concurrency/1): 

``` go
package main
import (
  "fmt"
  "time"
)
func say(s string) {
  for i := 0; i < 5; i++ {
    time.Sleep(200 * time.Millisecond)
    fmt.Println(s)
  }
}
func main() {
  go say("world")
  say("hello")
} 
```

結果為：

``` 
$ go run routines.go 
hello
world
hello
world
hello
world
hello
world
hello
```

再一個: 

``` go
package main
import (
  "fmt"
)
func f(n int) {
  for i := 0; i < 3; i++ {
    fmt.Println(n, ":", i)
  }
}
func main() {
  for i := 0; i < 4; i++ {
    go f(i)
  }
  var input string
  fmt.Scanln(&input)
}
```

## Channels

`Channels`是連接並發goroutines的管線(pipes)。

我們可以從一個goroutine發送一個數值到channels, 然後從另外一個goroutine接收這個數值。


使用`make(chan val-type)`建立一個新個channel。Channel的型別由其所傳遞的值的型別決定, 例如以下我們建立了一個叫作messages的channel:

``` go
messages := make(chan string)
```

發送一個值到channel 我們使用`channel <-`語法, 例如: 

``` go 
go func(){ messages <- "ping"}()
```

上述例子我們利用一個新的goroutine發送`ping`到mssage channel。

要從channel接收一個值使用`<-`語法, 例如: 

``` go
msg := <-messages
```

完整例子: 

``` go
package main
import (
  "fmt"
)
func main() {
  messages := make(chan string)
  go func() { messages <- "ping" }()
  msg := <-messages
  fmt.Println(msg)
} 
```

會得到印出`ping`的結果。


## Channel Synchronization

Channels提供了兩個goroutines溝通的方法, 兩個goroutine可以利用channel來做同步他們執行的結果, 例如:

``` go
package main
import (
  "fmt"
  "time"
)
func pinger(c chan string) {
  for i := 0; ; i++ {
    c <- "ping"
  }
}
func printer(c chan string) {
  for {
    msg := <-c
    fmt.Println(msg)
    time.Sleep(time.Second * 1)
  }
}
func main() {
  var c chan string = make(chan string)
  go pinger(c)
  go printer(c)
  var input string
  fmt.Scanln(&input)
} 
```

使用channel也好像兩個goroutines做同步運算, 當`pinger`送出一個messagem到channel, `pinger`將會等`printer`收到message後才會進行下一個動作(就是.. blocking)

``` go
func ponger(c chan string) {
  for i := 0; ; i++ {
    c <- "pong"
  }
}
```

修改`main` func: 

``` go 
func main() {
  var c chan string = make(chan string)

  go pinger(c)
  go ponger(c)
  go printer(c)

  var input string
  fmt.Scanln(&input)
}
```

就會得到`ping`和`pong`依序連續輸出的結果。

再來一個例子: 

``` go 
package main
import (
  "fmt" 
  "time"
)
func worker(done chan bool) {
  fmt.Println("working...")
  time.Sleep(time.Second) 
  fmt.Println("done")
  done <- true 
}
func main() {
  done := make(chan bool, 1)
  go worker(done)
  <-done
}
```

function `worker`在做完他自身的事情後, 會透過`done` channel來告訴其他的goroutine本身的工作已經完成(`done <- true`)。

最後一行表示在還沒收到`worker`的結果回傳時都是block住的, 確定收到`done` channel傳回來的結果後才會繼續執行。

如果把最後一行`<-done`移除, 程式就會在`worker`開始前就跳出了。


## Buffered channels

Channel預設是*unbuffered*, 意味著要同時有送(`chan<-`)以及收(`<-chan`)兩端才行。

那`Buffered channels`不需要有接收者, 提供有限數量的數值儲存。

``` go
package main
import "fmt"
func main() {
  messages := make(chan string, 2)
  messages <- "buffered"
  messages <- "channel"
  fmt.Println(<-messages)
  fmt.Println(<-messages)
} 
```

上述我們建立了一個可以儲存兩個值的buffered channel, 

因為 channel是buffered, 所以我們可以送數值到channel而不需要有對應的接受者。

那如果超過buffer大小呢? 例如我們多塞一個數值到channel去: 

``` go
package main
import "fmt"
func main() {
  messages := make(chan string, 2)
  messages <- "buffered"
  messages <- "channel"
  messages <- "foo"
  fmt.Println(<-messages)
  fmt.Println(<-messages)
} 
```

執行就會報錯: 

``` 
fatal error: all goroutines are asleep - deadlock!
```

## Channel Directions

如果我們把channel當作function的參數, 我們可以指定這個channel參數是可以接收或是傳送數值, 這樣大大增加了程式的型別檢查安全性。

``` go
package main
import "fmt"
func ping(pings chan<- string, msg string) {
  pings <- msg
}
func pong(pings <-chan string, pongs chan<- string) {
  msg := <-pings
  pongs <- msg
}
func main() {
  pings := make(chan string, 1)
  pongs := make(chan string, 1)
  ping(pings, "passed msg")
  pong(pings, pongs)
  fmt.Println(<-pongs)
}
```

function `ping`只接受用來傳送數值的channel, function `pong`只接收用來傳送數值的channel `pongs`, 和接收數值的channel `pings`。

## More

[官網 A Tour of Go](https://tour.golang.org/)

[Go by Example](https://gobyexample.com)

[An introduction to Programming in Go](http://www.golang-book.com/)
