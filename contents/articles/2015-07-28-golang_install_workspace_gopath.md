# [Golang] Install, workspace, GOPATH

Go更新不頻繁, 好像沒啥必要用[gvm](https://github.com/moovweb/gvm)這樣的工具了, 回頭整理一下[Go- Getting started](https://golang.org/doc/install) 和 [Go - How to Write Go Code](https://golang.org/doc/code.html)。

## 安裝 

環境是 ubuntu 14.04 LTS , 

[下載](https://golang.org/dl/)

解壓縮: 

``` bash
$ sudo tar -C /usr/local -xzf go$VERSION.$OS-$ARCH.tar.gz
```

在`$HOME/.profile`加入: 

``` bash
export PATH=$PATH:/usr/local/go/bin
```

察看安裝結果: 

``` bash
$ go version
go version go1.4.2 linux/amd64
```

## Workspaces 

Go的程式碼必須放置在*workspace*(工作區域)內。 

一個workspace就是一個目錄, 包含以下子目錄: 

  - `src`: Go source code, 就是一堆go package 檔案。 
  - `pkg`: 包含package objects 
  - `bin`: 執行檔(可執行的指令)

`go`工具會build(編譯) source package並且把邊好的binary安裝到`pkg`和`bin`目錄。

`src`的子目錄會包括多個version control repositories(像是 Git或是 Mercurial)。

範例: 

``` 
bin/
  hello                       # command executable
  outyet                      # command executable
pkg/
  linux_amd64/
    github.com/golang/example/
      stringutil.a            # package object
src/
  github.com/golang/example/
    .git/                     # Git repository metadata
    hello/
      hello.go                # command source
    outyet/
      main.go                 # command source
      main_test.go            # test source
    stringutil/
      reverse.go              # package source
      reverse_test.go         # test source
```

這個workspace包含一個repository(example), 這個repository由兩個commands(hello, outyet)以及一個library(stringutil)所組成。

*Commands* 和 *libraries* 由不同種類的source packages所編譯(build)而成 [說明](https://golang.org/doc/code.html#PackageNames)

## GOPATH 環境變數

`GOPATH`環境變數用來指定我們的workspace所在位置。這應該是唯一撰寫Go程式碼需要設定的環境變數,注意不能跟我們Go的安裝路徑相同: 

```
$ mkdir $HOME/go
```

在`$HOME/.profile`中加入: 

``` 
export PATH=$PATH:$GOPATH/bin
```

## Package paths 

避免命名衝突, 建議使用像是github帳號當作base path, 例如 `github.com/user`。

``` bash
$ mkdir -p $GOPATH/src/github.com/user
```

## Your first program (Command source)

要編譯並執行一個簡單的程式, 那首先就是選一個package path, 那我們就在我們的base path下面建立我們的package path, 例如: 

``` bash
$ mkdir $GOPATH/src/github.com/user/hello
```

`hello.go`: 

``` go 
package main

import "fmt"

func main() {
  fmt.Printf("Hello, world.\n")
}
```

使用`go install`來編譯並安裝: 

``` go
go install github.com/user/hello
```

或是到hello目錄下, 直接執行`go install`, 如果有錯誤會印出錯誤, 順利執行就沒有任何顯示。

執行`go install`後產生可執行的binary檔案到worksapce的`bin`目錄下：

``` bash
$ $GOPATH/bin/hello
Hello, world.
```

## Your first library

步驟跟寫一般程式一樣, 先選擇一個package path(這裡選擇`github.com/user/stringutil`), 再建立該package目錄: 

``` bash
$ mkdir $GOPATH/src/github.com/user/stringutil
```

在目錄下`reverse.go`:

``` go
package stringutil

func Reverse(s string) string {
  r := []rune(s)
  for i, j := 0, len(r)-1; i < len(r)/2; i, j = i+1, j-1 {
    r[i], r[j] = r[j], r[i]
  }
  return string(r)
}
```

利用`go build`測試並且編譯我們的package: 

``` go
$ go build github.com/user/stringutil
```

再來修改我們的`hello.go`看是否可以順利使用我們新建的library: 

``` go 
package main

import (
  "fmt"
  "github.com/user/stringutil"
)

func main() {
  fmt.Printf(stringutil.Reverse("!oG ,olleH"))
}
```

`go install`會同時安裝其相關套件, 所以重新`go install  github.com/user/hello`也會安裝`stringutil` package。

檢查目錄結構會包含: 

```
bin/
  hello                 # command executable
pkg/
  linux_amd64/          # this will reflect your OS and architecture
    github.com/user/
      stringutil.a      # package object
src/
  github.com/user/
    hello/
      hello.go          # command source
    stringutil/
      reverse.go        # package source
```

## Testing 

Go 提供了 [testing](http://golang.org/pkg/testing/) package 和 `go test`工具。

要撰寫測試, 就是建立一個名稱結尾為`_test.go`的檔案, 該檔案裏面要包含一個`TestXXX(t *testing.T)`的函式。

例如建立`$GOPATH/src/github.com/user/stringutil/reverse_test.go`: 

``` go
package stringutil

import "testing"

func TestReverse(t *testing.T) {
  cases := []struct {
    in, want string
  }{
    {"Hello, world", "dlrow ,olleH"},
    {"Hello, 世界", "界世 ,olleH"},
    {"", ""},
  }
  for _, c := range cases {
    got := Reverse(c.in)
    if got != c.want {
      t.Errorf("Reverse(%q) == %q, want %q", c.in, got, c.want)
    }
  }
}
```

執行測試: 

```
$ go test github.com/user/stringutil
ok    github.com/user/stringutil 0.165s
```

## remote packages 

使用 `go get`獲取遠端的package來用: 

``` 
$ go get github.com/golang/example/hello
$ $GOPATH/bin/hello
Hello, Go examples!
```

注意`go get`每次都會抓最新的版本..



## More

[Go- Getting started](https://golang.org/doc/install)

[Go - How to Write Go Code](https://golang.org/doc/code.html)

[Organizing Go code - David CrawsShaw 2014](https://talks.golang.org/2014/organizeio.slide#1)
