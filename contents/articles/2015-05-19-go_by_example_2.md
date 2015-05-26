# [Go] by Example 筆記(二) -- Arrays, Slices, Maps, Range

延續[(一)](/posts/2015-05-18-go_by_example_1.html)的內容, 討論Go的資料結構

## Array 

對Go來說, array就是一個有特定長度的元素的有號序列。

以下宣告了一個長度為5, type為int的陣列, 注意陣列元素的初始值為0, 利用內建函式`len`傳回陣列長度: 

``` go 
var a [5]int
a[5] = 100
fmt.Println(a)
fmt.Println(a[5])
fmt.Println(len(a))
```
會印出: 

``` bash
[0 0 0 0 100]
100
5
```

也可以直接宣告並且初始陣列: 

``` go
b := [5]int{1, 2, 3, 4, 5}
```

懶得填陣列長度或是懶得算, 也可以用`...`代替: 

``` go
b := [...]int{1, 2, 3, 4, 5}
```

## Slices

Slice像是功能更強大的array, array長度不能變動, slice可以。

Slice長的就像array, 只是沒有宣告其長度: 

``` go
var s []string
```

這樣會建立一個長度為0的slice。

要建立一個非0長度的slice(元素初始值均為zero-value), 要利用Go內建的`make`: 

``` go
s := make([]string, 3)
fmt.Println(s)
```

會得到以下結果(string的zero-value是一個空白字元): 

``` bash
[   ]
```

操作方法都跟array一樣。

只是slice多了許多好用的操作, 例如`append`: 

``` go
s = append(s, "d", "e")
fmt.Println(s)
```

會得到:

``` bash
[   de]
```

既然叫作Slice, 那代表Slice有一個`slice` operator 來讓我們將現有的slice切片(像Python語法), 使用 `slice[low: high]`: 

``` go
i := s[2:5]
i = s[:5]
i = s[2:]
```

slice也可以直接宣告初始值: 

``` go 
l := []string{"a", "b", "c"}
```

宣告一個新的slice, 可以利用`copy`來做拷貝:

``` go
j := make([]string,3)
copy(j, s)
```

如果j的長度小於s的長度, j就只會拷貝j長度的s, 若j長度大於s, 那多的部份就是初始為zero-value。

## Maps 

Map就是 key-value配對, 就是其他程式語言的`hashes`或是 `dicts`。

要建立一個空的map, 就要使用`make` --> make(male[key-type]val-type) 像這樣:

``` go
m := make(map[string]int)
m["k1"] = 7
m["k2"] = 14
fmt.Println(m)
fmt.Println(len(m))
```

結果為: 

``` bash
map[k1:7 k2:14]
2
```

也可以直接宣告並給定初始值: 

``` go
n := map[string]int{"foo": 1, "bar": 2}
```

利用內建的`delete`刪除key/value: 

``` go 
delete(m, "k2")
```

事實上當我們從map取值的時候, return value有兩個, 第一個是value, 第二個是boolean, 

例如繼承上例, 我們把k2的key-value從m中刪除了, 那麼 : 

``` go
a, b := m["k1"]
c, d := m["k2"]
fmt.Println(a, b)
fmt.Println(c, d)
```

會得到: 

``` bash 
2 true
0 false
```

Go在找map找不到符合的key的時候,會傳回zero value, 像是`0`或是`""`, 不過我們拿到zero value沒啥意義, 這時候我們可以忽略使用 *blank identifier* **_** 來忽略這個傳回值: 

``` go 
_, d := m["k2"]
fmt.Println(d)
```

## Range

`range` iterator 可以幫助我們遍歷(browse)我們上面所提到的資料結構內的元素。

``` go
nums := []int{1, 2, 3, 4}
for index, num := range nums {
  fmt.Println(index, num)
}
```

如果不需要index, 那麼就使用 *blank identifier* 將index忽略掉: 


``` go
nums := []int{1, 2, 3, 4}
for _, num := range nums {
  fmt.Println(num)
}
```

range on map : 

``` go 
k := map[string]string{"a":"apple", "b":"banana"}
for key, value := range k{
  fmt.Println(key, value)
}
```

注意如果是range on string, 那value將會是unicode code, index是開始的byte的index, 例如:

``` go 
for index, value := range "你好go hello" {
  fmt.PrintLn(index, value)
}
```

仔細觀察一下結果: 

``` bash 
0 20320
3 22909
6 103
7 111
8 32
9 104
10 101
11 108
12 108
13 111
```

## More

[官網 Go Slices: usage and internals](http://blog.golang.org/go-slices-usage-and-internals)

[官網 A Tour of Go](https://tour.golang.org/)

[Go by Example](https://gobyexample.com)

[An introduction to programming in Go](http://www.golang-book.com/)
