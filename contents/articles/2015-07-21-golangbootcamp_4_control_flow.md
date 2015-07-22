# [Golang] golangbootcamp 補遺(四) -- Control Flow

閱讀[golang bootcamp](http://www.golangbootcamp.com/) 筆記補遺。

## if 

`if`跟C或是Java的很像, 除了`()`不見以外。但是`{}`必要。

``` go
if answer != 42 {
  return "Wrong answer"
}
```

`if`也像`for`一樣, 可以在條件式判斷之前, 先執行簡短的述句(statement)。

如下面例子, 先執行述句(`err := foo()`), 再來執行條件式判斷(`err!=nil`):

``` go
if err := foo(); err!=nil {
  panic(err)
}
```
在if述句條件式宣告的變數, 其變數範圍就在這個`if`區塊(block)裏面。

## for 

Go只有為一個一個looping迴圈結構, 就是`for` loop。

`for`跟C或Java的長的很像, 除了`()`不見以外。但是`{}`必要。

跟C或Java一樣, pre和post statement都可以為空: 

``` go
sum := 1
for ; sum < 1000; {
  sum ++
}
```

上面例子也等於把`for` 當作 `while`, 
若有使用 [gofmt](https://golang.org/cmd/gofmt/), 都會自動格式化成如下: 

``` go
sum := 1
for sum < 1000 {
 sum ++
}
```

利用`for`做無窮迴圈: 

``` go
for {
  //do something in a loop forever
}
```

## switch

通常是拿`switch`來避掉變得複雜及醜陋的`if else`述句: 

``` go 
package main

import (
  "fmt"
  "time"
)

func main() {
  now := time.Now().Unix()
  mins := now % 2
  switch mins {
  case 0:
    fmt.Println("even")
  case 1:
    fmt.Println("odd")
  }
}
``` 

### case statement

switch case 只能比較相同型別

可以設定`default` case, 

可以使用運算式, 例如: `case 3-2:`

可以有多個值, 例如: `case 0, 1, 3:`

可以使用`fallthrough`執行符合case以下的所有條件述句: 

``` go 
package main

import "fmt"

func main() {
  n := 2
  switch n {
  case 0:
    fmt.Println("is zero")
    fallthrough
  case 1:
    fmt.Println("is <= 1")
    fallthrough
  case 2:
    fmt.Println("is <= 2")
    fallthrough
  case 3:
    fmt.Println("is <= 3")
    fallthrough
  case 4:
    fmt.Println("is <= 4")
    fallthrough
  case 5:
    fmt.Println("is <= 5")
    fallthrough
  default:
    fmt.Println("Try again!")
  }
}
```

會印出: 

``` 
is <= 2
is <= 3
is <= 4
is <= 5
Try again!
```

利用`break`跳出switch回圈:

``` go
package main

import (
  "fmt"
  "time"
)

func main() {
  n := 1
  switch n {
  case 0:
    fmt.Println("is zero")
    fallthrough
  case 1:
    fmt.Println("<= 1")
    fallthrough
  case 2:
    fmt.Println("<= 2")
    fallthrough
  case 3:
    fmt.Println("<= 3")
    if time.Now().Unix()%2 == 0 {
      fmt.Println("un pasito pa lante maria")
      break
    }
    fallthrough
  case 4:
    fmt.Println("<= 4")
    fallthrough
  case 5:
    fmt.Println("<= 5")
  }
}
```

## 練習題

50個錢幣要給10個人, 依照每個人母音不同給錢 --> a: 1 coin e: 1 coin i: 2 coins o: 3 coins u: 4 coins

一個人最多分到10個錢幣

輸出應該如下: 

```
map[Matthew:2 Peter:2 Giana:4 Adriano:7 Elizabeth:5 Sarah:2 Augustus:10 Heidi:5 Emilie:6 Aaron:5]
Coins left: 2
```

先給以下程式碼接著寫: 

``` go
package main

import "fmt"

var (
  coins = 50
  users = []string{
    "Matthew", "Sarah", "Augustus", "Heidi", "Emilie",
    "Peter", "Giana", "Adriano", "Aaron", "Elizabeth",
  }
  distribution = make(map[string]int, len(users))
)

func main() {
  fmt.Println(distribution)
  fmt.Println("Coins left:", coins)
}
```

### 解答 

``` go
package main

import "fmt"

var (
  coins = 50
  users = []string{
    "Matthew", "Sarah", "Augustus", "Heidi", "Emilie",
    "Peter", "Giana", "Adriano", "Aaron", "Elizabeth",
  }
  distribution = make(map[string]int, len(users))
)

func main() {
  coinsForUser := func(name string) int {
    var total int
    for i := 0; i < len(name); i++ {
      switch string(name[i]) {
      case "a", "A":
        total++
      case "e", "E":
        total++
      case "i", "I":
        total = total + 2
      case "o", "O":
        total = total + 3
      case "u", "U":
        total = total + 4
      }
    }
    if total > 10 {
      total = 10
    }
    return total
  }

  for _, name := range users {
    v := coinsForUser(name)
    distribution[name] = v
    coins = coins - v
  }
  fmt.Println(distribution)
  fmt.Println("Coins left:", coins)
}
```



