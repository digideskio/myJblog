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

## More

[官網 Go Slices: usage and internals](http://blog.golang.org/go-slices-usage-and-internals)

[官網 A Tour of Go](https://tour.golang.org/)

[Go by Example](https://gobyexample.com)
