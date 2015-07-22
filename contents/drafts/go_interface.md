# [Go] How to use interfaces in Go 

Jordan Oreill的 [How to use interfaces in Go](http://jordanorelli.com/post/32665860244/how-to-use-interfaces-in-go)局部翻譯與筆記。


## The interface{} type

An interface value is constructed of two words of data; one word is used to point to a method table for the value’s underlying type, and the other word is used to point to the actual data being held by that value.

`interface{}`並不等於其他型別, 即使其他型別相當於實作`interface{}`型別, 所以例如以下: 

``` go
package main

import (
    "fmt"
)

func PrintAll(vals []interface{}) {
    for _, val := range vals {
        fmt.Println(val)
    }
}

func main() {
    names := []string{"stanley", "david", "oscar"}
    PrintAll(names)
}
```

將會產生錯誤, 告知:

```
cannot use names (type []string) as type []interface {} in argument to PrintAll
```

必須要將`[]string`轉成`[]interface{}`才成: 

``` go
package main

import (
    "fmt"
)

func PrintAll(vals []interface{}) {
    for _, val := range vals {
        fmt.Println(val)
    }
}

func main() {
    names := []string{"stanley", "david", "oscar"}
    vals := make([]interface{}, len(names))
    for i, v := range names {
        vals[i] = v
    }
    PrintAll(vals)
}
```

## Pointers and interfaces 

## The real world: getting a proper timestamp out of the Twitter API 




