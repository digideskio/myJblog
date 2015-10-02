# [Golang] golangbootcamp 補遺(六) -- Interface
閱讀[golang bootcamp](http://www.golangbootcamp.com/) 筆記補遺。

`interface`也是型別(type)的一種, 定義一組methods的集合。

A value of interface type can hold any value that implements those methods.

下面例子我們建立一個只接收`Namer` interface type參數的`Greet`函式, `Namer`這個interface型別我們只定義一個method叫作`Name()`。傳給`Greet()`的參數只要是任何有定義`Name()`的值都可以接受:


``` go
package main

import (
  "fmt"
)

type Namer interface {
  Name() string
}

type User struct {
  FirstName, LastName string
}

func (u *User) Name() string {
  return fmt.Sprintf("%s %s", u.FirstName, u.LastName)
}

func Greet(n Namer) string {
  return fmt.Sprintf("Dear %s", n.Name())
}

func main() {
  u := &User{"Matt", "Aimonetti"}
  fmt.Println(Greet(u))
}
```

**以前我們都依照有哪些種類的data來抽象化我們的設計, 現在interface是依照我們的型別有哪些行為(actions)來做抽象化。**


我們可以繼續定義實作相同interface的新型別, `Greet`函式一樣可以使用: 

``` go
package main

import (
  "fmt"
)

type Namer interface {
  Name() string
}

type User struct {
  FirstName, LastName string
}

func (u *User) Name() string {
  return fmt.Sprintf("%s %s", u.FirstName, u.LastName)
}

type Customer struct {
  Id       int
  FullName string
}

func (c *Customer) Name() string {
  return c.FullName
}

func Greet(n Namer) string {
  return fmt.Sprintf("Dear %s", n.Name())
}

func main() {
  u := &User{"Matt", "Aimonetti"}
  fmt.Println(Greet(u))
  c := &Customer{42, "Francesc"}
  fmt.Println(Greet(c))
}
```

## Interfaces are satisfied implicitly

Implicit interfaces decouple implementation packages from the packages that define the interfaces: neither depends on the other.

Go也鼓勵更精細的設計interface, 因為我們不需要去找出每個interface的實作, 然後在每個實作標記新的interface的名字。

``` go
package main

import (
  "fmt"
  "os"
)

type Reader interface {
  Read(b []byte) (n int, err error)
}

type Writer interface {
  Write(b []byte) (n int, err error)
}

type ReadWriter interface {
  Reader
  Writer
}

func main() {
  var w Writer

  // os.Stdout implements Writer
  w = os.Stdout

  fmt.Fprintf(w, "hello, writer\n")
}
```

在[io](http://golang.org/pkg/io/) package裏面已經定義了與上例相同的`Reader`和`Writer` interface。, 

## Errors 

我們常看到的`error`型別事實上就是一個interface type。一個`error`的變數可以是任何實作`Error()`的值, `Error()`可以用string的方式描述自己 : 

``` go
type error interface {
  Error() string
}
```

因此我們可以靠著實作`error` interface的struct型別, 建立我們自定義的error type: 

``` go
package main

import (
    "fmt"
    "time"
)

type MyError struct {
    When time.Time
    What string
}

func (e *MyError) Error() string {
    return fmt.Sprintf("at %v, %s",
        e.When, e.What)
}

func run() error {
    return &MyError{
        time.Now(),
        "it didn't work",
    }
}

func main() {
    if err := run(); err != nil {
        fmt.Println(err)
    }
}
```





## More 

[Go blog - error handling in Go](http://blog.golang.org/error-handling-and-go)

[jodan orelli - how to use interfaces in go](http://jordanorelli.com/post/32665860244/how-to-use-interfaces-in-go)

[Go Data Structures: Interfaces](http://research.swtch.com/interfaces)
