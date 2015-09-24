# [Go] 重新看Go 

## rune 

https://blog.golang.org/strings


## package go install 和 go build 的差別

go build --> Build compiles the packages named by the import paths, along with their dependencies, but it does not install the results.

go build不會產生output file, 除非使用go install, 就會在$GOPATH/pkg/linux_amd64/github.com/luchoching/ 下面產生像是 stringutil.a 檔案


## package name

` package name`

where name is the package's default name for imports. (All files in a package must use the same name.)

Go's convention is that the package name is the last element of the import path: the package imported as "crypto/rot13" should be named rot13.

Executable commands must always use package main.

## Testing 

使用`testing` package, 和 `go test` command。

要寫test的話, 只要寫結尾為`_test.go`的檔案, 裏面包括的function格式像是`TestXXX(t *testing.T)`

function失敗會呼叫`t.Error`或是`t.Fail`

## comments 

每個package應該都要有一個 package comment, 多個檔案的package, 只要在其中一個檔案註釋就行 :D

簡短就可不需特別格式, 會出現在godoc: 

``` go
// Package path implements utility routines for
// manipulating slash-separated filename paths.
```

每個匯出(exported, capitalized)的名字都應該要有doc comment, 每個comment應該都用該name開頭,
這樣幫助我們利用像是`$ godoc regexp | grep parse`查找:

``` go
// Compile parses a regular expression and returns, if successful, a Regexp
// object that can be used to match against text.
func Compile(str string) (regexp *Regexp, err error) {
```

## grouping 宣告

可以用來指出items之間的關係

```
var (
    countLock   sync.Mutex
    inputCount  uint32
    outputCount uint32
    errorCount  uint32
)
```

## 命名 naming

只要開頭是大寫, 該名字就可以在該package以外被看到

### package name

習慣用小寫, 不需用下底線或混合大小寫

### 使用提示

golang的lib說明都有example, 可以直接操作example來run看看測試結果

Another convention is that the package name is the base name of its source directory;

`src/encoding/base64`是用`encoding/base64`來import, 其name是`base64`

建議用短名字, 長名字不一定會比較好讀, 建議使用doc comment會比較有價值

### Getters 

假設我們有一個field叫作`owner`(小寫表示unexported, private), get方法應該叫`Owner`(大寫, exported)而不是`GetOwner`

**The use of upper-case names for export provides the hook to discriminate the field from the method.**

set method就可以叫`SetOwner`: 

```
owner := obj.Owner()
if owner != user {
  obj.SetOwner(user)
}
```

### Interface names

習慣上, 只有一個method的interface, 都用method name加上`er`後綴來命名, 例如`Reader`, `Writer`, `Formatter`

### MixedCaps 

Go採用`MixedCaps`或是`mixedCaps`的命名方式, 而不是用下底線來區分單詞的名字


## For 

跟C對照來說, 統合了for和while 

```
//Like a C for
for init; condition; post{}

//Like a C while
for condition {}

//Like a C for(;;)
for {}
```

Short declarations make it easy to declare the index variable right in the loop: 

```
sum := 0
for i := 0; i < 10; i++ {
    sum += i
}
```

### for strings

`range`可以對string最更多工作

**The name (with associated builtin type) *rune* is Go terminology for a single Unicode code point.**

例如 `日`的rune就是`U+65E5`


## Switch 

Go的switch比C的更通用。

**待續** effective go 

## 聯結

官網wiki的go資源蒐集: https://github.com/golang/go/wiki/Projects

利用 https://godoc.org/ 搜尋 Go packages

利用 https://groups.google.com/forum/#!forum/golang-nuts  google往上論壇找資料!! 

https://golang.org/src/  go package source 也就等於是如何使用Go語言的範例
