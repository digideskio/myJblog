# [Golang] golangbootcamp 補遺(一)

閱讀[golang bootcamp](http://www.golangbootcamp.com/) 筆記補遺。

## Variables & inferred typing 

變數宣告可用括號一起宣告: 

``` go 
var (
  name, location  string
  age             int
)
```

也可以直接賦值:

``` go 
var (
  name     string = "Prince Oberyn"
  age      int    =  32
  location string = "Dorne"
)
```

inferred typing, 直接依照initializer給的值決定其型別:

``` go
var (
  name     = "Prince Oberyn"
  age      =  32
  location = "Dorne"
)
```


變數可以是任何型別, 包括function: 

``` go 
func main() {
  action := func() {
    //doing something
  }
  action()
}
```

在function裏面才可以用`:=`賦值。所有在function之外的通通都是特定keyword開頭,例如`var`,`func`等等。

[Golang Blog - go's declaration syntax](http://blog.golang.org/gos-declaration-syntax)

## Constants

Constants只能是 character, string, boolean, 或是 numeric value。

不能用`:=`宣告

``` go
const Pi = 3.14
const (
        StatusOK                   = 200
        StatusCreated              = 201
        StatusAccepted             = 202
        StatusNonAuthoritativeInfo = 203
        StatusNoContent            = 204
        StatusResetContent         = 205
        StatusPartialContent       = 206
)
```

## Print 

使用Go的 [fmt/](https://golang.org/pkg/fmt/) package。

`fmt.Prinln`會印出變數值,並且加入new line。

`fmt.Printf`用在當我們要用特定義格式(format specifier)輸出的時候

format specifier有很多, 常用的像`%d`印出10進位數字,  `%s`印出字串, `%q`印出加上雙引號的字串

例如用在輸出slice ,使用`%s` format string 會輸出: 

```
[a b c]
```

若改用`%q`, 會輸出: 

``` 
["a" "b" "c"]
```
使用`fmt.Printf`要分行必須加`\n`。

另外使用`%v`會印出預設的格式, 那`%+v`會印出結構加上field name, 例如:

``` go
ype User struct {
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
  fmt.Printf("%v\n", p) //印出{{42 Matt LA} 90404}
  fmt.Printf("%+v\n", p) //印出{User:{Id:42 Name:Matt Location:LA} GameId:90404}
}
```

`fmt.Printf`和`fmt.Println`傳回所列印出的字數(int)和錯誤(若有的話), `fmt.Sprintf`傳回字串型別:

``` go
func main() {
  name := "Caprica-Six"
  aka := fmt.Sprintf("Number %d", 6)
  fmt.Printf("%s is also known as %s",
    name, aka)
}
```
那`fmt.FPrintf`就是利用`io.Writer`將列印的訊息寫到檔案去。

## Packages and imports 

所有的Go程式都是由`packages`所組成, 程式從`main` package開始執行。

如果要寫的程式是要可以執行的(不是library), 那麼就一定要定義一個`main` package, 並且在`main` package裏面包含 `main()` function。`main()` 函式就是我們寫的程式的進入點。

``` go
package main

func main() {
  print("Hello, World!\n")
}
```

通常不是Go內建的標準函式庫都使用web url來當作namespace。

例如我要使用[blackfriday](https://github.com/russross/blackfriday)的markdown processor pacakage, 那import述句就會寫成: 

``` go
import "github.com/russross/blackfriday"
```

## Code location --> GOPATH

上面import述句告訴compiler要從`github.com/russross/blackfriday`路徑來import該blackfriday package, 不過compiler並不會自動下載(pull down)這個repository, 我們需要手動下載, 這裡利用Go所提供的`go get`指令來取得(當然事先要確認有安裝git): 

``` 
go get github.com/russross/blackfriday
```

這樣就會下載,編譯並安裝該package到我們的`$GOPATH`去。

``` 
$ ls $GOPATH
bin pkg src
```

`bin`包含Go編譯過的二進位檔案, 我們可以在我們的系統路徑加上bin的路徑。

`pkg`包含已經編譯過的可用的函式庫, 這樣編譯器可以直接聯結他們使用而不需要再重新編譯。

`src`包含所有由import路徑所管理的source code: 

```
$ ls $GOPATH/src
9fans.net github.com

$ ls $GOPATH/src/github.com/russross
blackfriday
```

當我們開始寫一個新program或是library, 建議寫在`src`資料夾裏面,並且使用完整標準的路徑, 例如`github.com/<your_username>/<projectname>`。

## Exported names 

當我們引用(import)一個package後, 我們可以使用該package所提供(export)出的變數或是函式等等。

對於Go來說, 只要是**大寫**開頭的名字, 就是可以被引用的, 例如`Foo`就是一個該package可用的名字, `foo`就沒有提供, 為該package私用。

例如: 

``` go 
import (
  "fmt"
  "math"
)

func main() {
  fmt.Println(math.Pi)
}
```

執行ok. 那以下: 

```
func main() {
  fmt.Println(math.pi)
}
```
就會告知：

``` 
cannot refer to unexported name math.pi
```

[Go ducumentation](http://golang.org/pkg/) 或是 [godoc.org](godoc.org) 來尋找各個package或提供的exported names。

## Pointer  --> Mutability

預設function的參數是passed by value,  一個函式庫收到一個value參數並不會改變原來的值: 

``` go
package main

import "fmt"

type Artist struct {
  Name, Genre string
  Songs       int
}

func newRelease(a Artist) int {
  a.Songs++
  return a.Songs
}

func main() {
  me := Artist{Name: "Matt", Genre: "Electro", Songs: 42}
  fmt.Printf("%s released their %dth song\n", me.Name, newRelease(me))
  fmt.Printf("%s has a total of %d songs", me.Name, me.Songs)
}
```

結果為: 

```
Matt released their 43th song
Matt has a total of 42 songs
```

如果要改變傳遞過來的值, 就*pass it by reference* 了: 

``` go
package main

import "fmt"

type Artist struct {
  Name, Genre string
  Songs       int
}

func newRelease(a *Artist) int {
  a.Songs++
  return a.Songs
}

func main() {
  me := &Artist{Name: "Matt", Genre: "Electro", Songs: 42}
  fmt.Printf("%s released their %dth song\n", me.Name, newRelease(me))
  fmt.Printf("%s has a total of %d songs", me.Name, me.Songs)
}
```

得到結果為: 

```
Matt released their 43th song
Matt has a total of 43 songs
```


## More

[effective go - interface conversions and type assertions](http://golang.org/doc/effective_go.html#interface_conversions)
