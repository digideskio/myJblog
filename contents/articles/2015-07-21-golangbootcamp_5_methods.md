# [Golang] golangbootcamp 補遺(五) -- Methods 

延續閱讀[golang bootcamp](http://www.golangbootcamp.com/) 筆記補遺。

## OOP?

技術上來說, Go並不屬於物件導向程式語言, 因為其不支援繼承, 而是用`interface`的概念取代。

`method`在物件導向的術語來說, 就是一個物件(object)的實體(instance)的函式(function)。

Go沒有類別(classes), 然而可以用定義struct型別加上methods來思考。

## Code organization

建議用以下組織的方式撰寫Go: 

``` go 
package models

// list of packages to import
import (
  "fmt"
)

// list of constants
const (
  ConstExample = "const before vars"
)

// list of variables
var (
  ExportedVar    = 42
  nonExportedVar = "so say we all"
)

// Main type(s) for the file,
// try to keep the lowest amount of structs per file when possible.
type User struct {
  FirstName, LastName string
  Location            *UserLocation
}

type UserLocation struct {
  City    string
  Country string
}

// List of functions
func NewUser(firstName, lastName string) *User {
  return &User{FirstName: firstName,
    LastName: lastName,
    Location: &UserLocation{
      City:    "Santa Monica",
      Country: "USA",
    },
  }
}

// List of methods
func (u *User) Greeting() string {
  return fmt.Sprintf("Dear %s %s", u.FirstName, u.LastName)
}
```

當然, 我們可以在任何型別(type)上定義新的method, 而非只有structs。

但是不能定義從不同package來的型別, 或是在basic type上定義新的method。

## Type aliasing

要在不是屬於我們的型別上加method(例如 basic types), 那就定義一個alias:

``` go
package main

import (
  "fmt"
  "strings"
)

type MyStr string

func (s MyStr) Uppercase() string {
  return strings.ToUpper(string(s))
}

func main() {
  fmt.Println(MyStr("test").Uppercase())
}
```

## Method receivers

Method 可以跟型別(例如`User`)或是指到該型別的指標(例如`*User`)做關聯, 那要使用**pointer receiver**的原因, 其中之一為避免每次呼叫method, 都要重新拷貝值(如果value type是大型struct的時候會更有效率), 例如: 

``` go
package main

import (
  "fmt"
)

type User struct {
  FirstName, LastName string
}

func (u *User) Greeting() string {
  return fmt.Sprintf("Dear %s %s", u.FirstName, u.LastName)
}

func main() {
  u := &User{"Matt", "Aimonetti"}
  fmt.Println(u.Greeting())
}
```

`Greeting`如果是使用value type當參數, 意味每次呼叫`Greeting()`,就會拷貝一次`User` struct, 改成用指標的話, 就只有拷貝指標,這樣拷貝的成本就比較低廉。

另外一個理由是, 我們想要藉由method來修改receiver所指向的目標, 例如: 

``` go 
package main

import (
  "fmt"
  "math"
)

type Vertex struct {
  X, Y float64
}

func (v *Vertex) Scale(f float64) {
  v.X = v.X * f
  v.Y = v.Y * f
}

func (v *Vertex) Abs() float64 {
  return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

func main() {
  v := &Vertex{3, 4}
  v.Scale(5)
  fmt.Println(v, v.Abs()) //&{15 20} 25
}
```

指定struct值的時候, 若省略`&` 而寫成`v := Vertex{3,4}`, Go也會自動判斷。不過還是寫上`&`利於程式碼的閱讀。
