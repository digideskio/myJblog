# [Golang] golangbootcamp 補遺(三) -- Collection Types

閱讀[golang bootcamp](http://www.golangbootcamp.com/) 筆記補遺。

## Array 

長度固定, 不能重新更動陣列長度。

但是可以隱性的宣告陣列長度: 

``` go 
package main

import "fmt"

func main() {
  a := [...]string{"hello", "world!"}
  fmt.Printf("%q", a)
}
```

## Slice

幾乎都用slice取代array。

Slices can be resized since they are just a wrapper on top of another data structure.

![slice1](http://blog.golang.org/go-slices-usage-and-internals_slice-struct.png)


### Making Slices

可以直接賦值建立slice: 

``` go
mySlice := []int{2, 3, 5, 7, 11, 13}
``` 

或是利用`make`可以建立特定長度的空slice, 像以下為`make([]byte, 5)`:

![slice2](http://blog.golang.org/go-slices-usage-and-internals_slice-1.png)

more: 

``` go
func main() {
  cities := make([]string, 3)
  cities[0] = "Santa Monica"
  cities[1] = "Venice"
  cities[2] = "Los Angeles"
  fmt.Printf("%q", cities)
  // ["Santa Monica" "Venice" "Los Angeles"]
}
```

### Appending to a slice

Slice就是一個指向底層陣列的指標, 因此像如下: 

``` go 
func main() {
  cities := []string{}
  cities[0] = "Santa Monica"
}
```

會產生runtime error: 

``` 
panic: runtime error: index out of range
goroutine 1 [running]:
```

因為我們的cities slice指向的是一個長度為0的空陣列。若要加項目到該種slice, 需要使用`append` function:

``` go 
func main() {
  cities := []string{}
  cities = append(cities, "San Diego", "Mountain View")
  fmt.Printf("%q", cities) // ["San Diego" "Mountain View"]
}
```

也可以利用`...` 將一個slice加到另外一個slice: 

``` go
func main() {
  cities := []string{"San Diego", "Mountain View"}
  otherCities := []string{"Santa Monica", "Venice"}
  cities = append(cities, otherCities...)
  fmt.Printf("%q\n", cities) // ["San Diego" "Mountain View" "Santa Monica" "Venice"]
  fmt.Println(len(countries))
}
```

`...`的意思表示該元素為一個collection。要加的slice和被加的slice,其型別必須要相同才行。

利用`len` function來查看slice的長度。

### Nil Slice

``` go
func main() {
  var z []int
  fmt.Println(z, len(z), cap(z)) // [] 0 0
  if z == nil {
      fmt.Println("nil!")
  }
  // nil!
}
```

nil slice長度0, 容量0, nill slice的`zero value`為 `nil`。


## 練習題!

有以下姓名的list, 我需要依照其長度分類切成不同的slice: 

``` go 
package main

var names = []string{"Katrina", "Evan", "Neil", "Adam", "Martin", "Matt",
  "Emma", "Isabella", "Emily", "Madison",
  "Ava", "Olivia", "Sophia", "Abigail",
  "Elizabeth", "Chloe", "Samantha",
  "Addison", "Natalie", "Mia", "Alexis"}

func main() {
  // insert your code here
}
```

實作結果應該印出: 

``` 
[[] [] [Ava Mia] [Evan Neil Adam Matt Emma] [Emily Chloe] 
[Martin Olivia Sophia Alexis] [Katrina Madison Abigail Addison Natalie] 
[Isabella Samantha] [Elizabeth]]
```

### 我的

沒仔細看題目, 我寫的笨解法如下: 

``` go
package main
import "fmt"
var names = []string{"Katrina", "Evan", "Neil", "Adam", "Martin", "Matt",
  "Emma", "Isabella", "Emily", "Madison",
  "Ava", "Olivia", "Sophia", "Abigail",
  "Elizabeth", "Chloe", "Samantha",
  "Addison", "Natalie", "Mia", "Alexis"}
func main() {
  var (
    name1 = []string{}
    name2 = []string{}
    name3 = []string{}
    name4 = []string{}
    name5 = []string{}
    name6 = []string{}
    name7 = []string{}
    name8 = []string{}
    name9 = []string{}
  )
  for _, name := range names {
    switch len(name) {
    case 1:
      name1 = append(name1, name)
    case 2:
      name2 = append(name2, name)
    case 3:
      name3 = append(name3, name)
    case 4:
      name4 = append(name4, name)
    case 5:
      name5 = append(name5, name)
    case 6:
      name6 = append(name6, name)
    case 7:
      name7 = append(name7, name)
    case 8:
      name8 = append(name8, name)
    case 9:
      name9 = append(name9, name)
    }
  }
  fmt.Print(name1, name2, name3, name4, name5, name6, name7, name8, name9)
} 
```

### 解答 

``` go
package main

import "fmt"

var names = []string{"Katrina", "Evan", "Neil", "Adam", "Martin", "Matt",
  "Emma", "Isabella", "Emily", "Madison",
  "Ava", "Olivia", "Sophia", "Abigail",
  "Elizabeth", "Chloe", "Samantha",
  "Addison", "Natalie", "Mia", "Alexis"}

func main() {
  var maxLen int
  for _, name := range names {
    if l := len(name); l > maxLen {
      maxLen = l
    }
  }
  output := make([][]string, maxLen)
  for _, name := range names {
    output[len(name)-1] = append(output[len(name)-1], name)
  }

  fmt.Printf("%v", output)
}
```

先抓出該list每個名字最大長度應該是多少, 再來建立一個長度是名字最大長度的二維slice, 再重新range把姓名塞到對應slice元素中去。

## Map

建立 map: 

``` go
package main
import "fmt"
func main() {
  celebs := map[string]int{
    "AA": 1,
    "BB": 3,
    "CC": 5,
  }
  fmt.Println(celebs)
  fmt.Printf("%#v", celebs)
}  
```

**注意Golang不保證在map裏面key的順序!**


注意Printf使用`%#v`會列印出map的語法: 

```
map[AA:1 BB:3 CC:5]
map[string]int{"CC":5, "AA":1, "BB":3}
```

如先建立map在賦予該map值, 那就要要用`make`: 

``` go
package main

import "fmt"

type Vertex struct {
  Lat, Long float64
}

var m map[string]Vertex

func main() {
  m = make(map[string]Vertex)
  m["Bell Labs"] = Vertex{40.68433, -74.39967}
  fmt.Println(m["Bell Labs"])
}
```

就會列印出: 

``` 
{40.68433 -74.39967}
```

### Mutating map

刪除一個元素: 

``` go 
delete(m, key)
```

檢查看該元素是否存在: 

``` go 
elem, ok := m[key]
```

elem不存在會得到zero value, ok為flase。

## Map練習題!

題目: 

``` go
package main

import (
    "code.google.com/p/go-tour/wc"
)

func WordCount(s string) map[string]int {
    return map[string]int{"x": 1}
}

func main() {
    wc.Test(WordCount)
}
```

`wc.Test`會輸入一系列測試字串, 檢查我們給的map成員是否是該字串每個單字總共出現的次數:

``` 
 f("I am learning Go!") =
  map[string]int{"x":1}
 want:
  map[string]int{"am":1, "learning":1, "Go!":1, "I":1}

```

提示使用 [strings.Fields](http://golang.org/pkg/strings/#Fields)來實作:

``` go
package main

import (
  "code.google.com/p/go-tour/wc"
  "strings"
)

func WordCount(s string) map[string]int {
  words := strings.Fields(s)
  count := make(map[string]int{})
  for _, word := range words {
    count[word]++
  }
  return count
}

func main() {
  wc.Test(WordCount)
}
```

`count[word]++`真的是很特別好用的方式阿... 


## More 

[Go Slices: usage and internals](http://blog.golang.org/go-slices-usage-and-internals)

[effective go#maps](http://golang.org/doc/effective_go.html#maps)

[go blog#maps in action](http://blog.golang.org/go-maps-in-action)
