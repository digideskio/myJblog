# [Golang] golangbootcamp 補遺(二) -- structs

閱讀[golang bootcamp](http://www.golangbootcamp.com/) 筆記補遺。

## Structs

如果有物件導向經驗, 可以想像struct像是輕量化的class, 有composition(組合)但是沒有inheritance(繼承)。

Only exported fields (capitalized) can be accessed from outside of a package.

``` go 
package main

import "fmt"

type Point struct {
  X, Y int
}

var (
  p = Point{1, 2}  // has type Point
  q = &Point{1, 2} // has type *Point
  r = Point{X: 1}  // Y:0 is implicit
  s = Point{}      // X:0 and Y:0
)

func main() {
  fmt.Println(p, q, r, s)
}
```

一口氣宣告與賦值的寫法: 

``` go
func test(){
  cases := []struct {
    in, want string
  }{
    {"Hello, world", "dlrow ,olleH"},
    {"Hello, 世界", "界世 ,olleH"},
    {"", ""},
  }
}
```

## Composition --> inheritance

若從物件導向的設計方式來看, 用到很多繼承的特性, 但這是Go不支援的, 反而要從**compoistion(組成)和interface來設計**

``` go
package main

import "fmt"

type User struct {
  Id       int
  Name     string
  Location string
}

type Player struct {
  User
  GameId         int
}

func main() {
  p := Player{}
  p.Id = 42
  p.Name = "Matt"
  p.Location = "LA"
  p.GameId = 90404
  fmt.Printf("%+v", p) //輸出: {User:{Id:42 Name:Matt Location:LA} GameId:90404}
}
```

上例, `Player`就像`User`, 不過多了`GameId`欄位。我們利用`.`來設定每個欄位的值。

也可以透過`struct`來設定欄位值: 

``` go 
main() {
  p := Player{
    User{Id: 42, Name: "Matt", Location: "LA"},
    90404,
  }
  fmt.Printf(
    "Id: %d, Name: %s, Location: %s, Game id: %d\n",
    p.Id, p.Name, p.Location, p.GameId)
  // Directly set a field define on the Player struct
  p.Id = 11
  fmt.Printf("%+v", p)
}
```

我們可以直接設定在`Player` struct所定義的欄位, 得到結果為: 

```
Id: 42, Name: Matt, Location: LA, Game id: 90404
{User:{Id:11 Name:Matt Location:LA} GameId:90404}
```

因為`Player` 是由另外一個struct `User`組成, 所以在`User` struct所定義的methods在`Player`也可以用:

``` go
package main

import "fmt"

type User struct {
  Id             int
  Name, Location string
}

func (u *User) Greetings() string {
  return fmt.Sprintf("Hi %s from %s",
    u.Name, u.Location)
}

type Player struct {
  User
  GameId int
}

func main() {
  p := Player{
    User{Id: 42, Name: "Matt", Location: "LA"},
    90404,
  }
  fmt.Println(p.Greetings()) //輸出: Hi Matt from LA
}
```

這樣等於也實現OO的繼承, 不過變得也很容易理解與使用。

By composing one of your structure with one implementing a given interface, your structure automatically implements the interface.

這樣的方式非常好用, 例如我想要我的`Job` struct擁有像 [logger](http://golang.org/pkg/log/#Logger)這樣的行為, 只要將已經實作好的logger當作是我`Job` struct的一部份:  

``` go 
package main

import (
  "log"
  "os"
)

type Job struct {
  Command string
  Logger  *log.Logger
}

func main() {
  job := &Job{"demo", log.New(os.Stderr, "Job: ", log.Ldate)}
  job.Logger.Print("test")
} 
```

我們的`Job` struct有一個欄位叫作`Logger`, 其型別是一個指向`log.Logger`的指標。當我們初始`Job`的值的時候, 我們設定一個loggger, 接著我們就可以使用已經時做好的method, 例如`job.Logger.Print()`。

還可以使用implicit composition來改寫上個例子: 

``` go 
type Job struct {
  Command string
  *log.Logger //implicit composition
}

func main() {
  job := &Job{"demo", log.New(os.Stderr, "Job: ", log.Ldate)}
  job.Print("starting now...") //注意我們就直接呼叫Print method!
}
```

## Poniter 

``` go 
type User struct {
  Id             int
  Name, Location string
}

type Player struct {
  *User
  GameId int
}
```

`Player`的成員, 利用pointer指向`User`會是比較好的選擇, 因為在Go中, 所有函式的參數是passed by value, 而不是passed by reference, 因此如果我們用的是小的struct,那copy的影響不大, 那現實生活中, 如果像是`User`可能大到不應該用copy的方式, 那就要使用passed by reference(使用pointer)。

