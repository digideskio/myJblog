# [Go] by Example 筆記(四) -- Structs, Methods, Interfaces

## Structs 

Go的 *structs* 是一種包含一堆named fields的型別, 可以很方便的用來整合一堆相關的資料, 例如:

``` go
type person struct {
  name String
  age int
}
```

上面宣告了一個叫作具有`name`和`age`兩個fields的, 叫作`pperson`的struct type。

我們利用以下的方法建立新的person struct: 

``` go
person{"Bob", 20}

person{name: "Alice", age: 30}

person{name: "Fred"}
```

上述第3種方式, 會把沒有初始化的值賦予 zero-value。

我們也可以利用 `&` prefix來產生(yield) 指向這個struct的指標: 

``` go
&person{name: "Ann", age: 40}
```

利用`.`(dot)來存取struct的field: 

``` go
s := person{name: "Sean", age: 50}
fmt.Println(s.name)
```

Struct是可以被修改的(mutable): 

``` go 
sp := &s
fmt.Println(sp.age)

sp.age = 51
fmt.Println(sp.age)
```

最後的結果就會印出51。


## Methods 

**Go沒有classes。** 不過, structs + methods 就像classes。

不過我們可以在struct type裏面定義function, 叫作 *methods*。

以下我們建立了有一個 *rect的receiver type的method: 

``` go
type rect struct {
    width, height int
}
func (r *rect) area() int {
    return r.width * r.height
}
```

Method可以定義接收pointer或是value type, 例如以下就是value receiver: 

``` go
func (r rect) perim() int {
  return 2*r.width + 2*r.height
}
```

呼叫方式如下:

``` go 
r := rect{width: 10, height: 5}
fmt.Println("area: ", r.area())
fmt.Println("perim:", r.perim())
```

Go會幫我們處理value以及pointer之間的轉換, 不過如果要避免method call都要拷貝額外的參數值, 或是想要更動struct的內容的時候, 可以考慮使用 pointer receiver type。


## Interfaces

Interface type就是定義一組 methods的集合。

例如我們定義一個幾何圖形的interface: 

``` go 
type geomentry interface {
  area() float64
  perim() float64
}
```

再來定義兩個幾何圖形: rect矩型 和 circle圓形兩種types:

``` go
type rect struct {
    width, height float64
}
type circle struct {
    radius float64
}
```

我們可以分別實作rect和circle兩種types的interfaces, 例如rect的:

``` go 
func (r rect) area() float64 {
  return r.width * r.height
}
func (r rect) perim() float64 {
  return 2*r.width + 2*r.height
}
```

實作circle type的interface: 

``` go
func (c circle) area() float64 {
    return math.Pi * c.radius * c.radius
}
func (c circle) perim() float64 {
    return 2 * math.Pi * c.radius
}
```

假設我們的function傳入的參數是interface type, 那麼只要是實作這個interface的type都可以使用這個function: 

``` go
func measure(g geometry) {
  fmt.Println(g)
  fmt.Println(g.area())
  fmt.Println(g.perim())
}
```

例如: 

``` go
r := rect{width: 3, height: 4}
c := circle{radius: 5}

measure(r)
measure(c)
```

### Empty Interface 

Interface就代表兩個事情: 

  - interface 是一組methods的集合
  - interface 也是type的一種

`Interface{}` type表示 empty interface, 一個沒有任何method的interface。

例如: 

``` go
func DoSomething(v interface{}) {
  // ...
}
```

表示我們可以傳任何type到Dosomething函式中, 但是v原來的type會被轉換成`interface{}` type。

在看API的時候會常常看到empty interface: 

``` go
func Println(a ...interface{}) (n int, err error) {
  return Fprintln(os.Stdout, a...)
} 
```

`...interface{}`表示可以餵入任意數量與任意型別的參數。


## More

[how to use interface in go - by jordan orelli](http://jordanorelli.com/post/32665860244/how-to-use-interfaces-in-go)

[what is the meaning of interface in golang](http://stackoverflow.com/questions/23148812/what-is-the-meaning-of-interface-in-golang)

這系列筆記文章都來自於以下局部翻譯或整理: 

[官網 A Tour of Go](https://tour.golang.org/)

[Go by Example](https://gobyexample.com)

[An introduction to programming in Go](http://www.golang-book.com/)
