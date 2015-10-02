# [Go] by Example 筆記(五) -- Errors

Go慣用處理錯誤的方式, 是讓function傳回兩個值,例如: 

``` go
fd, err := os.Open("test.go")
if err != nil {
  log.Fatal(err)
}
```




``` go
package main

import (
  "errors"
  "fmt"
)
func f1(arg int) (int, error) {
  if arg == 42 {
    return -1, errors.New("cant work with 42")
  }
  return arg + 3, nil
}
```

這樣我們就可以清楚的看到哪個function傳回錯誤, 
檢查與處理錯誤的方法,就是看`err`有沒有等於`nil`:


``` go
func main() {
  for _, i := range []int{7, 42} {
    if r, e := f1(i); e != nil {
      fmt.Println("f1 failed:", e)
    } else {
      fmt.Println("f1 worked:", r)
    }
  }
} 
```

## 自訂Error Type 

`error` type 是Go內建的 interface: 

``` go
type error interface {
  Error() string
}
```

我們也可以實作error interface, 來建立自定義的error type例如: 

``` go 
type argError struct {
  arg  int
  prob string
}

func (e *argError) Error() string {
  return fmt.Sprintf("%d - %s", e.arg, e.prob)
}

```

改寫function, 使用我們自定義的error (利用`&argError`來建立一個新的struct): 

``` go 
func f2(arg int) (int, error) {
  if arg == 42 {
    return -1, &argError{arg, "can't work with it"}
  }
  return arg + 3, nil
}
```






## More

這系列筆記文章都來自於以下局部翻譯或整理: 

[官網 A Tour of Go](https://tour.golang.org/)

[Go by Example](https://gobyexample.com)

[An introduction to programming in Go](http://www.golang-book.com/)
