# [Go] by Example 筆記(三) -- Functions


![functions](http://www.golang-book.com/public/img/intro/10000000000001FF000000A90C708B88.noatx1.png)

[圖片出處](http://www.golang-book.com/books/intro/7)

什麼是Function? 我覺得上面這張圖說明的太好了: 一個function是一段獨立的程式碼,就好像一個黑盒子一樣,  我們餵進去0到多個參數進去後, 這個黑盒子就會吐出0-多個結果給我們。

目前我們已經寫過了第一個function: 

``` go
func main() {}
```

寫法可以很容易理解: 

``` go 
func plus(a int, b int) int {
  return a + b
}
```

以上表示說, 我們建立了一個function叫作plus, 可以傳入2個type均為int的參數a和b, function傳回的參數type也為int。

如果傳入function的參數都是相同type, 那麼只要宣告一次就好: 

``` go 
func plus(a, b, c int) int {
  return a + b + c
}
```

呼叫function就跟我們熟悉的一樣, 使用 `name(args)`: 

``` go
function main(){
  res := plus(1,2)
}
```

## Multiple Return Values

Go內建支援function的多個傳回值(multiple return values), 在Go裏面是非常常見的手法, 例如從function傳回結果(result)和錯誤值(error)。

以下`(int, int)`表示這個function傳回兩個ints: 

``` go 
func vals() (int, int){
  return 3, 7
}
```

使用該function的時候, 我們可以利用 *multiple assignment* 來接收兩個不同的傳回值: 

``` go
a, b := vals()
```

如果我們只要傳回值的子集合, 就是不要某些傳回值, 那麼就利用blank identifier **_** :

``` go
_, c := vals()
```

## Variadic Functions

Go也支援 Variadic function(可接收可變數量參數的函式)。

``` go
func sum(nums ...int) {
  fmt.Print(nums, " ")
  
  total := 0
  for _, num := range nums {
    total += num
  }
  fmt.Println(total)
}
```

呼叫時候可以傳入不同數量的參數: 

``` go
sum(1, 2)
sum(1, 2, 3)
```

如果要傳入的參數已經存放在slice裡了, 那要用`func(slice...)`的語法如下:

``` go 
nums := []int{1,2,3,4}
sum(nums...)
```

## Closures

Go也支援匿名函式(*anonymous functions*), 用來製作 *closure* 。

``` go
func intSeq() func() int {
  i := 0
  return func() int {
    i += 1
    return i
  }
}
```

這裡的`intSeq` 函式傳回了另外一個我們定義的匿名函式, 這個傳回的函式將變數`i`封裝起來形成closure。

當我們呼叫`intSeq`, 把`intSeq`的值(一個function)給`nextInt`, 這個`nextInt`有其自己的`i`值, 每次我們呼叫`nextInt`, `i`就會一直更新, 例如: 

``` go
  fmt.Println(nextInt())
  fmt.Println(nextInt())
  fmt.Println(nextInt())

  newInts := intSeq()
  fmt.Println(newInts()) 
```

將會得到: 

``` bash
1
2
3
1
```

## Recurison

Go也支援遞迴函式(*recursive functions*)

``` go
func fact(n int) int {
  if n == 0 {
    return 1
  }
  return n * fact(n-1)
} 
```


## More

這系列筆記文章都來自於以下局部翻譯或整理: 

[官網 A Tour of Go](https://tour.golang.org/)

[Go by Example](https://gobyexample.com)

[An introduction to programming in Go](http://www.golang-book.com/)
