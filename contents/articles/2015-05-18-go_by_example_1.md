# [Golang] by Example 筆記(一)

除了官網的[A Tour of Go](https://tour.golang.org/), 另外就是[Go by Example](https://gobyexample.com/)了, 感謝網路上這麼多的前輩與資源, 整理一下練Go by Example的印象筆記。

Go安裝與設定請參考: [使用gvm安裝golang, 並設定vim開發環境](posts/2015-05-13-install_and_setting_golang_on_ubuntu_and_vim.html)


## Hello World

hello.go: 

``` go
package main

import "fmt"

// hi
/* hello 
   world */
func main(){
  fmt.Println("hello world")
}
```

第一行是`package declaration`, 每個Go程式第1行都是package宣告, 這是Go用來管理與重複使用程式碼的方式。每個Go程式都是由`package`所組成。

程式會在`main` package開始啟動。

我們在`hello.go`建立了一個叫作`main`的package 

這個程式引用了(import)一個叫作`fmt`的package

引用package的方式可以用:

``` go
import "fmt"
import "math"
```

不過建議都用這樣: 

``` go 
import (
  "fmt"
  "math"
)
```

註解的方法跟常用的C/C++/javascript 都一樣。

執行go程式, 編譯(`build`)程式變成binary, 執行binary: 

``` bash
$ go run hello.go
$ go build hello.go
$ ./hello
```

## Values( Types )

Golang value types包括了 string, interger, float, boolean --> 就如你所想的一樣, 跟我們所熟悉的很像。

String litetals 可以用雙引號(**"**)來表示, 或是用反向單引號(**`**)來表示, 反向單引號就是鍵盤左上角在esc鍵下方那顆

差別在於雙引號可以接受特殊跳脫字元, 例如`\n`, 用反向單引號就如實印出來這樣,不會將跳脫字元轉成特殊字元。


字串可以直接用加號相加。

``` go
package main
import "fmt"                                                                                    
func main() {
  fmt.Println(`Hello World\n`)
  fmt.Println("Hello\nWorld")
  fmt.Println("Hello" + "World")
} 
```

會印出:

``` bash
$ go run hello.go 
Hello World\n
Hello
World
HelloWorld
```
## Variables 

使用 `var` keyword來宣告一個或多個變數並起可以同時賦予值, 宣告的方式就是var, 變數名, 變數type這樣。

如果宣告變數沒有給初始值的話, Go就會給一個**zero-value** , 對int來說, zero-value就是0。

`:=`是一個簡寫的方式, Go就會自動判斷`:=`是屬於哪種type。


``` go
package main
import "fmt" 

func main(){
  var a string = "Hello"
  
  var b, c int = 1, 2

  var d = true

  var e int 
  fmt.Println(e)

  f := "short"
  fmt.PrintLn(f)

  g := 300
  fmt.Println(g+100)
```

## Constants

Go支援 character, string, boolean, numeric value的 constants。

``` go 
const string a = "Hello World"
```

宣告方式跟`var`一樣, 只是改成`const`, var可以出現的地方, const就可以出現

numeric constants一開始沒有type, 除非給他一個,例如type cast 

``` go
const n = 500000000
fmt.Println(math.Sin(n))
```

## Scope

Go 是 block scope 。

## For loop 

單一條件: 

``` go
i := 1
for i <= 3 {
  fmr.Println(i)
  i += 1
}
```

經典的 initial/condition/after for loop: 

``` go 
for j := 7; j <= 9; j++ {
  fmt.Println(j)
}
```

for如果沒有條件, 就會一直循環下去: 

``` go
for {
  fmt.Println("loop")
  break
}
```

## If/Else

就跟大家的印象一樣。

可以在if條件裏面宣告以及初始變數, 在這條件式裏面宣告的變數, 在整個if/else branches都可以使用:

``` go 
if num := 9; num < 0 {
  fmt.Println(num, "is negative")
} else {
  fmt.Println(num, "oh ya!")
}
```

Go沒有`?:`(ternary if)。

## Switch 

就跟大家的印象一樣。


可以把多個expressions放在相同的case statement上,

case也可以是運算式: 


``` go
switch time.Now().Weekday() {
  case time.Saturday, time.Sunday:
    fmt.Println("it's the weekend")
  default:
    fmt.Println("it's a weekday")
}
```

switch若沒有expression, 就像是if/else一樣: 

``` go 
witch {
  case t.Hour() < 12:
    fmt.Println("it's before noon")
  default:
    fmt.Println("it's after noon")
}
```


## More

對 C/C++ 有經驗的朋友, 一定可以很快就上手Go, 另外還加上了python語法的簡潔, 
程式讀起來很快就可以適應與理解其字面,  用起來令人開心阿!


[Go by Example](https://gobyexample.com)

[An introduction to programming in Go](http://www.golang-book.com/)

